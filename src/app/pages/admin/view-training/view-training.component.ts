import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResponseHTTP } from 'src/app/interfaces/response-http.interface';
import { Training } from 'src/app/interfaces/training-table/training.interface';
import { TrainingService } from '@services/training.service';
import { ViewModeService } from '@services/view-mode.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-training',
  templateUrl: './view-training.component.html',
  styleUrls: ['./view-training.component.css'],
})
export class ViewTrainingComponent implements OnInit, OnDestroy {
  trainings: Training[] = [];
  subscription: Subscription = new Subscription();

  constructor(
    private trainingService: TrainingService,
    private viewModeService: ViewModeService
  ) {}

  ngOnInit(): void {
    this.trainingService.listTraining().subscribe(
      (response: ResponseHTTP<Training[]>) => {
        this.trainings = response.body;
        console.log(this.trainings);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error:', 'Error al cargar los ejercicios', 'error');
      }
    );

    this.subscription = this.trainingService.refresh$.subscribe(() => {
      this.trainingService.listTraining().subscribe(
        (response: ResponseHTTP<Training[]>) => {
          this.trainings = response.body;
          console.log(response);
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
      text: '¿Estas seguro de eliminar el ejercicio?',
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
   * Entrar en modo edición
   */
  modeEdit() {
    this.viewModeService.modeEdit('yes');
  }

  /**
   * Entrar en modo consulta
   */
  modeConsult() {
    this.viewModeService.modeEdit('no');
  }
}
