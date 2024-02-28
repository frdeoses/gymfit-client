import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResponseHTTP } from 'src/app/interfaces/response-http.interface';
import { GymMachine } from 'src/app/interfaces/training-table/gymMachine.interface';
import { MachineService } from 'src/app/services/gym-machine/machine.service';
import { ViewModeService } from 'src/app/services/view-mode/view-mode.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-machines',
  templateUrl: './view-machines.component.html',
  styleUrls: ['./view-machines.component.css'],
})
export class ViewMachinesComponent implements OnInit, OnDestroy {
  gymMachines: GymMachine[] = [];
  subscription: Subscription = new Subscription();

  constructor(
    private machineService: MachineService,
    private viewModeService: ViewModeService
  ) {}

  ngOnInit(): void {
    this.machineService.listGymMachines().subscribe(
      (response: ResponseHTTP<GymMachine[]>) => {
        this.gymMachines = response.body;
        console.log(this.gymMachines);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error!!', 'Error al cargar las maquinas', 'error');
      }
    );

    this.subscription = this.machineService.refresh$.subscribe(() => {
      this.machineService.listGymMachines().subscribe(
        (response: ResponseHTTP<GymMachine[]>) => {
          this.gymMachines = response.body;
          console.log(response);
        },
        (error) => {
          console.error(error);
          Swal.fire(
            'Error!!',
            'Error al cargar las maquinas de ejercicios...',
            'error'
          );
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  deleteGymMachine(gymMachineId: string) {
    Swal.fire({
      title: 'Eliminar máquina de entrenamiento',
      text: '¿Estas seguro de que quieres eliminar la siguiente máquina de entrenamiento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.machineService.deleteGymMachine(gymMachineId).subscribe(
          (response: ResponseHTTP<string>) => {
            Swal.fire(
              'Máquina eliminado',
              'La máquina ha sido eliminado correctamente...',
              'success'
            );
          },
          (error) => {
            console.error(error);
            Swal.fire(
              'Error',
              'Error al eliminar la maquina del sistema...',
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
    this.viewModeService.modeEdit('yes');
  }

  /**
   * Entrar en modo consulta
   */
  modeConsult() {
    this.viewModeService.modeEdit('no');
  }
}
