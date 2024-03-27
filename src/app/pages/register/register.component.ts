import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user/usuario.interface';
import { UserService } from '@services/user.service';
import { ValidatorService } from '@services/validator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  myForm: FormGroup = this.fb.group(
    {
      username: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
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
      birthDate: [
        undefined,
        [
          Validators.required,
          // this.validarFecha
        ],
      ],
      height: [],
      weight: [],
      authorities: [],
      // Agrega las otras propiedades y validaciones aquí
    },
    {
      validators: [
        this.validatorService.isFieldOneEqualFieldTwo('password', 'password2'),
        this.validatorService.validarFecha('birthDate'),
      ],
    }
  );

  user: User = {
    //   // Inicializa los valores del modelo aquí si es necesario
    username: '',
    password: '',
    name: '',
    surname: '',
    email: '',
    phone: '',
    birthDate: new Date(),
    authorities: [],
    userRoles: [],
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private validatorService: ValidatorService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.myForm.markAllAsTouched();

    const formValues = this.myForm.value; // Obtén todos los valores del formulario
    this.user = {
      ...this.user,
      ...formValues, // Actualiza el objeto user con los valores del formulario
    };

    if (!this.user) return;
    this.userService.createUser(this.user!).subscribe(
      (data) => {
        console.log(data);
        Swal.fire(
          'Usuario guardado:',
          'Usuario registrado con éxito!!',
          'success'
        );
        this.router.navigate(['/login']);
        this.myForm.reset();
      },
      (error) => {
        console.error(error);
        const message = error.error.error || 'Error en el sistema';
        Swal.fire('Error:', message, 'error');
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
