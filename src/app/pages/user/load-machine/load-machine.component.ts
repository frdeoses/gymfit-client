import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResponseHTTP } from 'src/app/interfaces/response-http.interface';
import { GymMachine } from 'src/app/interfaces/training-table/gymMachine.interface';
import { MachineService } from '@services/machine.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-load-machine',
  templateUrl: './load-machine.component.html',
  styleUrls: ['./load-machine.component.css'],
})
export class LoadMachineComponent implements OnInit, OnDestroy {
  gymMachines: GymMachine[] = [];
  subscription: Subscription = new Subscription();

  like: number = 0;

  constructor(private machineService: MachineService) {}

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
}
