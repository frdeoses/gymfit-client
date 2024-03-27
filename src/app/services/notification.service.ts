import { Injectable } from '@angular/core';
import { Notification } from '@interfaces/notification.interface';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>(
    this.getNotificationsFromLocalStorage()
  );

  newNotifications$ = new BehaviorSubject<Notification[]>([]);
  oldNotifications$ = new BehaviorSubject<Notification[]>([]);

  notifications$ = this.notificationsSubject.asObservable();

  constructor() {}

  addNotification(notification: Notification) {
    const currentNotifications = this.notificationsSubject.value;
    currentNotifications.push(notification);
    this.notificationsSubject.next(currentNotifications);
    this.saveNotificationsToLocalStorage(currentNotifications);
    this.separateNotifications(currentNotifications);
  }

  markNotificationAsRead(notification: Notification) {
    const notifications = this.notificationsSubject.value;
    const index = notifications.findIndex((n) => n.id === notification.id);

    if (index > -1) {
      notifications[index].read = true;
      this.notificationsSubject.next(notifications);
      this.saveNotificationsToLocalStorage(notifications);
      this.separateNotifications(notifications); // Separar las notificaciones nuevamente
    }
  }

  markAllNotificationAsRead() {
    const notifications = this.notificationsSubject.value;

    notifications.forEach((notification) => (notification.read = true));

    this.notificationsSubject.next(notifications);

    this.saveNotificationsToLocalStorage(notifications);

    this.separateNotifications(notifications); // Separar las notificaciones nuevamente
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

  deleteNotification(notification: Notification): void {
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

  deleteAllNotification(): void {
    let currentNotifications = this.notificationsSubject.value;

    currentNotifications = [];

    this.notificationsSubject.next(currentNotifications);
    this.saveNotificationsToLocalStorage(currentNotifications);
    this.separateNotifications(currentNotifications); // Agregado para actualizar las listas de notificaciones
  }

  separateNotifications(notifications: Notification[]): void {
    const newNotifications: Notification[] = [];
    const oldNotifications: Notification[] = [];

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

  public getNotificationsFromLocalStorage(): Notification[] {
    const notifications = localStorage.getItem('notifications');
    return notifications ? JSON.parse(notifications) : [];
  }

  private saveNotificationsToLocalStorage(notifications: Notification[]): void {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }
}
