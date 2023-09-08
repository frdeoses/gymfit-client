import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/user/usuario.interface';
import { IWeight } from 'src/app/interfaces/user/weight.interface';
import { LoginService } from 'src/app/services/login/login.service';
import { UserService } from 'src/app/services/user/user.service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css'],
})
export class ProfileUserComponent implements OnInit, OnDestroy {
  user: IUser = {
    id: undefined,
    name: '',
    username: '',
    password: '',
    userRoles: [],
    surname: '',
    email: '',
    birthDate: new Date(),
    height: undefined,
    phone: '',
    authorities: [
      {
        authority: ' ',
      },
    ],
  };

  editMode: boolean | undefined;

  listUserWeight: IWeight[] | undefined;

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user = this.loginService.getUser();
    this.editMode = this.userService.getModeEdit() === 'yes' ? true : false;
    if (!_.isUndefined(this.user.id)) {
      this.userService.getUser(this.user.id).subscribe(
        (data: IUser) => {
          this.user = data;
          this.listUserWeight = this.user.listUserWeight;
          console.log(this.user);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.userService.removeItem();
  }

  formSubmit() {
    if (_.isNull(this.user) || _.isEmpty(this.user.name)) {
      this.snack.open('El nombre del usuario es requerido', 'Aceptar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
      return;
    }

    this.userService.editUser(this.user).subscribe(
      (data) => {
        console.log(data);
        Swal.fire(
          'Usuario guardado:',
          'Usuario actualizado con exito!!',
          'success'
        );
        this.editMode = false;
        this.userService.modeEdit('no');
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
    this.userService.modeEdit('yes');
    this.editMode = true;
  }
  modeConsult() {
    this.userService.modeEdit('no');
    this.editMode = false;
  }
}
