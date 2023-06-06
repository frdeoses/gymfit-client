import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginData = {
    username: '',
    password: '',
  };

  constructor(
    private snack: MatSnackBar,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  formSubmit() {
    if (
      _.isNull(this.loginData.username) ||
      _.isEmpty(this.loginData.username)
    ) {
      this.snack.open('Introduce el usuario !!', 'Aceptar', {
        duration: 3000,
      });
      return;
    }
    if (
      _.isNull(this.loginData.password) ||
      _.isEmpty(this.loginData.password)
    ) {
      this.snack.open('Introduce la contraseña !!', 'Aceptar', {
        duration: 3000,
      });
      return;
    }

    this.loginService.generateToken(this.loginData).subscribe(
      (data: any) => {
        console.log(data);

        this.loginService.loginUser(data.token);

        this.loginService.getCurrentUser().subscribe((user: any) => {
          this.loginService.setUser(user);
          console.log(user);

          if (this.loginService.getCurrentUserRole() == 'ADMIN') {
            // mostrar dashboard admin
            // window.location.href = '/admin';
            this.router.navigate(['admin']);
            this.loginService.loginStatusSubject.next(true);
          } else if (this.loginService.getCurrentUserRole() == 'USER') {
            // window.location.href = '/user-dashboard';
            this.router.navigate(['user-dashboard']);
            this.loginService.loginStatusSubject.next(true);
          } else {
            this.loginService.logout();
          }
        });
      },
      (error) => {
        console.error(error);
        this.snack.open(
          'Detalles invalidos, vuelva a intentarlo!!',
          'Aceptar',
          {
            duration: 3000,
          }
        );
      }
    );
  }
}
