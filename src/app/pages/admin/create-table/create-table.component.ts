import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TablesService } from 'src/app/services/tables/tables.service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TrainingTable } from 'src/app/interfaces/training-table/trainingTable.interface';
import { Training } from 'src/app/interfaces/training-table/training.interface';
import { User } from 'src/app/interfaces/user/usuario.interface';
import { TrainingService } from 'src/app/services/training/training.service';
import { UserService } from 'src/app/services/user/user.service';
import { MachineService } from 'src/app/services/gym-machine/machine.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { ResponseHTTP } from 'src/app/interfaces/response-http.interface';

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

  trainingTypes: string[] = [];
  listTraining: Training[] = [];
  users: User[] = [];

  constructor(
    private tableService: TablesService,
    private userService: UserService,
    private machineService: MachineService,
    private trainingService: TrainingService,
    private snack: MatSnackBar,
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
