import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/user/usuario.interface';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  role: string = '';
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
    authorities: [
      {
        authority: ' ',
      },
    ],
  };

  constructor(public loginService: LoginService) {}

  ngOnInit(): void {
    this.user = this.loginService.getUser();
    if (
      this.user.userRols !== undefined &&
      this.user.userRols.length > 0 &&
      this.user.userRols[0].roleList !== undefined
    ) {
      this.role = this.user.userRols[0].roleList;
    }
    this.loginService.loginStatusSubject.subscribe((data) => {
      this.isLoggedIn = this.loginService.isLoggedIn();
      this.user = this.loginService.getUser();
      if (
        this.user &&
        this.user.userRols !== undefined &&
        this.user.userRols[0].roleList !== undefined
      ) {
        this.role = this.user.userRols[0].roleList;
      }
    });
  }

  public logout() {
    this.loginService.logout();
    window.location.reload();
  }
}
