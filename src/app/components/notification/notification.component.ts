import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { INotification } from 'src/app/interfaces/notification.interface';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  mockNotifications = [
    {
      title: 'Nueva Maquina',
      description: 'Se ha creado una nueva maquina!! ',
      date: new Date(),
      read: false,
    },
    {
      title: 'Nuevo Ejercicio',
      description: 'Se ha creado un nuevo ejercicio!! ',
      date: new Date(),
      read: true,
    },
    {
      title: 'Nueva Tabla de entrenamiento',
      description: 'Se ha creado una nueva tabla de entrenamiento!! ',
      date: new Date(),
      read: false,
    },
  ];

  newNotifications$ = this.notificationService.newNotifications$;
  oldNotifications$ = this.notificationService.oldNotifications$;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    const notifications =
      this.notificationService.getNotificationsFromLocalStorage();
    this.notificationService.separateNotifications(notifications);
    this.notificationService.clearOldNotifications();
  }

  markRead(n: INotification) {
    this.notificationService.markNotificationAsRead(n);
  }

  deleteNotification(notification: INotification) {
    this.notificationService.deleteNotification(notification);
  }
}
