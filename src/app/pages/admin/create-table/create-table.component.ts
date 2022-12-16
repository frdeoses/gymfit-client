import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TablesService } from 'src/app/services/tables/tables.service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.css'],
})
export class CreateTableComponent implements OnInit {
  table = {
    idUser: '123',
    name: '',
    description: '',
    creationDate: new Date(),
    typeTraining: 'Pecho',
    initDate: new Date(),
    endDate: undefined,
    trainingDuration: undefined,
    breakTime: undefined,
    observation: '',
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
      (data: any) => {
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
