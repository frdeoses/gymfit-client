import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '@interfaces/index';

import { NotificationService } from '@services/notification.service';
import { LoginService } from '@services/login/login.service';

const routeAdmin = '/admin';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  newNotificationsCount: number = 0;
  subscription: Subscription;
  role: string = '';
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
    public loginService: LoginService,
    public notificationService: NotificationService
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.user = this.loginService.getUser();

    if (
      this.user.userRoles !== undefined &&
      this.user.userRoles.length > 0 &&
      this.user.userRoles[0].roleList !== undefined
    ) {
      this.role = this.user.userRoles[0].roleList;
    }

    this.loginService.loginStatusSubject.subscribe((data) => {
      this.isLoggedIn = this.loginService.isLoggedIn();
      this.user = this.loginService.getUser();
      if (
        this.user &&
        this.user.userRoles !== undefined &&
        this.user.userRoles[0].roleList !== undefined
      ) {
        this.role = this.user.userRoles[0].roleList;
      }
    });

    this.subscription = this.notificationService.newNotifications$.subscribe(
      (notifications) => {
        this.newNotificationsCount = notifications.length;
        console.log('Notificaciones nuevas recibidas:', notifications);
      }
    );
  }

  updateNotificationCount() {
    this.notificationService.newNotifications$.subscribe((notifications) => {
      this.newNotificationsCount = notifications.length;
    });
  }

  public logout() {
    this.loginService.logout();
    window.location.reload();
  }

  ngOnDestroy(): void {
    console.log(this.subscription);

    if (this.subscription) {
      console.log(this.subscription);
      this.subscription.unsubscribe();
    }
  }
}
