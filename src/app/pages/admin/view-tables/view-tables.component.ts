import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ITrainingTable } from 'src/app/interfaces/training-table/trainingTable.interface';
import { TablesService } from 'src/app/services/tables/tables.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-tables',
  templateUrl: './view-tables.component.html',
  styleUrls: ['./view-tables.component.css'],
})
export class ViewTablesComponent implements OnInit, OnDestroy {
  tables: ITrainingTable[] = [];
  subscription: Subscription = new Subscription();

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
    this.subscription = this.tableService.refresh$.subscribe(() => {
      this.tableService.listTrainingTable().subscribe(
        (data: ITrainingTable[]) => {
          this.tables = data;
          console.log(data);
        },
        (error) => {
          console.error(error);
          Swal.fire('Error!!', 'Error al cargar los eventos...', 'error');
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  deleteGymMachine(trainingTableId: string) {
    Swal.fire({
      title: 'Eliminar tabla de entrenamiento',
      text: '¿Estas seguro de que quieres eliminar la siguiente tabla de entrenamiento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tableService.deleteTrainingTable(trainingTableId).subscribe(
          (trainingTableId: string) => {
            Swal.fire(
              'Tabla de entrenamiento eliminada',
              'La tabla de entrenamiento ha sido eliminado correctamente...',
              'success'
            );
          },
          (error) => {
            console.error(error);
            Swal.fire(
              'Error',
              'Error al eliminar la tabla de entrenamiento del sistema...',
              'error'
            );
          }
        );
      }
    });
  }

  /**
   * Entrar en modo edicion
   */
  modeEdit() {
    this.tableService.modeEdit('yes');
  }

  /**
   * Entrar en modo consulta
   */
  modeConsult() {
    this.tableService.modeEdit('no');
  }
}
