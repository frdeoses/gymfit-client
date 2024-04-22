import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '@interfaces/index';

import { LoginService } from '@services/login/login.service';
import { NotificationService } from '@services/notification.service';
import { SidebarService } from '@services/sidebar.service';

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

  isSmallScreen = window.innerWidth < 768; // Considera pantallas menores de 768px como pequeñas

  constructor(
    private loginService: LoginService,
    private sidebarService: SidebarService,
    private notificationService: NotificationService
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

  get isLogin(): boolean {
    return this.loginService.isLoggedIn();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isSmallScreen = window.innerWidth < 768;
  }

  toggleSidebar(): void {
    // debugger;
    this.sidebarService.toggleSidebar();
  }
}
