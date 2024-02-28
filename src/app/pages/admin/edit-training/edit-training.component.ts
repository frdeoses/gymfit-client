import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GymMachine,
  ResponseHTTP,
  Training,
  User,
  WorkedWeights,
} from '@interfaces/index';
import { MachineService } from '@services/gym-machine/machine.service';
import { LoginService } from '@services/login/login.service';
import { TrainingService } from '@services/training/training.service';
import { UserService } from '@services/user/user.service';
import { ValidatorService } from '@services/validator/validator.service';
import { ViewModeService } from '@services/view-mode/view-mode.service';
import * as _ from 'lodash';
import { switchMap } from 'rxjs';
import { WeightDialogComponent } from 'src/app/components/dialog/weight/weight-dialog.component';
import Swal from 'sweetalert2';
import * as uuid from 'uuid';

@Component({
  selector: 'app-edit-training',
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.css'],
})
export class EditTrainingComponent implements OnInit {
  trainingId: string = '';

  editMode: boolean | undefined;

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

  training?: Training;

  trainingTypes: string[] = [];
  gymMachines: GymMachine[] = [];
  users: User[] = [];
  userInTraining?: User;
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
    const rolUser: undefined | string = this.loginService.getCurrentUserRole();

    if (!_.isUndefined(rolUser)) {
      this.rolLogin = rolUser.toUpperCase();
    }

    this.trainingId = this.route.snapshot.params['trainingId'];

    this.userService
      .allRoleUser()
      .pipe(
        switchMap((response: ResponseHTTP<User[]>) => {
          this.users = response.body;
          // Asumiendo que getTraining también retorna un Observable
          return this.trainingService.getTraining(this.trainingId);
        })
      )
      .subscribe((response: ResponseHTTP<Training>) => {
        this.training = response.body;
        this.userInTraining = this.users.find(
          (user) => user.id === this.training?.userId
        );
      });

    this.trainingService.allTrainingType().subscribe(
      (response: ResponseHTTP<string[]>) => {
        this.trainingTypes = response.body;
        console.log(this.trainingTypes);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error:', 'Error al cargar los tipos de ejercicios');
      }
    );

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

    this.editMode = this.viewModeService.getModeEdit() === 'yes' ? true : false;
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
    debugger;
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
        const msjError =
          error.error ||
          'Ha ocurrido un error en el sistema y no se ha podido actualizar el entrenamiento.';

        Swal.fire('Error en el sistema', msjError, 'error');
        console.error(error);
      }
    );
  }

  createWorkedWeight() {
    let listWorkedWeights: WorkedWeights[] = [];

    if (!this.training) return;

    if (
      this.training.listWorkedWeights &&
      this.training.listWorkedWeights.length >= 0
    ) {
      this.training.listWorkedWeights.forEach((w) => {
        listWorkedWeights.push(w);
      });
    }

    const dialogRef = this.dialog.open(WeightDialogComponent, {
      data: {
        id: uuid.v4(),
        date: new Date(),
        serie: 0,
        weight: 0,
      } as WorkedWeights,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (
        !_.isUndefined(listWorkedWeights) &&
        !_.isUndefined(result) &&
        result.serie > 0 &&
        result.weight > 0
      )
        listWorkedWeights.push(result);

      this.addWorkedWeight(listWorkedWeights);
    });
  }

  isValidField(field: string) {
    return this.validatorService.isValidField(this.myForm, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(field, this.myForm);
  }

  getMessage(field: string) {
    return this.validatorService.getMessageErrorFieldOptional(field);
  }

  addWorkedWeight(listWorkedWeight: WorkedWeights[] | undefined) {
    if (!this.training) return;
    if (!_.isEqual(this.training.listWorkedWeights, listWorkedWeight)) {
      this.training.listWorkedWeights = listWorkedWeight;

      this.trainingService.editTraining(this.training).subscribe(
        (response: ResponseHTTP<Training>) => {
          console.log(response);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  /**
   * Entrar en modo edición
   */
  modeEdit() {
    this.viewModeService.modeEdit('yes');
    this.editMode = true;
  }
}
