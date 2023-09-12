import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITrainingTable } from 'src/app/interfaces/training-table/trainingTable.interface';
import { IUser } from 'src/app/interfaces/user/usuario.interface';
import { LoginService } from 'src/app/services/login/login.service';
import { TablesService } from 'src/app/services/tables/tables.service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-load-table',
  templateUrl: './load-table.component.html',
  styleUrls: ['./load-table.component.css'],
})
export class LoadTableComponent implements OnInit {
  typeTrainingTable: string = '';

  tables: ITrainingTable[] = [];

  userLogin: IUser = {
    id: '',
    name: '',
    username: '',
    password: '',
    userRoles: [],
    surname: '',
    email: '',
    birthDate: new Date(),
    height: undefined,
    phone: '',
    authorities: [],
  };

  constructor(
    private tablesService: TablesService,
    private loginService: LoginService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userLogin = this.loginService.getUser();

    this.userLogin.authorities = [];

    this.route.params.subscribe((params) => {
      this.typeTrainingTable = params['typeTrainingTable'];
      if (_.isUndefined(this.typeTrainingTable)) {
        console.log('Cargando todas las tablas de entrenamiento...');

        this.tablesService.listTrainingTableByUser(this.userLogin).subscribe(
          (data: ITrainingTable[]) => {
            this.tables = data;
            this.typeTrainingTable = 'ALL';
            console.log(this.tables);
          },
          (error) => {
            console.error(error);
            Swal.fire('Error!!', 'Error al cargar las tablas', 'error');
          }
        );
      } else {
        if (this.userLogin.id !== undefined) {
          console.log('Cargando tablas de entrenamiento...');
          this.tablesService
            .getTrainingTableByTypeTraining(
              this.typeTrainingTable,
              this.userLogin.id
            )
            .subscribe(
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
    });
  }
}
