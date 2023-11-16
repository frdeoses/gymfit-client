import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IGymMachine } from 'src/app/interfaces/training-table/gymMachine.interface';
import { MachineService } from 'src/app/services/gym-machine/machine.service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import * as uuid from 'uuid';

@Component({
  selector: 'app-create-machine',
  templateUrl: './create-machine.component.html',
  styleUrls: ['./create-machine.component.css'],
})
export class CreateMachineComponent implements OnInit, OnDestroy {
  machine: IGymMachine = {
    id: '',
    name: '',
    model: '',
    numMachine: 0,
    like: 0,
    description: '',
    exercisedArea: '',
  };

  panelOpenState: boolean = false;

  trainingTypes: string[] = [];

  constructor(
    private machineService: MachineService,
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
        Swal.fire('Error!!', 'Error al cargar los tipos de ejercicios');
      }
    );
  }

  ngOnDestroy(): void {}

  createMachine() {
    if (_.isNull(this.machine) || _.isEmpty(this.machine.name)) {
      this.snack.open('El nombre es obligatorio introducirlo!!', 'Aceptar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      });
      return;
    }
    if (_.isNull(this.machine) || _.isEmpty(this.machine.model)) {
      this.snack.open(
        'El modelo de la máquina es obligatorio introducirlo!!',
        'Aceptar',
        {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        }
      );
      return;
    }
    this.machine.id = uuid.v4();

    this.machineService.createGymMachine(this.machine).subscribe(
      (data: IGymMachine) => {
        this.machine.name = '';
        this.machine.model = '';
        this.machine.description = '';
        Swal.fire(
          'Máquina creada!!',
          'La maquina ha sido creada con éxito',
          'success'
        );

        this.router.navigate(['/admin/gym-machines']);
      },
      (error) => {
        console.error(error);
        Swal.fire(
          'Error',
          'Error al crear la máquina de entrenamiento',
          'error'
        );
      }
    );
  }

  /**
   * Te descarga en PDF la pantalla
   */
  printPage() {
    window.print();
  }
}
