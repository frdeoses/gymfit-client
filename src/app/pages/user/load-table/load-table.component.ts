import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  ResponseHTTP,
  TrainingTable,
  User,
  UserRsDto,
} from '@interfaces/index';

import { LoginService } from '@services/login/login.service';
import { TablesService } from '@services/tables.service';

import * as _ from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-load-table',
  templateUrl: './load-table.component.html',
  styleUrls: ['./load-table.component.css'],
})
export class LoadTableComponent implements OnInit {
  typeTrainingTable: string = '';

  tables: TrainingTable[] = [];

  userLogin?: UserRsDto;

  constructor(
    private tablesService: TablesService,
    private loginService: LoginService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userLogin = this.loginService.getUser();

    this.route.params.subscribe((params) => {
      this.typeTrainingTable = params['typeTrainingTable'];
      if (_.isUndefined(this.typeTrainingTable)) {
        console.log('Cargando todas las tablas de entrenamiento...');

        if (!this.userLogin) throw new Error('Falta el  usuario...');
        if (!this.userLogin.id) throw new Error('Falta el id del usuario...');

        this.tablesService.listTrainingTableByUser(this.userLogin.id).subscribe(
          (response: ResponseHTTP<TrainingTable[]>) => {
            this.tables = response.body;
            this.typeTrainingTable = 'ALL';
            console.log(this.tables);
          },
          (error) => {
            console.error(error);
            Swal.fire('Error!!', 'Error al cargar las tablas', 'error');
          }
        );
      } else {
        if (!this.userLogin) throw new Error('Falta el  usuario...');
        if (this.userLogin.id !== undefined) {
          console.log('Cargando tablas de entrenamiento...');
          this.tablesService
            .getTrainingTableByTypeTraining(
              this.typeTrainingTable,
              this.userLogin.id
            )
            .subscribe(
              (response: ResponseHTTP<TrainingTable[]>) => {
                this.tables = response.body;

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
