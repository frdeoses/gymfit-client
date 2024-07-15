import { Component, OnInit } from '@angular/core';
import { TrainingTypes } from '@interfaces/trainingTypes.enum';
import { LoginService } from '@services/login/login.service';
import { NotificationService } from '@services/notification.service';
import { TrainingService } from '@services/training.service';
import { Subscription } from 'rxjs';

export interface MenuItems {
  title: string;
  path: string;
  description?: string;
  subPath?: string;
  icon: string;
  subMenu?: boolean;
  subMenuItem?: SubMenuItems[];
}

export interface SubMenuItems {
  subTitle: string;
  icon: string;
}
@Component({
  selector: 'app-sidebar-user',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  listOfSubMenus: SubMenuItems[] = [
    {
      icon: 'abdominales',
      subTitle: TrainingTypes.ABS.toString(),
    },
    {
      icon: 'brazo',
      subTitle: TrainingTypes.BRAZO.toString(),
    },
    {
      icon: 'espalda',
      subTitle: TrainingTypes.ESPALDA.toString(),
    },
    {
      icon: 'hombro',
      subTitle: TrainingTypes.HOMBRO.toString(),
    },
    {
      icon: 'pecho',
      subTitle: TrainingTypes.PECHO.toString(),
    },
    {
      icon: 'pierna',
      subTitle: TrainingTypes.PIERNAS.toString(),
    },
  ];

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
      description: 'Ejercicios',
      path: '/user-dashboard/trainings',
      subPath: '/user-dashboard/trainings/',
      icon: 'directions_run',
      subMenu: true,
      subMenuItem: this.listOfSubMenus,
    },
    {
      title: 'Tipos de entrenamientos',
      description: 'Entrenamientos',
      path: '/user-dashboard/tables',
      subPath: '/user-dashboard/tables/',
      icon: 'list',
      subMenu: true,
      subMenuItem: this.listOfSubMenus,
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
  // trainingTypes: string[] = [];

  constructor(
    private trainingService: TrainingService,
    private loginService: LoginService,
    public notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  public logout() {
    this.loginService.logout();
    window.location.reload();
  }

  getIconPath(iconName: string): string {
    return `../../../../assets/icon/${iconName}.png`; // Ajusta la ruta según tu estructura
  }
}
