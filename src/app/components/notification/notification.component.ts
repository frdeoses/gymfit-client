import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notification } from '@interfaces/notification.interface';

import { LoginService } from '@services/login/login.service';
import { NotificationService } from '@services/notification.service';
import { ViewModeService } from '@services/view-mode.service';

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
  markRead(n: Notification): void {
    this.notificationService.markNotificationAsRead(n);
  }

  markAllAsRead(): void {
    this.notificationService.markAllNotificationAsRead();
  }

  deleteNotification(notification: Notification): void {
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

  goToPage(notification: Notification): void {
    const role = this.loginService.getCurrentUserRole();
    this.notificationService.markNotificationAsRead(notification);

    // Definir la base del path según el rol
    const basePath = role === 'ADMIN' ? '/admin' : '/user-dashboard';

    // Verificar si la URL contiene '/trainings/' o '/tables/'
    const trainingIndex = notification.page.indexOf('/trainings');
    const tableIndex = notification.page.indexOf('/tables');

    if (role === 'USER' && (trainingIndex !== -1 || tableIndex !== -1)) {
      // Determinar la posición para insertar '/ALL' basado en lo que se encontró en la URL
      const insertIndex =
        trainingIndex !== -1
          ? trainingIndex + '/trainings'.length
          : tableIndex + '/tables'.length;
      // Reconstruir la URL con '/ALL' insertado en la posición correcta
      notification.page =
        basePath +
        notification.page.slice(0, insertIndex) +
        '/ALL' +
        notification.page.slice(insertIndex);
    } else {
      // Para el rol 'ADMIN' o URLs que no contienen '/trainings/' o '/tables/'
      notification.page = basePath + notification.page;
    }

    this.modeView.modeEdit('no');

    this.router.navigate([notification.page]); // Usa el método navigate para redirigir a la página
  }
}
