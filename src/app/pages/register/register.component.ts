import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  user: IUser = {
    id: undefined,
    name: '',
    username: '',
    password: '',
    userRols: [],
    surname: '',
    email: '',
    birthDate: new Date(),
    height: undefined,
    phone: '',
  };

  constructor(
    private userService: UserService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  formSubmit() {
    if (this.user.username == '' || this.user.username == null) {
      this.snack.open('El nombre del usuario es requerido', 'Aceptar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
      return;
    }

    this.userService.createUser(this.user).subscribe(
      (data) => {
        console.log(data);
        Swal.fire(
          'Usuario guardado',
          'Usuario registrado con exito!!',
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
}
