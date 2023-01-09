import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { IUser } from 'src/app/interfaces/user/usuario.interface';
import { IWeight } from 'src/app/interfaces/user/weight.interface';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-consult-user',
  templateUrl: './edit-consult-user.component.html',
  styleUrls: ['./edit-consult-user.component.css'],
})
export class EditConsultUserComponent implements OnInit {
  userId: string = '';

  listUserWeight: IWeight[] | undefined;

  editMode: boolean = false;
  user: IUser = {
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

  constructor(
    private userService: UserService,
    private snack: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['userId'];

    this.userService.getUser(this.userId).subscribe(
      (data: IUser) => {
        this.user = data;
        this.listUserWeight = this.user.listUserWeight;
        console.log(this.user);
      },
      (error) => {
        console.error(error);
      }
    );
    this.editMode = this.userService.viewEdit;
  }

  formSubmit() {
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
        debugger;
        console.log(data);
        Swal.fire(
          'Usuario guardado:',
          'Usuario actualizado con exito!!',
          'success'
        );
        this.router.navigate(['/admin/users']);
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

  onSelect(event: any) {
    console.log(event);
  }
}
