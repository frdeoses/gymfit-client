import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';

import {
  GymMachine,
  NewWorkedWeight,
  ResponseHTTP,
  Training,
  TrainingTypes,
  UserRsDto,
  WorkedWeight,
} from '@interfaces/index';

import { LoginService } from '@services/login/login.service';
import { MachineService } from '@services/machine.service';
import { TrainingService } from '@services/training.service';
import { UserService } from '@services/user.service';
import { ValidatorService } from '@services/validator.service';
import { ViewModeService } from '@services/view-mode.service';

import { WeightDialogComponent } from 'src/app/components/dialog/weight/weight-dialog.component';

import * as _ from 'lodash';

import Swal from 'sweetalert2';
import * as uuid from 'uuid';

@Component({
  selector: 'app-edit-training',
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.css'],
})
export class EditTrainingComponent implements OnInit, OnDestroy {
  trainingId: string = '';

  editMode: boolean | undefined;

  subscription: Subscription = new Subscription();

  myForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    typeTraining: [''],
    exercisedArea: [''],
    userId: [undefined, []],
    gymMachine: [undefined, []],
    numRepetitions: [undefined, []],
    numSeries: [undefined, []],
    caloriesBurned: [undefined, []],
    needBeSupervised: [undefined, []],
    // Agrega las otras propiedades y validaciones aquí
  });

  newWorkedWeight: NewWorkedWeight = {
    trainingId: '',
    workedWeight: undefined,
  };

  training?: Training;

  trainingTypes: TrainingTypes[] = [
    TrainingTypes.ABS,
    TrainingTypes.BRAZO,
    TrainingTypes.ESPALDA,
    TrainingTypes.HOMBRO,
    TrainingTypes.PECHO,
    TrainingTypes.PIERNAS,
  ];

  gymMachines: GymMachine[] = [];
  users: UserRsDto[] = [];
  userInTraining?: UserRsDto;
  rolLogin: string = '';

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private loginService: LoginService,
    private userService: UserService,
    private machineService: MachineService,
    private viewModeService: ViewModeService,
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private trainingService: TrainingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const rolUser: string = this.loginService.getCurrentUserRole();

    if (!_.isUndefined(rolUser)) {
      this.rolLogin = rolUser.toUpperCase();
    }

    this.trainingId = this.route.snapshot.params['trainingId'];

    this.userService
      .allRoleUser()
      .pipe(
        switchMap((response: ResponseHTTP<UserRsDto[]>) => {
          this.users = response.body;

          // Asumiendo que getTraining también retorna un Observable
          return this.trainingService.getTraining(this.trainingId);
        })
      )
      .subscribe((response: ResponseHTTP<Training>) => {
        this.training = response.body;
        this.myForm.reset(this.training);

        this.newWorkedWeight.trainingId = this.training.id;

        this.userInTraining = this.users.find(
          (user) => user.id === this.training?.userId
        );
      });

    this.machineService.listGymMachines().subscribe(
      (response: ResponseHTTP<GymMachine[]>) => {
        this.gymMachines = response.body;
        console.log(this.gymMachines);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error:', 'Error al cargar las maquinas de ejercicios');
      }
    );

    this.subscription = this.trainingService.refresh$.subscribe(() => {
      this.trainingService.getTraining(this.trainingId).subscribe(
        (response: ResponseHTTP<Training>) => {
          this.training = response.body;
          console.log(response);
        },
        (error) => {
          console.error(error);
          const message =
            error.error.error ||
            'Ha ocurrido un error en el sistema al actualizar el ejercicio!!';
          Swal.fire('Error:', error, 'error');
        }
      );
    });

    this.editMode = this.viewModeService.getModeEdit() === 'yes' ? true : false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Entrar en modo consulta
   */
  modeConsult() {
    this.editMode = false;
    this.viewModeService.modeEdit('no');
  }

  public editTraining() {
    this.myForm.markAllAsTouched();

    const formValues = this.myForm.value; // Obtén todos los valores del formulario
    this.training = {
      ...this.training,
      ...formValues, // Actualiza el objeto user con los valores del formulario
    };

    if (!this.training) return;
    if (this.training.id === null) this.training.id = this.trainingId;

    this.trainingService.editTraining(this.training).subscribe(
      (response: ResponseHTTP<Training>) => {
        Swal.fire(
          'Entrenamiento actualizado',
          `El entrenamiento '${response.body.name}' se ha modificado con éxito..`,
          'success'
        );
        this.router.navigate(['/admin/trainings']);

        this.myForm.reset();
      },
      (error) => {
        console.error(error);
        const msjError =
          error.error.error ||
          'Ha ocurrido un error en el sistema y no se ha podido actualizar el ejercicio.';

        Swal.fire('Error en el sistema', msjError, 'error');
      }
    );
  }

  createWorkedWeight() {
    if (!this.training) return;

    if (!this.newWorkedWeight.trainingId) return;

    const dialogRef = this.dialog.open(WeightDialogComponent, {
      data: {
        id: uuid.v4(),
        date: new Date(),
        userId: this.loginService.getUser().id,
        serie: 0,
        weight: 0,
      } as WorkedWeight,
    });

    dialogRef.afterClosed().subscribe((workedWeight: WorkedWeight) => {
      console.log('The dialog was closed');
      console.log(workedWeight);

      if (this.isInvalidWorkedWeight(workedWeight)) return;

      this.newWorkedWeight.workedWeight = workedWeight;
      this.newWorkedWeight.workedWeight.userId = this.loginService.getUser().id;
      debugger;

      this.addWorkedWeight(workedWeight);
    });
  }

  isInvalidWorkedWeight(workedWeight: WorkedWeight) {
    if (!workedWeight) return true;

    const { weight, serie } = workedWeight;

    if (weight == null || weight < 0 || serie == null || serie < 0) return true;

    return false;
  }

  isValidField(field: string) {
    return this.validatorService.isValidField(this.myForm, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(field, this.myForm);
  }

  getUsernameById(userId: string | undefined) {
    console.log(userId);
    // Primero, verifica si el 'userId' proporcionado es 'undefined' o una cadena vacía

    if (!userId) {
      console.error(
        "getUsernameById was called with an undefined or empty 'userId'."
      );
      return null; // Retorna 'null' o maneja este caso según sea necesario
    }

    // Encuentra el usuario por 'userId'
    const user = this.users.find((user) => user.id === userId);

    // Si el usuario no se encuentra, puedes manejar este caso de manera adecuada
    if (!user) {
      console.error(`User not found for userId: ${userId}`);
      return null; // Retorna 'null' o ajusta según la necesidad de tu aplicación
    }

    // Retorna el 'username' del usuario encontrado
    return user.username;
  }

  getMessage(field: string) {
    return this.validatorService.getMessageErrorFieldOptional(field);
  }

  addWorkedWeight(workedWeight: WorkedWeight) {
    if (!workedWeight) return;

    this.trainingService.addWorkedWeight(this.newWorkedWeight).subscribe(
      () => {
        Swal.fire(
          'Peso ejercitado añadido',
          `Se ha añadido el peso  '${
            this.newWorkedWeight.workedWeight?.weight || 0
          }' en la serie ${
            this.newWorkedWeight.workedWeight?.serie
          } en el ejercicio ' ${this.training?.name || ''} ' `,
          'success'
        );
      },
      (error) => {
        console.error(error);
        const message = error.error.error || 'Error en el sistema';
        Swal.fire('Error', message, 'error');
      }
    );
  }

  /**
   * Entrar en modo edición
   */
  modeEdit() {
    this.viewModeService.modeEdit('yes');
    this.editMode = true;
  }
}
