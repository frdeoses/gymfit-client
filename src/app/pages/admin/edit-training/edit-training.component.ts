import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITraining } from 'src/app/interfaces/training-table/training.interface';
import { TrainingService } from 'src/app/services/training/training.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-training',
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.css'],
})
export class EditTrainingComponent implements OnInit {
  trainingId: string = '';
  training: ITraining = {
    id: '',
    name: '',
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

  constructor(
    private route: ActivatedRoute,
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
  }

  public editTraining() {
    this.trainingService.editTraining(this.training).subscribe(
      (data: ITraining) => {
        Swal.fire(
          'Entrenamiento actualizado',
          'El entrenamiento se ha modificado con exito...',
          'success'
        );
        this.router.navigate(['/admin/trainings']);
      },
      (error) => {
        Swal.fire(
          'Error en el sistema',
          'El entrenamiento no se ha modificado con exito...',
          'error'
        );
        console.error(error);
      }
    );
  }
}
