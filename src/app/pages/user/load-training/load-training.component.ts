import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ITraining } from 'src/app/interfaces/training-table/training.interface';
import { IUser } from 'src/app/interfaces/user/usuario.interface';
import { LoginService } from 'src/app/services/login/login.service';
import { TrainingService } from 'src/app/services/training/training.service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-load-training',
  templateUrl: './load-training.component.html',
  styleUrls: ['./load-training.component.css'],
})
export class LoadTrainingComponent implements OnInit {
  trainings: ITraining[] = [];
  subscription: Subscription = new Subscription();
  userLogin: IUser = {
    id: '',
    name: '',
    username: '',
    password: '',
    userRols: [],
    surname: '',
    email: '',
    birthDate: new Date(),
    height: undefined,
    phone: '',
    authorities: [],
  };

  typeTraining: string = '';

  constructor(
    private trainingService: TrainingService,
    private loginService: LoginService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userLogin = this.loginService.getUser();

    this.userLogin.authorities = [];

    this.route.params.subscribe((params) => {
      this.typeTraining = params['typeTrainings'];
      if (_.isUndefined(this.typeTraining)) {
        console.log('Cargando todas las tablas de entrenamiento...');

        this.trainingService.listTrainingByUser(this.userLogin).subscribe(
          (data: ITraining[]) => {
            this.trainings = data;
            this.typeTraining = 'ALL';
            console.log(this.trainings);
          },
          (error) => {
            console.error(error);
            Swal.fire('Error!!', 'Error al cargar los entrenamientos', 'error');
          }
        );
      } else {
        if (!_.isUndefined(this.userLogin.id)) {
          console.log('Cargando tablas de entrenamiento...');
          this.trainingService
            .getTrainingByTypeTraining(this.typeTraining, this.userLogin.id)
            .subscribe(
              (data: ITraining[]) => {
                this.trainings = data;

                console.log(this.trainings);
              },
              (error) => {
                console.error(error);
                Swal.fire(
                  'Error!!',
                  'Error al cargar los entrenamientos',
                  'error'
                );
              }
            );
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
