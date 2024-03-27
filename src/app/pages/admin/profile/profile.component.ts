import { Component, OnInit } from '@angular/core';
import { User } from '@interfaces/index';
import { LoginService } from '@services/login/login.service';
import { UserService } from '@services/user.service';
import { ViewModeService } from '@services/view-mode.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
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

  constructor(
    private loginService: LoginService,
    private viewModeService: ViewModeService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.loginService.getUser();
  }

  /**
   * Entrar en modo edición
   */
  modeEdit() {
    this.viewModeService.modeEdit('yes');
    this.userService.activateNavigateProfile();
  }
}
