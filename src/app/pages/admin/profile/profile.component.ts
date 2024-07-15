import { Component, OnInit } from '@angular/core';

import { User, UserRsDto } from '@interfaces/index';

import { LoginService } from '@services/login/login.service';
import { UserService } from '@services/user.service';
import { ViewModeService } from '@services/view-mode.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user?: UserRsDto;

  userRole: string = '';

  constructor(
    private loginService: LoginService,
    private viewModeService: ViewModeService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.loginService.getUser();
    const [firstRole] = this.user.userRoles;
    this.userRole = firstRole.nameRole || '';
  }

  /**
   * Entrar en modo edición
   */
  modeEdit() {
    this.viewModeService.modeEdit('yes');
    this.userService.activateNavigateProfile();
  }
}
