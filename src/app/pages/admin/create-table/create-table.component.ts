import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ResponseHTTP, Training, TrainingTable, User } from '@interfaces/index';
import { TrainingTypes } from '@interfaces/trainingTypes.enum';

import { TablesService } from '@services/tables.service';
import { TrainingService } from '@services/training.service';
import { UserService } from '@services/user.service';
import { ValidatorService } from '@services/validator.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.css'],
})
export class CreateTableComponent implements OnInit {
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

  table?: TrainingTable;

  trainingTypes: TrainingTypes[] = [
    TrainingTypes.ABS,
    TrainingTypes.BRAZO,
    TrainingTypes.ESPALDA,
    TrainingTypes.HOMBRO,
    TrainingTypes.PECHO,
    TrainingTypes.PIERNAS,
  ];

  listTraining: Training[] = [];
  users: User[] = [];

  constructor(
    private tableService: TablesService,
    private userService: UserService,
    private trainingService: TrainingService,
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
    this.table = {
      ...this.table,
      ...formValues, // Actualiza el objeto user con los valores del formulario
    };

    if (!this.table) return;

    this.tableService.createTable(this.table).subscribe(
      (response: ResponseHTTP<TrainingTable>) => {
        Swal.fire(
          'Tabla de entrenamiento creada:',
          `La table de entrenamiento '${response.body.name}' ha sido creado con éxito`,
          'success'
        );

        this.router.navigate(['/admin/tables']);
        this.myForm.reset();
      },
      (error) => {
        console.error(error);
        const message = error.error.error || 'Error en el sistema';
        Swal.fire('Error', error, 'error');
      }
    );
  }

  isValidField(field: string) {
    return this.validatorService.isValidField(this.myForm, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(field, this.myForm);
  }
}
