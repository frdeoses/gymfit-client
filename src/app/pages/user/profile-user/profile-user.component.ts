import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user/usuario.interface';
import { Weight } from 'src/app/interfaces/user/weight.interface';
import { UserService } from '@services/user.service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { ViewModeService } from '@services/view-mode.service';
import { ResponseHTTP } from 'src/app/interfaces/response-http.interface';
import { LoginService } from '@services/login/login.service';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css'],
})
export class ProfileUserComponent implements OnInit, OnDestroy {
  user: User = {
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

  listUserWeight: Weight[] | undefined;

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private router: Router,
    private viewModeService: ViewModeService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user = this.loginService.getUser();
    this.editMode = this.viewModeService.getModeEdit() === 'yes' ? true : false;

    if (!_.isUndefined(this.user.id)) {
      this.userService.getUser(this.user.id).subscribe(
        (response: ResponseHTTP<User>) => {
          this.user = response.body;
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
    this.viewModeService.removeItem();
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
      (data: any) => {
        console.log(data);
        Swal.fire(
          'Usuario guardado:',
          'Usuario actualizado con éxito!!',
          'success'
        );
        this.editMode = false;
        this.listUserWeight = _.isUndefined(data.body.listUserWeight)
          ? []
          : data.body.listUserWeight;
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
}
