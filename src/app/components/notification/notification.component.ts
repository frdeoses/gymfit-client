import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { INotification } from 'src/app/interfaces/notification.interface';
import { LoginService } from 'src/app/services/login/login.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ViewModeService } from 'src/app/services/view-mode/view-mode.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  newNotificationsCount: number = 0;
  notificationsCount: number = 0;

  newNotifications$ = this.notificationService.newNotifications$;
  oldNotifications$ = this.notificationService.oldNotifications$;

  constructor(
    private notificationService: NotificationService,
    private loginService: LoginService,
    private modeView: ViewModeService,
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

    this.notificationService.notifications$.subscribe(
      (notifications) => (this.notificationsCount = notifications.length)
    );
  }

  /**
   *
   * @param n
   */
  markRead(n: INotification): void {
    this.notificationService.markNotificationAsRead(n);
  }

  markAllAsRead(): void {
    this.notificationService.markAllNotificationAsRead();
  }

  deleteNotification(notification: INotification): void {
    Swal.fire({
      title: 'Eliminar notificación',
      text: '¿Estas seguro de que quieres eliminar la siguiente notificación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.notificationService.deleteNotification(notification);
      }
    });
  }

  isMarkAllAsRead(): boolean {
    return this.newNotificationsCount === 0;
  }

  deleteAllNotification(): void {
    Swal.fire({
      title: 'Eliminar notificaciones',
      text: '¿Estas seguro de que quieres eliminar todas las notificaciones?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.notificationService.deleteAllNotification();
      }
    });
  }

  goToPage(notification: INotification): void {
    const role = this.loginService.getCurrentUserRole();
    this.notificationService.markNotificationAsRead(notification);

    notification.page =
      role === 'ADMIN'
        ? '/admin' + notification.page
        : '/user-dashboard' + notification.page;
    this.modeView.modeEdit('no');
    this.router.navigate([notification.page]); // Usa el método navigate para redirigir a la página
  }
}
