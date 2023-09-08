import { Component, OnInit } from '@angular/core';
import { ITraining } from 'src/app/interfaces/training-table/training.interface';
import { MachineService } from 'src/app/services/gym-machine/machine.service';
import { TrainingService } from 'src/app/services/training/training.service';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IGymMachine } from 'src/app/interfaces/training-table/gymMachine.interface';
import { IUser } from 'src/app/interfaces/user/usuario.interface';
import { LoginService } from 'src/app/services/login/login.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-create-training',
  templateUrl: './create-training.component.html',
  styleUrls: ['./create-training.component.css'],
})
export class CreateTrainingComponent implements OnInit {
  training: ITraining = {
    id: '',
    name: '',
    description: '',
    exercisedArea: '',
    user: {
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
    },
    gymMachine: undefined,
    like: 0,
    listWorkedWeights: [],
    numRepetitions: 0,
    numSeries: 0,
    typeTraining: '',
    creationDate: new Date(),
    lastUpdateDate: new Date(),
  };

  users: IUser[] = [];

  // userLogin: IUser = {
  //   id: '',
  //   name: '',
  //   username: '',
  //   password: '',
  //   userRols: [],
  //   surname: '',
  //   email: '',
  //   birthDate: new Date(),
  //   height: undefined,
  //   phone: '',
  //   authorities: [],
  // };

  trainingTypes: string[] = [];
  gymMachines: IGymMachine[] = [];

  constructor(
    private trainingService: TrainingService,
    private machineService: MachineService,
    private userService: UserService,
    private loginService: LoginService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
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

    this.machineService.listGymMachines().subscribe(
      (data: IGymMachine[]) => {
        this.gymMachines = data;
        console.log(this.gymMachines);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error:', 'Error al cargar las maquinas de ejercicios');
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

  createTraining() {
    this.training.user.authorities = [];

    if (_.isNull(this.training) || _.isEmpty(this.training.name)) {
      this.snack.open('El nombre es obligatorio introducirlo!!', '', {
        duration: 3000,
      });
      return;
    }

    this.trainingService.createTraining(this.training).subscribe(
      (data: ITraining) => {
        this.training.name = '';
        this.training.description = '';
        this.training.typeTraining = '';
        Swal.fire(
          'Maquina creada!!',
          'La maquina ha sido creada con éxito',
          'success'
        );

        this.router.navigate(['/admin/trainings']);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error', 'Error al crear la tabla', 'error');
      }
    );
  }
}
