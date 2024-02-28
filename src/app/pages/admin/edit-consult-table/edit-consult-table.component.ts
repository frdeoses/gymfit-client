import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { ResponseHTTP } from 'src/app/interfaces/response-http.interface';
import { Training } from 'src/app/interfaces/training-table/training.interface';
import { TrainingTable } from 'src/app/interfaces/training-table/trainingTable.interface';
import { User } from 'src/app/interfaces/user/usuario.interface';
import { LoginService } from 'src/app/services/login/login.service';
import { TablesService } from 'src/app/services/tables/tables.service';
import { TrainingService } from 'src/app/services/training/training.service';
import { UserService } from 'src/app/services/user/user.service';
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { ViewModeService } from 'src/app/services/view-mode/view-mode.service';
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

  userInTable?: User;

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
      user: [''],
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

  trainingTypes: string[] = [];
  listTraining: Training[] = [];
  users: User[] = [];

  // TODO: Revisar estas validaciones de fechas
  initADD: boolean = false;
  endADD: boolean = false;

  rolLogin: string = '';

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
    const rolUser = this.loginService.getCurrentUserRole();

    if (!_.isUndefined(rolUser)) {
      this.rolLogin = rolUser.toUpperCase();
    }

    this.tableId = this.route.snapshot.params['tableId'];

    this.editMode = this.viewModeService.getModeEdit() === 'yes' ? true : false;

    this.tableService.getTrainingTable(this.tableId).subscribe(
      (response: ResponseHTTP<TrainingTable>) => {
        this.trainingTable = response.body;

        this.myForm.reset(this.trainingTable);

        console.log(this.trainingTable);
      },
      (error: HttpErrorResponse) => {
        console.error(error);

        const msjError =
          error.error.error || 'Ha ocurrido un error en el sistema...';

        Swal.fire('Error en el sistema', msjError, 'error');

        this.router.navigate(['/error']);
      }
    );

    if (this.trainingTable?.userId) {
      this.userService.getUser(this.trainingTable.userId).subscribe(
        (response: ResponseHTTP<User>) => {
          this.userInTable = response.body;
        },
        (error) => {
          console.log(error);
        }
      );
    }

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

    this.userService.allRoleUser().subscribe(
      (response: ResponseHTTP<User[]>) => {
        this.users = response.body;
        console.log(this.users);
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
      (error: ResponseHTTP<TrainingTable>) => {
        console.error(error);

        const msjError =
          error.error ||
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
}
