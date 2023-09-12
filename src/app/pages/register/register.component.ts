import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/user/usuario.interface';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  userForm!: FormGroup;

  user: IUser;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.user = {
      // Inicializa los valores del modelo aquí si es necesario
      username: '',
      password: '',
      name: '',
      surname: '',
      email: '',
      phone: '',
      height: 0,
      weight: 0,
      birthDate: new Date(),
      authorities: [],
      userRoles: [],
    };
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: [this.user.username, Validators.required],
      password: [this.user.password, Validators.required],
      name: [this.user.name, Validators.required],
      surname: [this.user.surname, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      phone: [
        this.user.phone,
        [Validators.pattern('^[0-9]*$'), Validators.required],
      ],
      birthDate: [
        this.user.birthDate,
        [Validators.required, this.validarFecha],
      ],
      height: [],
      weight: [],
      // Agrega las otras propiedades y validaciones aquí
    });
  }

  formSubmit() {
    const formValues = this.userForm.value; // Obtén todos los valores del formulario
    this.user = {
      ...this.user,
      ...formValues, // Actualiza el objeto user con los valores del formulario
    };

    this.userService.createUser(this.user).subscribe(
      (data) => {
        console.log(data);
        Swal.fire(
          'Usuario guardado',
          'Usuario registrado con éxito!!',
          'success'
        );
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error:', 'Ha ocurrido un error en el sistema!!', 'error');
      }
    );
  }

  /**
   * Función personalizada para validar la fecha
   *
   *  */
  validarFecha(control: AbstractControl) {
    const fechaString = control.value;
    const date = new Date(fechaString);
    console.log(date);

    // Verificar si date es un objeto Date válido
    if (isNaN(date.getTime())) {
      return { fechaInvalida: true };
    }

    // Obtener día, mes y año
    const dia = date.getDate();
    const mes = date.getMonth() + 1; // Meses en JavaScript son de 0 a 11
    const anio = date.getFullYear();

    // Formatear en el formato "MM/DD/YYYY" o "DD/MM/YYYY"
    const fechaFormateada =
      mes.toString().padStart(2, '0') +
      '/' +
      dia.toString().padStart(2, '0') +
      '/' +
      anio;

    console.log(fechaFormateada);
    // Aplicar la expresión regular
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/; // Expresión regular para MM/DD/YYYY o DD/MM/YYYY

    if (!regex.test(fechaFormateada)) {
      return { fechaInvalida: true };
    }

    return null;
  }
}
