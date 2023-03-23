import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { WeightDialogComponent } from 'src/app/components/dialog/weight/weight-dialog.component';
import { IGymMachine } from 'src/app/interfaces/training-table/gymMachine.interface';
import { ITraining } from 'src/app/interfaces/training-table/training.interface';
import { IWorkedWeights } from 'src/app/interfaces/training-table/workedWeights.interface';
import { IUser } from 'src/app/interfaces/user/usuario.interface';
import { MachineService } from 'src/app/services/gym-machine/machine.service';
import { TrainingService } from 'src/app/services/training/training.service';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';
import * as uuid from 'uuid';

@Component({
  selector: 'app-edit-training',
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.css'],
})
export class EditTrainingComponent implements OnInit {
  trainingId: string = '';
  editMode: boolean | undefined;
  training: ITraining = {
    id: '',
    name: '',
    user: {
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
    },
    description: '',
    exercisedArea: '',
    gymMachine: undefined,
    like: 0,
    listWorkedWeights: [],
    numRepetitions: 0,
    numSeries: 0,
    typeTraining: '',

    creationDate: new Date(),
    lastUpdateDate: new Date(),
  };

  trainingTypes: string[] = [];
  gymMachines: IGymMachine[] = [];
  users: IUser[] = [];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private userService: UserService,
    private machineService: MachineService,
    private trainingService: TrainingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.trainingId = this.route.snapshot.params['trainingId'];

    this.trainingService.getTraining(this.trainingId).subscribe(
      (data: ITraining) => {
        this.training = data;
        console.log(this.training);
      },
      (error) => {
        console.error(error);
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

    this.editMode = this.trainingService.getModeEdit() === 'yes' ? true : false;
  }

  public editTraining() {
    this.training.user.authorities = [];
    this.trainingService.editTraining(this.training).subscribe(
      (data: ITraining) => {
        Swal.fire(
          'Entrenamiento actualizado',
          'El entrenamiento se ha modificado con éxito...',
          'success'
        );
        this.router.navigate(['/admin/trainings']);
      },
      (error) => {
        Swal.fire(
          'Error en el sistema',
          'El entrenamiento no se ha modificado con éxito...',
          'error'
        );
        console.error(error);
      }
    );
  }

  createWorkedWeight() {
    debugger;
    let listWorkedWeights: IWorkedWeights[] | undefined = [];

    if (!_.isUndefined(this.training.listWorkedWeights)) {
      listWorkedWeights = this.training.listWorkedWeights;
    }

    const dialogRef = this.dialog.open(WeightDialogComponent, {
      data: {
        id: uuid.v4(),
        date: new Date(),
        serie: 0,
        weight: 0,
      } as IWorkedWeights,
    });

    dialogRef.afterClosed().subscribe((result) => {
      debugger;
      console.log('The dialog was closed');
      if (
        !_.isUndefined(listWorkedWeights) &&
        !_.isUndefined(result) &&
        result.serie > 0 &&
        result.weight > 0
      )
        listWorkedWeights.push(result);

      debugger;
      this.addWorkedWeight(listWorkedWeights);
    });
  }

  addWorkedWeight(listWorkedWeight: IWorkedWeights[] | undefined) {
    debugger;
    // this.training.listWorkedWeights = [];

    if (!_.isEqual(this.training, listWorkedWeight)) {
      this.training.listWorkedWeights = listWorkedWeight;
      this.trainingService.editTraining(this.training).subscribe(
        (data: ITraining) => {
          console.log(data);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
}
