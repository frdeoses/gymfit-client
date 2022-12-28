import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IGymMachine } from 'src/app/interfaces/training-table/gymMachine.interface';
import { MachineService } from 'src/app/services/gym-machine/machine.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-machines',
  templateUrl: './view-machines.component.html',
  styleUrls: ['./view-machines.component.css'],
})
export class ViewMachinesComponent implements OnInit {
  gymMachines: IGymMachine[] = [];
  subscription: Subscription = new Subscription();

  constructor(private machineService: MachineService) {}

  ngOnInit(): void {
    this.machineService.listGymMachines().subscribe(
      (data: IGymMachine[]) => {
        this.gymMachines = data;
        console.log(this.gymMachines);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error!!', 'Error al cargar las maquinas', 'error');
      }
    );

    this.subscription = this.machineService.refresh$.subscribe(() => {
      this.machineService.listGymMachines().subscribe(
        (data: IGymMachine[]) => {
          this.gymMachines = data;
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
          (eventIdDeleted: string) => {
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

  modeEdit() {
    debugger;
    this.machineService.modeEdit(true);
  }

  modeConsult() {
    debugger;
    this.machineService.modeEdit(false);
  }
}
