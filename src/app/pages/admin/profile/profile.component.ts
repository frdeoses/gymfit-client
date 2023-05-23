import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/user/usuario.interface';
import { LoginService } from 'src/app/services/login/login.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
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

  constructor(
    private loginService: LoginService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.loginService.getUser();
  }

  /**
   * Entrar en modo edición
   */
  modeEdit() {
    this.userService.modeEdit('yes');
    this.userService.activateNavigateProfile();
  }
}
