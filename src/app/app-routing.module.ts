import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateEventComponent } from './pages/admin/create-event/create-event.component';
import { CreateMachineComponent } from './pages/admin/create-machine/create-machine.component';
import { CreateTableComponent } from './pages/admin/create-table/create-table.component';
import { CreateTrainingComponent } from './pages/admin/create-training/create-training.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { EditEventComponent } from './pages/admin/edit-event/edit-event.component';
import { EditGymMachinesComponent } from './pages/admin/edit-gym-machines/edit-gym-machines.component';
import { EditTrainingComponent } from './pages/admin/edit-training/edit-training.component';
import { ViewEventsComponent } from './pages/admin/view-events/view-events.component';
import { ViewMachinesComponent } from './pages/admin/view-machines/view-machines.component';
import { ViewTablesComponent } from './pages/admin/view-tables/view-tables.component';
import { ViewTrainingComponent } from './pages/admin/view-training/view-training.component';
import { WelcomeComponent } from './pages/admin/welcome/welcome.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserDashboardComponent } from './pages/user/user-dashboard.component';
import { AdminGuard } from './services/guards/admin/admin.guard';
import { UserGuard } from './services/guards/user/user.guard';
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
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: '',
        component: WelcomeComponent,
      },
      {
        path: 'tables',
        component: ViewTablesComponent,
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
    pathMatch: 'full',
    canActivate: [UserGuard],
  },
  {
    path: '**',
    component: HomeComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
