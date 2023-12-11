import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { INotification } from 'src/app/interfaces/notification.interface';
import { LoginService } from 'src/app/services/login/login.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  newNotificationsCount: number = 0;

  newNotifications$ = this.notificationService.newNotifications$;
  oldNotifications$ = this.notificationService.oldNotifications$;

  constructor(
    private notificationService: NotificationService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const notifications =
      this.notificationService.getNotificationsFromLocalStorage();
    this.notificationService.separateNotifications(notifications);
    this.notificationService.clearOldNotifications();
    this.notificationService.newNotifications$.subscribe((notifications) => {
      this.newNotificationsCount = notifications.length;
    });
  }

  /**
   *
   * @param n
   */
  markRead(n: INotification) {
    this.notificationService.markNotificationAsRead(n);
  }

  deleteNotification(notification: INotification) {
    this.notificationService.deleteNotification(notification);
  }

  goToPage(notification: INotification): void {
    const role = this.loginService.getCurrentUserRole();
    this.notificationService.markNotificationAsRead(notification);
    notification.page =
      role === 'ADMIN'
        ? '/admin' + notification.page
        : '/user-dashboard' + notification.page;
    debugger;
    this.router.navigate([notification.page]); // Usa el método navigate para redirigir a la página
  }

  shouldShowButton(page: string): boolean {
    debugger;
    return page.trim() !== '';
  }
}
