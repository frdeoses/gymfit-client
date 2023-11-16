import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-welcome-user',
  templateUrl: './welcome-user.component.html',
  styleUrls: ['./welcome-user.component.css'],
})
export class WelcomeUserComponent implements OnInit {
  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    const notifications =
      this.notificationService.getNotificationsFromLocalStorage();
    this.notificationService.separateNotifications(notifications);
    this.notificationService.clearOldNotifications();
  }
}
