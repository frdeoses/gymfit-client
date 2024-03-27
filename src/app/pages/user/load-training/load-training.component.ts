import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Training } from 'src/app/interfaces/training-table/training.interface';
import { User } from 'src/app/interfaces/user/usuario.interface';
import { TrainingService } from '@services/training.service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { ResponseHTTP } from 'src/app/interfaces/response-http.interface';
import { LoginService } from '@services/login/login.service';

@Component({
  selector: 'app-load-training',
  templateUrl: './load-training.component.html',
  styleUrls: ['./load-training.component.css'],
})
export class LoadTrainingComponent implements OnInit {
  trainings: Training[] = [];
  subscription: Subscription = new Subscription();
  userLogin: User = {
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

        if (!this.userLogin.id) throw new Error('Falta el id del usuario');

        this.trainingService.listTrainingByUser(this.userLogin.id).subscribe(
          (response: ResponseHTTP<Training[]>) => {
            this.trainings = response.body;
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
              (response: ResponseHTTP<Training[]>) => {
                this.trainings = response.body;

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
