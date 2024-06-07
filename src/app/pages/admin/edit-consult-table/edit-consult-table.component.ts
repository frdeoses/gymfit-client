import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ResponseHTTP,
  Training,
  TrainingTable,
  User,
  UserRsDto,
} from '@interfaces/index';
import { TrainingTypes } from '@interfaces/trainingTypes.enum';

import { LoginService } from '@services/login/login.service';
import { TablesService } from '@services/tables.service';
import { TrainingService } from '@services/training.service';
import { UserService } from '@services/user.service';
import { ValidatorService } from '@services/validator.service';
import { ViewModeService } from '@services/view-mode.service';

import { switchMap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-consult-table',
  templateUrl: './edit-consult-table.component.html',
  styleUrls: ['./edit-consult-table.component.css'],
  providers: [],
})
export class EditConsultTableComponent implements OnInit, OnDestroy {
  tableId: string = '';
  editMode: boolean | undefined;

  userInTable?: UserRsDto;

  myForm: FormGroup = this.fb.group(
    {
      name: ['', Validators.required],
      typeTraining: ['', Validators.required],
      description: [''],
      breakTime: [undefined],
      trainingDuration: [undefined],
      listTraining: [undefined],
      initDate: [undefined, [Validators.required]],
      endDate: [undefined, [Validators.required]],
      userId: [''],
      observation: [''],
      // Agrega las otras propiedades y validaciones aquí
    },
    {
      validators: [
        this.validatorService.validarFecha('initDate'),
        this.validatorService.validarFecha('endDate'),
      ],
    }
  );

  trainingTable?: TrainingTable;

  trainingTypes: TrainingTypes[] = [
    TrainingTypes.ABS,
    TrainingTypes.BRAZO,
    TrainingTypes.ESPALDA,
    TrainingTypes.HOMBRO,
    TrainingTypes.PECHO,
    TrainingTypes.PIERNAS,
  ];

  listTraining: Training[] = [];
  users: UserRsDto[] = [];

  // TODO: Revisar estas validaciones de fechas
  initADD: boolean = false;
  endADD: boolean = false;

  rolLogin: string | undefined = '';

  constructor(
    private tableService: TablesService,
    private userService: UserService,
    private trainingService: TrainingService,
    private loginService: LoginService,
    private router: Router,
    private viewModeService: ViewModeService,
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private route: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    this.viewModeService.removeItem();
  }

  ngOnInit(): void {
    this.initializeUserRole();

    this.initializeTableId();

    this.initializeEditMode();

    this.loadTraining();

    this.loadTrainingType();

    this.loadUserAndTrainingTable();
  }

  initializeUserRole(): void {
    const rolUser = this.loginService.getCurrentUserRole();
    this.rolLogin = rolUser ? rolUser.toUpperCase() : undefined;
  }

  initializeTableId(): void {
    this.tableId = this.route.snapshot.params['tableId'];
  }

  initializeEditMode(): void {
    this.editMode = this.viewModeService.getModeEdit() === 'yes';
  }

  loadTraining(): void {
    this.trainingService.listTraining().subscribe(
      (response: ResponseHTTP<Training[]>) => {
        this.listTraining = response.body;
        console.log(this.listTraining);
      },
      (error) => {
        console.error(error);
        const message = error.error.error || 'Error en el sistema';
        Swal.fire('Error', message, 'error');
      }
    );
  }

  loadTrainingType(): void {
    this.trainingService.listTraining().subscribe(
      (response: ResponseHTTP<Training[]>) => {
        this.listTraining = response.body;
        console.log(this.listTraining);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error!!', 'Error al cargar los ejercicios', 'error');
      }
    );
  }

  loadUserAndTrainingTable(): void {
    this.userService
      .allRoleUser()
      .pipe(
        switchMap((response: ResponseHTTP<UserRsDto[]>) => {
          this.users = response.body;
          // Asumiendo que getTraining también retorna un Observable
          return this.tableService.getTrainingTable(this.tableId);
        })
      )
      .subscribe(
        (response: ResponseHTTP<TrainingTable>) => {
          this.trainingTable = response.body;
          this.myForm.reset(this.trainingTable);

          this.userInTable = this.users.find(
            (user) => user.id === this.trainingTable?.userId
          );
        },
        (error) => {
          console.error(error);
          Swal.fire('Error:', 'Error al cargar los usuarios', 'error');
        }
      );
  }

  formSubmit() {
    this.myForm.markAllAsTouched();

    const formValues = this.myForm.value; // Obtén todos los valores del formulario
    this.trainingTable = {
      ...this.trainingTable,
      ...formValues, // Actualiza el objeto user con los valores del formulario
    };

    if (!this.trainingTable) return;

    this.tableService.editTrainingTable(this.trainingTable).subscribe(
      (response: ResponseHTTP<TrainingTable>) => {
        console.log(response.body);
        Swal.fire(
          'Tabla de entrenamiento guardado:',
          `La tabla de entrenamiento '${response.body.name}' se ha actualizado con éxito.`,
          'success'
        );
        this.router.navigate(['/admin/tables']);
      },
      (error) => {
        console.error(error);

        const msjError =
          error.error.error ||
          'Ha ocurrido un error en el sistema al actualizar la tabla de entrenamiento!!';

        Swal.fire('Error:', msjError, 'error');
      }
    );
  }

  /**
   * Entrar en modo consulta
   */
  modeConsult() {
    this.editMode = false;
    this.viewModeService.modeEdit('no');
  }

  modeEdit() {
    this.viewModeService.modeEdit('yes');
    this.editMode = true;
  }

  isValidField(field: string) {
    return this.validatorService.isValidField(this.myForm, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(field, this.myForm);
  }
}
