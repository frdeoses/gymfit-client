import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { ResponseHTTP, User, Weight } from '@interfaces/index';

import { LoginService } from '@services/login/login.service';
import { UserService } from '@services/user.service';
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

  user: User = {
    id: '',
    authorities: [],
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    birthDate: new Date(),
    username: '',
    height: 0,
  };

  userLogin: string = '';

  constructor(
    private userService: UserService,
    private snack: MatSnackBar,
    private router: Router,
    private viewModeService: ViewModeService,
    private loginService: LoginService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userLogin = this.loginService.getUser().username;
    this.userId = this.route.snapshot.params['userId'];

    this.userService.getUser(this.userId).subscribe(
      (response: ResponseHTTP<User>) => {
        this.user = response.body;
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
    if (this.editMode) {
      if (this.user.username == '' || this.user.username == null) {
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
            'Usuario actualizado:',
            'Usuario actualizado con éxito!!',
            'success'
          );

          if (this.navigateProfile) {
            this.router.navigate(['/admin/profile']);
          } else {
            this.router.navigate(['/admin/users']);
          }
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
  }

  /**
   * Entrar en modo consulta
   */
  modeConsult() {
    this.editMode = false;
    this.viewModeService.modeEdit('no');
  }
}
