import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/interfaces/user/usuario.interface';
import { LoginService } from 'src/app/services/login/login.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

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
  // =
  //   this.notificationService.newNotifications$.subscribe((notifications) => {
  //     this.newNotificationsCount = notifications.length;
  //     // this.cdr.detectChanges(); // Forzar la detección de cambios
  //   });

  role: string = '';
  user: IUser = {
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

    debugger;

    if (this.subscription) {
      console.log(this.subscription);
      this.subscription.unsubscribe();
    }
  }
}
