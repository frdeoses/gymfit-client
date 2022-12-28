import { Component, OnInit } from '@angular/core';
import { ITrainingTable } from 'src/app/interfaces/training-table/trainingTable.interface';
import { TablesService } from 'src/app/services/tables/tables.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-tables',
  templateUrl: './view-tables.component.html',
  styleUrls: ['./view-tables.component.css'],
})
export class ViewTablesComponent implements OnInit {
  // tables = [
  //   {
  //     idUser: '63162e71413c66181c52ba04',
  //     name: 'Tabla 1',
  //     description: 'Esto es una tabla para trabjar pecho',
  //     creationDate: 6666666666,
  //     typeTraining: 'Pecho',
  //     initDate: 444444444444,
  //     endDate: 8888888888,
  //     trainingDuration: 3,
  //     breakTime: 45,
  //     observation: 'Test',
  //   },
  //   {
  //     idUser: '63162e71413c66181c52ba04',
  //     name: 'Tabla 2',
  //     description: 'Esto es una tabla para trabjar espalda',
  //     creationDate: 6666666666,
  //     typeTraining: 'Espalda',
  //     initDate: 444444444444,
  //     endDate: 8888888888,
  //     trainingDuration: 3,
  //     breakTime: 45,
  //     observation: 'Test',
  //   },
  //   {
  //     idUser: '63162e71413c66181c52ba04',
  //     name: 'Tabla 3',
  //     description: 'Esto es una tabla para trabjar piernas',
  //     creationDate: 6666666666,
  //     typeTraining: 'Piernas',
  //     initDate: 444444444444,
  //     endDate: 8888888888,
  //     trainingDuration: 3,
  //     breakTime: 45,
  //     observation: 'Test',
  //   },
  // ];

  tables: ITrainingTable[] = [];

  constructor(private tableService: TablesService) {}

  ngOnInit(): void {
    this.tableService.listTrainingTable().subscribe(
      (data: ITrainingTable[]) => {
        this.tables = data;
        console.log(this.tables);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error!!', 'Error al cargar las tablas', 'error');
      }
    );
  }
}
