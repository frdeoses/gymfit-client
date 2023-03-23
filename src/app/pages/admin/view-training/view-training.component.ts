import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ITraining } from 'src/app/interfaces/training-table/training.interface';
import { TrainingService } from 'src/app/services/training/training.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-training',
  templateUrl: './view-training.component.html',
  styleUrls: ['./view-training.component.css'],
})
export class ViewTrainingComponent implements OnInit, OnDestroy {
  trainings: ITraining[] = [];
  subscription: Subscription = new Subscription();

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.trainingService.listTraining().subscribe(
      (data: ITraining[]) => {
        this.trainings = data;
        console.log(this.trainings);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error!!', 'Error al cargar los ejercicios', 'error');
      }
    );

    this.subscription = this.trainingService.refresh$.subscribe(() => {
      this.trainingService.listTraining().subscribe(
        (data: ITraining[]) => {
          this.trainings = data;
          console.log(data);
        },
        (error) => {
          console.error(error);
          Swal.fire('Error!!', 'Error al cargar los ejercicios...', 'error');
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  deleteTraining(trainingId: string) {
    Swal.fire({
      title: 'Eliminar ejercicio',
      text: '¿Estas seguro de eliminar el ejercico?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.trainingService.deleteTraining(trainingId).subscribe(
          (eventIdDeleted: string) => {
            Swal.fire(
              'Ejercicio eliminado',
              'El ejercicio ha sido eliminado correctamente...',
              'success'
            );
          },
          (error) => {
            console.error(error);
            Swal.fire('Error:', 'Error al eliminar el ejercicio...', 'error');
          }
        );
      }
    });
  }

  /**
   * Entrar en modo edicion
   */
  modeEdit() {
    this.trainingService.modeEdit('yes');
  }

  /**
   * Entrar en modo consulta
   */
  modeConsult() {
    this.trainingService.modeEdit('no');
  }
}
