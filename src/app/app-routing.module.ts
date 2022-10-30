import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/admin/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserDashboardComponent } from './pages/user/user-dashboard.component';
import { UserGuard } from './services/guards/user/user.guard';

const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
    pathMatch: 'full',
  },
  {
    path: 'home',
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
    pathMatch: 'full',
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    pathMatch: 'full',
    canActivate: [UserGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
