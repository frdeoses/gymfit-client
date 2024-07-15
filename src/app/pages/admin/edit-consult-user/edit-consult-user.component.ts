import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ResponseHTTP, UserDto, UserRsDto, Weight } from '@interfaces/index';

import { LoginService } from '@services/login/login.service';
import { UserService } from '@services/user.service';
import { ValidatorService } from '@services/validator.service';
import { ViewModeService } from '@services/view-mode.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-consult-user',
  templateUrl: './edit-consult-user.component.html',
  styleUrls: ['./edit-consult-user.component.css'],
})
export class EditConsultUserComponent implements OnInit, OnDestroy {
  userId: string = '';

  listUserWeight: Weight[] | undefined;
  editMode: boolean | undefined;
  navigateProfile: boolean | undefined;

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
      authorities: [],
      // Agrega las otras propiedades y validaciones aquí
    },
    {
      validators: [this.validatorService.validarFecha('birthDate')],
    }
  );

  user?: UserRsDto;
  userDto?: UserDto;

  userLogin: string = '';

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private validatorService: ValidatorService,
    private viewModeService: ViewModeService,
    private loginService: LoginService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userLogin = this.loginService.getUser().username;
    this.userId = this.route.snapshot.params['userId'];

    this.userService.getUser(this.userId).subscribe(
      (response: ResponseHTTP<UserRsDto>) => {
        this.user = response.body;

        this.myForm.reset(this.user);
        this.listUserWeight = this.user.listUserWeight;
        console.log(this.user);
      },
      (error) => {
        console.error(error);
        Swal.fire(
          'Error en el sistema',
          'Ha ocurrido un error en el sistema...',
          'error'
        );

        this.router.navigate(['/error']);
      }
    );

    this.navigateProfile = this.userService.navigateProfile;

    this.editMode = this.viewModeService.getModeEdit() === 'yes' ? true : false;
  }

  ngOnDestroy(): void {
    this.viewModeService.removeItem();
  }

  formSubmit() {
    this.myForm.markAllAsTouched();

    const formValues = this.myForm.value; // Obtén todos los valores del formulario

    if (!this.user) throw new Error('User is undefined!!');

    this.userDto = {
      ...formValues,
      id: this.userId,
      username: this.user.username,
    };

    if (!this.userDto) throw new Error(`UserDto is undefined`);

    this.userService.editUser(this.userDto).subscribe(
      (response: ResponseHTTP<UserRsDto>) => {
        console.log(response);
        const userUpdated = response.body;
        if (!this.user) throw new Error('User is undefined!!');

        this.user = {
          ...userUpdated,
        };

        Swal.fire(
          'Usuario actualizado:',
          `El usuario: '${userUpdated.username}' , ha sido actualizado con éxito..`,
          'success'
        );

        if (this.navigateProfile) {
          this.loginService.setUser(this.user);
          this.router.navigate(['/admin/profile']);
        } else {
          this.router.navigate(['/admin/users']);
        }
      },
      (error) => {
        console.error(error);

        const message =
          error.error.error ||
          'Error en el sistema al actualizar el usuario...';
        Swal.fire('Error:', message, 'error');
      }
    );
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
}
