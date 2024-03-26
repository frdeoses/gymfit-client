import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResponseHTTP } from 'src/app/interfaces/response-http.interface';
import { GymMachine } from 'src/app/interfaces/training-table/gymMachine.interface';
import { Training } from 'src/app/interfaces/training-table/training.interface';
import { User } from 'src/app/interfaces/user/usuario.interface';
import { MachineService } from '@services/machine.service';
import { TrainingService } from '@services/training.service';
import { UserService } from '@services/user.service';
import { ValidatorService } from '@services/validator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-training',
  templateUrl: './create-training.component.html',
  styleUrls: ['./create-training.component.css'],
})
export class CreateTrainingComponent implements OnInit {
  training?: Training;

  myForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    typeTraining: [''],
    exercisedArea: [''],
    user: [undefined, []],
    gymMachine: [undefined, []],
    numRepetitions: [undefined, []],
    numSeries: [undefined, []],
    caloriesBurned: [undefined, []],
    supervised: [undefined, []],
    // Agrega las otras propiedades y validaciones aquí
  });

  users: User[] = [];

  trainingTypes: string[] = [];
  gymMachines: GymMachine[] = [];

  constructor(
    private trainingService: TrainingService,
    private machineService: MachineService,
    private userService: UserService,
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
        Swal.fire('Error:', 'Error al cargar los tipos de ejercicios');
      }
    );

    this.machineService.listGymMachines().subscribe(
      (response: ResponseHTTP<GymMachine[]>) => {
        this.gymMachines = response.body;
        console.log(this.gymMachines);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error:', 'Error al cargar las maquinas de ejercicios');
      }
    );

    this.userService.allRoleUser().subscribe(
      (response: ResponseHTTP<User[]>) => {
        this.users = response.body;
        console.log(this.users);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error:', 'Error al cargar los usuarios', 'error');
      }
    );
  }

  createTraining() {
    this.myForm.markAllAsTouched();

    const formValues = this.myForm.value; // Obtén todos los valores del formulario
    this.training = {
      ...this.training,
      ...formValues, // Actualiza el objeto user con los valores del formulario
    };

    if (!this.training) return;

    // if (_.isNull(this.training) || _.isEmpty(this.training.name)) {
    //   this.snack.open('El nombre es obligatorio introducirlo!!', '', {
    //     duration: 3000,
    //   });
    //   return;
    // }

    this.trainingService.createTraining(this.training).subscribe(
      (trainingData: ResponseHTTP<Training>) => {
        Swal.fire(
          'Entrenamiento creado:',
          `El entrenamiento '${trainingData.body.name}' ha sido creado con éxito`,
          'success'
        );

        this.router.navigate(['/admin/trainings']);

        this.myForm.reset();
      },
      (error) => {
        console.error(error);
        const message = error.error.error || 'Error en el sistema';
        Swal.fire('Error', error, 'error');
      }
    );
  }

  isValidField(field: string) {
    return this.validatorService.isValidField(this.myForm, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(field, this.myForm);
  }
}
