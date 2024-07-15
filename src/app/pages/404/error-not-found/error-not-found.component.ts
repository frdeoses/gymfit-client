import { Component, OnInit } from '@angular/core';

import { User } from '@interfaces/index';

import { LoginService } from '@services/login/login.service';

@Component({
  selector: 'app-error-not-found',
  templateUrl: './error-not-found.component.html',
  styleUrls: ['./error-not-found.component.css'],
})
export class ErrorNotFoundComponent implements OnInit {
  isLoggedIn: boolean = false;
  // user?: User;
  userRole: string | undefined;

  constructor(public loginService: LoginService) {}

  ngOnInit(): void {
    this.userRole = this.loginService.getCurrentUserRole();
    this.loginService.loginStatusSubject.subscribe(() => {
      this.isLoggedIn = this.loginService.isLoggedIn();
      this.userRole = this.loginService.getCurrentUserRole();
    });
  }
}
