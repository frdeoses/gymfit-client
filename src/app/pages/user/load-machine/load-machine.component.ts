import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IGymMachine } from 'src/app/interfaces/training-table/gymMachine.interface';
import { MachineService } from 'src/app/services/gym-machine/machine.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-load-machine',
  templateUrl: './load-machine.component.html',
  styleUrls: ['./load-machine.component.css'],
})
export class LoadMachineComponent implements OnInit, OnDestroy {
  gymMachines: IGymMachine[] = [];
  subscription: Subscription = new Subscription();

  like: number = 0;

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

  // likeMachine(id: string): void {

  //   let machine = this.gymMachines.find((m) => m.id === id);

  //   if (machine == undefined || machine.like == undefined)
  //     return console.error('Error: Variable like indefinida');

  //   this.like = machine.like;

  //   machine.like++;

  //   this.machineService.editGymMachine(machine).subscribe(
  //     (data: IGymMachine) => {
  //       console.log('Máquina de entrenamiento actualizado');
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }
}
