import { Component, OnInit } from '@angular/core';
import { LoginService } from '@services/login/login.service';
import { User } from 'src/app/interfaces/user/usuario.interface';

@Component({
  selector: 'app-error-not-found',
  templateUrl: './error-not-found.component.html',
  styleUrls: ['./error-not-found.component.css'],
})
export class ErrorNotFoundComponent implements OnInit {
  isLoggedIn: boolean = false;
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
  constructor(public loginService: LoginService) {}

  ngOnInit(): void {
    this.user = this.loginService.getUser();
    this.loginService.loginStatusSubject.subscribe(() => {
      this.isLoggedIn = this.loginService.isLoggedIn();
      this.user = this.loginService.getUser();
    });
  }
}
