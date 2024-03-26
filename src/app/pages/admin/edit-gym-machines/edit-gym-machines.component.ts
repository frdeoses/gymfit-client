import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { GymMachine, ResponseHTTP } from '@interfaces/index';

import { LoginService } from '@services/login/login.service';
import { MachineService } from '@services/machine.service';
import { ValidatorService } from '@services/validator.service';
import { ViewModeService } from '@services/view-mode.service';

import * as _ from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-gym-machines',
  templateUrl: './edit-gym-machines.component.html',
  styleUrls: ['./edit-gym-machines.component.css'],
})
export class EditGymMachinesComponent implements OnInit, OnDestroy {
  gymMachineId: string = '';
  editMode: boolean | undefined;
  likeAdd: boolean = false;
  rolLoginUser: string = '';
  gymMachine?: GymMachine;

  myForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    model: ['', Validators.required],
    description: [''],
    numMachine: [undefined, []],
    exercisedArea: [''],
    // Agrega las otras propiedades y validaciones aquí
  });

  panelOpenState: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private machineService: MachineService,
    private loginService: LoginService,
    private viewModeService: ViewModeService,
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gymMachineId = this.route.snapshot.params['gymMachineId'];

    this.machineService.getGymMachine(this.gymMachineId).subscribe(
      (response: ResponseHTTP<GymMachine>) => {
        this.myForm.reset(response.body);
        this.gymMachine = response.body;
      },
      (error: HttpErrorResponse) => {
        console.error(error);

        const msjError =
          error.error.error || 'Ha ocurrido un error en el sistema...';

        Swal.fire('Error en el sistema', msjError, 'error');

        this.router.navigate(['/error']);
      }
    );
    let role = this.loginService.getCurrentUserRole();

    if (!_.isUndefined(role)) {
      this.rolLoginUser = role;
    }

    this.editMode = this.viewModeService.getModeEdit() === 'yes' ? true : false;
    this.likeAdd = this.machineService.getLikeAdd() === 'yes' ? true : false;
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
    this.machineService.removeItems();
  }

  public editGymMachine() {
    this.myForm.markAllAsTouched();

    const formValues = this.myForm.value; // Obtén todos los valores del formulario
    this.gymMachine = {
      ...this.gymMachine,
      ...formValues, // Actualiza el objeto user con los valores del formulario
    };

    if (!this.gymMachine) return;

    this.gymMachine.numMachine === 0 || !this.gymMachine.numMachine
      ? this.gymMachine.numMachine++
      : this.gymMachine.numMachine;

    this.machineService.editGymMachine(this.gymMachine).subscribe(
      (response: ResponseHTTP<GymMachine>) => {
        Swal.fire(
          'Máquina de entrenamiento actualizada',
          `La máquina de entrenamiento '${response.body.name}' se ha actualizado con éxito...`,
          'success'
        );
        this.router.navigate(['/admin/gym-machines']);
        this.myForm.reset();
      },
      (error) => {
        const msjError =
          error.error ||
          'Ha ocurrido un error en el sistema y no se ha podido actualizar la máquina de entrenamiento';

        Swal.fire('Error en el sistema', msjError, 'error');
        console.error(error);
      }
    );
  }

  like() {
    this.gymMachine!.like++;
    this.machineService.likeAdd('yes');
    this.likeAdd = true;
    if (!this.gymMachine) return;
    this.machineService.editGymMachine(this.gymMachine).subscribe(
      (response: ResponseHTTP<GymMachine>) => {
        console.log('like add and update success');
      },
      (error) => {
        console.error(error);
      }
    );
  }

  modeEdit() {
    this.viewModeService.modeEdit('yes');
    this.editMode = true;
  }
  /**
   * Entrar en modo consulta
   */
  modeConsult() {
    this.editMode = false;
    this.viewModeService.modeEdit('no');
  }

  isValidField(field: string) {
    return this.validatorService.isValidField(this.myForm, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(field, this.myForm);
  }

  getMessage(field: string) {
    return this.validatorService.getMessageErrorFieldOptional(field);
  }
}
