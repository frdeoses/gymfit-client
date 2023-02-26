import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TablesService } from 'src/app/services/tables/tables.service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ITrainingTable } from 'src/app/interfaces/training-table/trainingTable.interface';
import { ITraining } from 'src/app/interfaces/training-table/training.interface';
import { IUser } from 'src/app/interfaces/user/usuario.interface';
import { TrainingService } from 'src/app/services/training/training.service';
import { UserService } from 'src/app/services/user/user.service';
import { MachineService } from 'src/app/services/gym-machine/machine.service';

@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.css'],
})
export class CreateTableComponent implements OnInit {
  table: ITrainingTable = {
    id: '',
    user: {
      name: '',
      username: '',
      birthDate: new Date(),
      authorities: [],
      email: '',
      password: '',
      phone: '',
      surname: '',
    },
    name: '',
    creationDate: new Date(),
    typeTraining: '',
    initDate: new Date(),
    endDate: new Date(),
  };

  trainingTypes: string[] = [];
  listTraining: ITraining[] = [];
  users: IUser[] = [];

  constructor(
    private tableService: TablesService,
    private userService: UserService,
    private machineService: MachineService,
    private trainingService: TrainingService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.trainingService.listTraining().subscribe(
      (data: ITraining[]) => {
        this.listTraining = data;
        console.log(this.listTraining);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error!!', 'Error al cargar los ejercicios', 'error');
      }
    );

    this.machineService.allTrainingType().subscribe(
      (data: string[]) => {
        this.trainingTypes = data;
        console.log(this.trainingTypes);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error:', 'Error al cargar los tipos de ejercicios');
      }
    );

    this.userService.listUser().subscribe(
      (data: IUser[]) => {
        this.users = data;
        console.log(this.users);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error:', 'Error al cargar los usuarios', 'error');
      }
    );
  }

  formSubmit() {
    this.table.user.authorities = [];
    if (_.isNull(this.table) || _.isEmpty(this.table.name)) {
      this.snack.open('El titulo es obligatorio introducirlo!!', '', {
        duration: 3000,
      });
      return;
    }

    if (_.isNull(this.table) || _.isEmpty(this.table.typeTraining)) {
      this.snack.open(
        'El tipo de entrenamiento es obligatorio introducirlo!!',
        '',
        {
          duration: 3000,
        }
      );
      return;
    }

    if (
      _.isNull(this.table) ||
      _.isNull(this.table.user) ||
      _.isEmpty(this.table.user.name)
    ) {
      this.snack.open(
        'El tipo de entrenamiento es obligatorio introducirlo!!',
        '',
        {
          duration: 3000,
        }
      );
      return;
    }

    if (!this.validateDate(this.table.initDate, this.table.endDate)) {
      return;
    }

    this.tableService.createTable(this.table).subscribe(
      (data: ITrainingTable) => {
        this.table.name = '';
        this.table.description = '';
        Swal.fire(
          'Tabla creada!!',
          'La tabla a sido creada con éxito',
          'success'
        );

        this.router.navigate(['/admin/tables']);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error', 'Error al crear la tabla', 'error');
      }
    );
  }
  validateDate(initDate: Date, endDate: Date) {
    if (_.isNull(this.table) || _.isNull(this.table.initDate)) {
      this.snack.open(
        'El inicio de la fecha de entrenamiento es obligatorio introducirlo!!',
        '',
        {
          duration: 3000,
        }
      );
      return false;
    }
    if (_.isNull(this.table) || _.isNull(this.table.endDate)) {
      this.snack.open(
        'El fin de la fecha de entrenamiento es obligatorio introducirlo!!',
        '',
        {
          duration: 3000,
        }
      );
      return false;
    }

    if (this.table.initDate.getDate() >= this.table.endDate.getDate()) {
      this.snack.open('Las fechas introducidas no son correctas!!', '', {
        duration: 3000,
      });
      return false;
    }

    this.table.initDate.setDate(this.table.initDate.getDate() + 1);
    this.table.endDate.setDate(this.table.endDate.getDate() + 1);

    return true;
  }
}
