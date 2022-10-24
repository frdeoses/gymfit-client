import { tokenName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser } from 'src/app/model/user/usuario.interface';
import { LoginService } from 'src/app/services/login/login.service';

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

  constructor(private snack: MatSnackBar, private loginService: LoginService) {}

  ngOnInit(): void {}

  formSubmit() {
    debugger;
    // console.log('Click botton de login');

    if (
      this.loginData.username == null ||
      this.loginData.username.trim() == ''
    ) {
      this.snack.open('Introduce el usuario !!', 'Aceptar', {
        duration: 3000,
      });
      return;
    }
    if (
      this.loginData.password == null ||
      this.loginData.password.trim() == ''
    ) {
      this.snack.open('Introduce la contraseña !!', 'Aceptar', {
        duration: 3000,
      });
      return;
    }

    this.loginService.generateToken(this.loginData).subscribe(
      (data: any) => {
        console.log(data);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
