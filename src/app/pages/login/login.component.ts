import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserRsDto } from '@interfaces/index';
import { LoginService } from '@services/login/login.service';
import { ValidatorService } from '@services/validator.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  myForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private snack: MatSnackBar,
    private loginService: LoginService,
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  formSubmit() {
    this.myForm.markAllAsTouched();

    const loginData = this.myForm.value; // Obtén todos los valores del formulario

    if (!loginData) return;

    this.loginService.generateToken(loginData).subscribe(
      (data: any) => {
        console.log(data);

        this.loginService.loginUser(data.token);

        this.loginService.getCurrentUser().subscribe((user: UserRsDto) => {
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
          'Usuario y/o contraseña incorrecta, vuelva a intentarlo!!',
          'Aceptar',
          {
            duration: 3000,
          }
        );
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
