import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {


  newNotificationsCount: number = 0;
  subscription: Subscription;
  constructor(public loginService: LoginService, 
    public notificationService: NotificationService) {

    this.subscription = new Subscription();
  }

  ngOnInit(): void {

    this.subscription = this.notificationService.newNotifications$.subscribe(
      (notifications) => {
        this.newNotificationsCount = notifications.length;
        console.log('Notificaciones nuevas recibidas:', notifications);
      }
    );
  }

  public logout() {
    this.loginService.logout();
    window.location.reload();
  }

  updateNotificationCount() {
    this.notificationService.newNotifications$.subscribe((notifications) => {
      this.newNotificationsCount = notifications.length;
    });
  }

  ngOnDestroy(): void {
    console.log(this.subscription);

    if (this.subscription) {
      console.log(this.subscription);
      this.subscription.unsubscribe();
    }
  }
}
