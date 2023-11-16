import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { INotification } from 'src/app/interfaces/notification.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<INotification[]>(
    this.getNotificationsFromLocalStorage()
  );

  newNotifications$ = new BehaviorSubject<INotification[]>([]);
  oldNotifications$ = new BehaviorSubject<INotification[]>([]);

  notifications$ = this.notificationsSubject.asObservable();

  constructor() {}

  addNotification(notification: INotification) {
    const currentNotifications = this.notificationsSubject.value;
    currentNotifications.push(notification);
    this.notificationsSubject.next(currentNotifications);
    this.saveNotificationsToLocalStorage(currentNotifications);
    this.separateNotifications(currentNotifications);
  }

  markNotificationAsRead(notification: INotification) {
    const notifications = this.notificationsSubject.value;
    const index = notifications.findIndex((n) => n.id === notification.id);

    if (index > -1) {
      notifications[index].read = true;
      this.notificationsSubject.next(notifications);
      this.saveNotificationsToLocalStorage(notifications);
      this.separateNotifications(notifications); // Separar las notificaciones nuevamente
    }
  }

  clearOldNotifications(daysToKeep: number = 30) {
    const currentDate = new Date();
    const notifications = this.notificationsSubject.value.filter(
      (notification) => {
        if (notification.read) {
          const notificationDate = new Date(notification.date);
          const differenceInDays =
            (currentDate.getTime() - notificationDate.getTime()) /
            (1000 * 3600 * 24);
          return differenceInDays <= daysToKeep;
        }
        return true;
      }
    );

    this.notificationsSubject.next(notifications);
    this.saveNotificationsToLocalStorage(notifications);
  }

  deleteNotification(notification: INotification): void {
    const currentNotifications = this.notificationsSubject.value;
    const index = currentNotifications.findIndex(
      (n) => n.title === notification.title && n.date === notification.date // asumiendo que título y fecha combinados son únicos
    );

    if (index !== -1) {
      currentNotifications.splice(index, 1);
      this.notificationsSubject.next(currentNotifications);
      this.saveNotificationsToLocalStorage(currentNotifications);
      this.separateNotifications(currentNotifications); // Agregado para actualizar las listas de notificaciones
    }
  }

  separateNotifications(notifications: INotification[]): void {
    const newNotifications: INotification[] = [];
    const oldNotifications: INotification[] = [];

    for (const notification of notifications) {
      if (notification.read) {
        oldNotifications.push(notification);
      } else {
        newNotifications.push(notification);
      }
    }

    this.newNotifications$.next(newNotifications);
    this.oldNotifications$.next(oldNotifications);
  }

  public getNotificationsFromLocalStorage(): INotification[] {
    const notifications = localStorage.getItem('notifications');
    return notifications ? JSON.parse(notifications) : [];
  }

  private saveNotificationsToLocalStorage(
    notifications: INotification[]
  ): void {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }
}
