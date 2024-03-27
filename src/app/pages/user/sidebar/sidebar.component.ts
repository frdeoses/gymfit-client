import { Component, OnInit } from '@angular/core';
import { LoginService } from '@services/login/login.service';
import { NotificationService } from '@services/notification.service';
import { TrainingService } from '@services/training.service';
import { Subscription } from 'rxjs';
import { ResponseHTTP } from 'src/app/interfaces/response-http.interface';
import Swal from 'sweetalert2';

export interface MenuItems {
  title: string;
  path: string;
  subPath?: string;
  icon: string;
  subMenu?: boolean;
}

// export interface SubMenu {
//   subTitle: string;
//   path: string;
//   icon: string;
// }
@Component({
  selector: 'app-sidebar-user',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItems[] = [
    {
      title: 'Inicio',
      path: '/user-dashboard',
      icon: 'home',
    },
    {
      title: 'Perfil',
      path: '/user-dashboard/profile',
      icon: 'account_circle',
    },
    {
      title: 'Tipos de ejercicios',
      path: '/user-dashboard/trainings',
      subPath: '/user-dashboard/trainings/',
      icon: 'directions_run',
      subMenu: true,
    },
    {
      title: 'Tipos de entrenamientos',
      path: '/user-dashboard/tables',
      subPath: '/user-dashboard/tables/',
      icon: 'list',
      subMenu: true,
    },
    {
      title: 'Máquina',
      path: '/user-dashboard/gym-machines',
      icon: 'fitness_center',
    },

    {
      title: 'Eventos',
      path: '/user-dashboard/events',
      icon: 'event',
    },
  ];

  subscription: Subscription = new Subscription();

  numNewEventCreated: string = '';

  newNotificationsCount: number = 0;
  trainingTypes: string[] = [];

  constructor(
    private trainingService: TrainingService,
    private loginService: LoginService,
    public notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.trainingService.allTrainingType().subscribe(
      (response: ResponseHTTP<string[]>) => {
        this.trainingTypes = response.body;
      },
      (error) => {
        console.error(error);
        Swal.fire('Error:', 'Error al cargar los tipos de ejercicios');
      }
    );

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
}
