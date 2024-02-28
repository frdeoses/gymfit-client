import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResponseHTTP } from 'src/app/interfaces/response-http.interface';
import { User } from 'src/app/interfaces/user/usuario.interface';
import { LoginService } from 'src/app/services/login/login.service';
import { UserService } from 'src/app/services/user/user.service';
import { ViewModeService } from 'src/app/services/view-mode/view-mode.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css'],
})
export class ViewUsersComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  userLogin: string = '';
  constructor(
    private userService: UserService,
    private viewModeService: ViewModeService,
    private loginService: LoginService
  ) {}

  users: User[] = [];

  ngOnInit(): void {
    this.userLogin = this.loginService.getUser().username;
    this.userService.listUser().subscribe(
      (data: ResponseHTTP<User[]>) => {
        this.users = data.body;
        console.log(this.users);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error:', 'Error al cargar los usuarios', 'error');
      }
    );

    // this.subscription = this.userService.refresh$.subscribe(() => {
    //   this.userService.listUser().subscribe(
    //     (data: User[]) => {
    //       this.users = data;
    //       console.log(this.users);
    //     },
    //     (error) => {
    //       console.error(error);
    //       Swal.fire('Error:', 'Error al cargar los usuarios...', 'error');
    //     }
    //   );
    // });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  deleteUser(userId: string) {
    Swal.fire({
      title: 'Eliminar usuario',
      text: '¿Estas seguro de que quieres eliminar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(userId).subscribe(
          (eventIdDeleted: ResponseHTTP<string>) => {
            Swal.fire(
              'Usuario eliminado',
              'El usuario ha sido eliminado correctamente...',
              'success'
            );
          },
          (error) => {
            console.error(error);
            Swal.fire('Error:', 'Error al eliminar el usuario...', 'error');
          }
        );
      }
    });
  }

  /**
   * Entrar en modo edicion
   */
  modeEdit() {
    this.viewModeService.modeEdit('yes');
    this.userService.disableNavigateProfile();
  }

  /**
   * Entrar en modo consulta
   */
  modeConsult() {
    this.viewModeService.modeEdit('no');
  }
}
