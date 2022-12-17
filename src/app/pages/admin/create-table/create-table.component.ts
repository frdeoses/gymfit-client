import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TablesService } from 'src/app/services/tables/tables.service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ITrainingTable } from 'src/app/interfaces/training-table/trainingTable.interface';

@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.css'],
})
export class CreateTableComponent implements OnInit {
  table: ITrainingTable = {
    id: '',
    idUser: '',
    name: '',
    description: '',
    creationDate: new Date(),
    typeTraining: 'Pecho',
    initDate: new Date(),
    endDate: new Date(),
    trainingDuration: undefined,
    breakTime: undefined,
    observation: '',
    listTraining: [],
  };

  constructor(
    private tableService: TablesService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  formSubmit() {
    debugger;
    if (_.isEmpty(this.table.name) || _.isNull(this.table)) {
      this.snack.open('El titulo es obligatorio introducirlo!!', '', {
        duration: 3000,
      });
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
}
