import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '@services/notification.service';
import { LoginService } from '@services/login/login.service';

export interface MenuItems {
  title: string;
  path: string;
  icon: string;
  newNotificationsCount?: number;
  matBadgeHidden?: boolean;
  matBadgeColor?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  newNotificationsCount: number = 0;

  menuItems: MenuItems[] = [
    {
      title: 'Inicio',
      path: '/admin',
      icon: 'home',
    },
    {
      title: 'Perfil',
      path: '/admin/profile',
      icon: 'account_circle',
    },
    {
      title: 'Usuarios',
      path: '/admin/users',
      icon: 'people',
    },
    {
      title: 'Máquina',
      path: '/admin/gym-machines',
      icon: 'fitness_center',
    },
    {
      title: 'Crear Maquina',
      path: '/admin/create-gym-machines',
      icon: 'add_circle',
    },
    {
      title: 'Ejercicios',
      path: '/admin/trainings',
      icon: 'directions_run',
    },
    {
      title: 'Crear Ejercicio',
      path: '/admin/create-training',
      icon: 'add_circle_outline',
    },
    {
      title: 'Tabla de Entrenamiento',
      path: '/admin/tables',
      icon: 'list',
    },
    {
      title: 'Crear tabla de Entrenamientos',
      path: '/admin/create-table',
      icon: 'note_add',
    },
    {
      title: 'Eventos',
      path: '/admin/events',
      icon: 'event',
    },
    {
      title: 'Crear evento',
      path: '/admin/create-event',
      icon: 'add_box',
    },
  ];

  subscription: Subscription;
  constructor(
    public loginService: LoginService,
    public notificationService: NotificationService
  ) {
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
