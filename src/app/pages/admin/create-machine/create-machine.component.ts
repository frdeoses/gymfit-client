import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GymMachine } from 'src/app/interfaces/training-table/gymMachine.interface';
import { MachineService } from 'src/app/services/gym-machine/machine.service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import * as uuid from 'uuid';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { ResponseHTTP } from 'src/app/interfaces/response-http.interface';
import { TrainingService } from 'src/app/services/training/training.service';

@Component({
  selector: 'app-create-machine',
  templateUrl: './create-machine.component.html',
  styleUrls: ['./create-machine.component.css'],
})
export class CreateMachineComponent implements OnInit, OnDestroy {
  machine?: GymMachine;
  //  = {
  //   id: '',
  //   name: '',
  //   model: '',
  //   numMachine: 0,
  //   like: 0,
  //   description: '',
  //   exercisedArea: '',
  // };

  myForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    model: ['', Validators.required],
    description: [''],
    numMachine: [undefined, []],
    exercisedArea: [''],
    // Agrega las otras propiedades y validaciones aquí
  });

  panelOpenState: boolean = false;

  trainingTypes: string[] = [];

  constructor(
    private machineService: MachineService,
    private trainingService: TrainingService,
    private snack: MatSnackBar,
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.trainingService.allTrainingType().subscribe(
      (response: ResponseHTTP<string[]>) => {
        this.trainingTypes = response.body;
        console.log(this.trainingTypes);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error:', 'Error al cargar los tipos de ejercicios', 'error');
      }
    );
  }

  ngOnDestroy(): void {}

  createMachine() {
    this.myForm.markAllAsTouched();

    const formValues = this.myForm.value; // Obtén todos los valores del formulario
    this.machine = {
      ...this.machine,
      ...formValues, // Actualiza el objeto user con los valores del formulario
    };

    if (!this.machine) return;

    this.machine.numMachine === 0 || !this.machine.numMachine
      ? this.machine.numMachine++
      : this.machine.numMachine;

    this.machineService.createGymMachine(this.machine).subscribe(
      (response: ResponseHTTP<GymMachine>) => {
        Swal.fire(
          'Máquina de entrenamiento creada:',
          `La maquina de entre entrenamiento '${response.body.name}' ha sido creada con éxito`,
          'success'
        );

        this.router.navigate(['/admin/gym-machines']);

        this.myForm.reset();
      },
      (error) => {
        console.error(error);
        Swal.fire(
          'Error:',
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

  isValidField(field: string) {
    return this.validatorService.isValidField(this.myForm, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(field, this.myForm);
  }
}
