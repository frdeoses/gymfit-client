import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ResponseHTTP, UserDto, UserRsDto, Weight } from '@interfaces/index';

import { LoginService } from '@services/login/login.service';
import { UserService } from '@services/user.service';
import { ValidatorService } from '@services/validator.service';
import { ViewModeService } from '@services/view-mode.service';

import * as _ from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css'],
})
export class ProfileUserComponent implements OnInit, OnDestroy {
  myForm: FormGroup = this.fb.group(
    {
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(this.validatorService.emailPattern),
        ],
      ],
      phone: [
        undefined,
        [
          Validators.pattern(this.validatorService.phonePattern),
          Validators.required,
          Validators.minLength(9),
        ],
      ],
      birthDate: [undefined, [Validators.required]],
      height: [],
      weight: [],
      // Agrega las otras propiedades y validaciones aquí
    },
    {
      validators: [this.validatorService.validarFecha('birthDate')],
    }
  );

  user?: UserRsDto;
  userDto?: UserDto;

  subscription: Subscription = new Subscription();

  editMode: boolean | undefined;

  listUserWeight: Weight[] | undefined;

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private viewModeService: ViewModeService
  ) {}

  ngOnInit(): void {
    this.user = this.loginService.getUser();
    this.editMode = this.viewModeService.getModeEdit() === 'yes' ? true : false;

    if (!_.isUndefined(this.user.id)) {
      this.userService.getUser(this.user.id).subscribe(
        (response: ResponseHTTP<UserRsDto>) => {
          this.user = response.body;
          this.listUserWeight = this.user.listUserWeight || [];

          this.myForm.reset(this.user);
          console.log(this.user);
        },
        (error) => {
          console.error(error);
        }
      );
    }

    this.subscription = this.userService.refresh$.subscribe(() => {
      const userId = this.user?.id || '';

      this.userService.getUser(userId).subscribe(
        (response: ResponseHTTP<UserRsDto>) => {
          this.user = response.body;

          console.log(response);
        },
        (error) => {
          console.error(error);
          const message =
            error.error.error ||
            'Error en el sistema al actualizar el usuario..';
          Swal.fire('Error', message, 'error');
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.viewModeService.removeItem();
    this.subscription.unsubscribe();
  }

  formSubmit() {
    this.myForm.markAllAsTouched();

    const formValues = this.myForm.value; // Obtén todos los valores del formulario

    this.userDto = {
      ...formValues,
      id: this.user?.id,
    };

    if (!this.userDto) throw new Error(`UserDto is undefined`);

    this.userService.editUser(this.userDto).subscribe(
      (response: ResponseHTTP<UserRsDto>) => {
        console.log(response.body);
        const userUpdated = response.body;

        Swal.fire(
          'Usuario actualizado:',
          `El usuario: '${userUpdated.username}' , ha sido actualizado con éxito..`,
          'success'
        );

        this.editMode = false;

        this.listUserWeight = userUpdated.listUserWeight
          ? userUpdated.listUserWeight
          : [];

        if (!this.user) throw new Error(`User is undefined`);

        this.user = {
          ...userUpdated,
        };

        this.loginService.setUser(this.user);

        this.viewModeService.modeEdit('no');
        this.router.navigate(['/user-dashboard/profile']);
      },
      (error) => {
        console.error(error);

        Swal.fire(
          'Error:',
          'Ha ocurrido un error en el sistema al actualizar el usuario!!',
          'error'
        );
      }
    );
  }

  modeEdit() {
    this.viewModeService.modeEdit('yes');
    this.editMode = true;
  }
  modeConsult() {
    this.viewModeService.modeEdit('no');
    this.editMode = false;
  }

  isValidField(field: string) {
    return this.validatorService.isValidField(this.myForm, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(field, this.myForm);
  }
}
