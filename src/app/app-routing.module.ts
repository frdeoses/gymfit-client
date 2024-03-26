import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes
import { ErrorNotFoundComponent } from './pages/404/error-not-found/error-not-found.component';
import { CreateEventComponent } from './pages/admin/create-event/create-event.component';
import { CreateMachineComponent } from './pages/admin/create-machine/create-machine.component';
import { CreateTableComponent } from './pages/admin/create-table/create-table.component';
import { CreateTrainingComponent } from './pages/admin/create-training/create-training.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { EditConsultTableComponent } from './pages/admin/edit-consult-table/edit-consult-table.component';
import { EditConsultUserComponent } from './pages/admin/edit-consult-user/edit-consult-user.component';
import { EditEventComponent } from './pages/admin/edit-event/edit-event.component';
import { EditGymMachinesComponent } from './pages/admin/edit-gym-machines/edit-gym-machines.component';
import { EditTrainingComponent } from './pages/admin/edit-training/edit-training.component';
import { ViewEventsComponent } from './pages/admin/view-events/view-events.component';
import { ViewMachinesComponent } from './pages/admin/view-machines/view-machines.component';
import { ViewTablesComponent } from './pages/admin/view-tables/view-tables.component';
import { ViewTrainingComponent } from './pages/admin/view-training/view-training.component';
import { ViewUsersComponent } from './pages/admin/view-users/view-users.component';
import { WelcomeComponent } from './pages/admin/welcome/welcome.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { InstructionsComponent } from './pages/user/instructions/instructions.component';
import { LoadEventsComponent } from './pages/user/load-events/load-events.component';
import { LoadMachineComponent } from './pages/user/load-machine/load-machine.component';
import { LoadTableComponent } from './pages/user/load-table/load-table.component';
import { LoadTrainingComponent } from './pages/user/load-training/load-training.component';
import { ProfileUserComponent } from './pages/user/profile-user/profile-user.component';
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';
import { WelcomeUserComponent } from './pages/user/welcome-user/welcome-user.component';
import { ProfileComponent } from './pages/admin/profile/profile.component';
import { NotificationComponent } from './components/notification/notification.component';

// Guards
import { AdminGuard } from './services/guards/admin.guard';
import { UserGuard } from './services/guards/user.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: RegisterComponent,
    pathMatch: 'full',
  },
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: WelcomeComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'notification',
        component: NotificationComponent,
      },
      {
        path: 'tables',
        component: ViewTablesComponent,
      },
      {
        path: 'tables/:tableId',
        component: EditConsultTableComponent,
      },
      {
        path: 'users',
        component: ViewUsersComponent,
      },
      {
        path: 'users/:userId',
        component: EditConsultUserComponent,
      },
      {
        path: 'create-table',
        component: CreateTableComponent,
      },
      {
        path: 'events',
        component: ViewEventsComponent,
      },
      {
        path: 'create-event',
        component: CreateEventComponent,
      },
      {
        path: 'events/:eventId',
        component: EditEventComponent,
      },
      {
        path: 'gym-machines',
        component: ViewMachinesComponent,
      },
      {
        path: 'gym-machines/:gymMachineId',
        component: EditGymMachinesComponent,
      },
      {
        path: 'create-gym-machines',
        component: CreateMachineComponent,
      },
      {
        path: 'trainings',
        component: ViewTrainingComponent,
      },
      {
        path: 'create-training',
        component: CreateTrainingComponent,
      },
      {
        path: 'trainings/:trainingId',
        component: EditTrainingComponent,
      },
    ],
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [UserGuard],
    children: [
      {
        path: '',
        component: WelcomeUserComponent,
      },
      {
        path: 'profile',
        component: ProfileUserComponent,
      },
      {
        path: 'notification',
        component: NotificationComponent,
      },
      {
        path: 'instructions',
        component: InstructionsComponent,
      },
      {
        path: 'gym-machines',
        component: LoadMachineComponent,
      },
      {
        path: 'gym-machines/:gymMachineId',
        component: EditGymMachinesComponent,
      },
      {
        path: 'trainings',
        component: LoadTrainingComponent,
      },
      {
        path: 'trainings/:typeTrainings',
        component: LoadTrainingComponent,
      },
      {
        path: 'trainings/:typeTrainings/:trainingId',
        component: EditTrainingComponent,
      },
      {
        path: 'events',
        component: LoadEventsComponent,
      },
      {
        path: 'events/:eventId',
        component: EditEventComponent,
      },
      {
        path: 'tables',
        component: LoadTableComponent,
      },
      {
        path: 'tables/:typeTrainingTable',
        component: LoadTableComponent,
      },
      {
        path: 'tables/:typeTrainingTable/:tableId',
        component: EditConsultTableComponent,
      },
    ],
  },
  {
    path: '**',
    component: ErrorNotFoundComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
