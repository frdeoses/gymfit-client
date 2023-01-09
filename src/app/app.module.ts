import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, NativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CreateEventComponent } from './pages/admin/create-event/create-event.component';
import { CreateMachineComponent } from './pages/admin/create-machine/create-machine.component';
import { CreateTableComponent } from './pages/admin/create-table/create-table.component';
import { CreateTrainingComponent } from './pages/admin/create-training/create-training.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { EditConsultUserComponent } from './pages/admin/edit-consult-user/edit-consult-user.component';
import { EditEventComponent } from './pages/admin/edit-event/edit-event.component';
import { EditGymMachinesComponent } from './pages/admin/edit-gym-machines/edit-gym-machines.component';
import { EditTrainingComponent } from './pages/admin/edit-training/edit-training.component';
import { SidebarComponent } from './pages/admin/sidebar/sidebar.component';
import { ViewEventsComponent } from './pages/admin/view-events/view-events.component';
import { ViewMachinesComponent } from './pages/admin/view-machines/view-machines.component';
import { ViewTablesComponent } from './pages/admin/view-tables/view-tables.component';
import { ViewTrainingComponent } from './pages/admin/view-training/view-training.component';
import { ViewUsersComponent } from './pages/admin/view-users/view-users.component';
import { WelcomeComponent } from './pages/admin/welcome/welcome.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserDashboardComponent } from './pages/user/user-dashboard.component';
import { authInterceptorProviders } from './services/auth.interceptor';
import { spinnerInterceptorProviders } from './shared/interceptor/spinner.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    UserDashboardComponent,
    ProfileComponent,
    SidebarComponent,
    WelcomeComponent,
    ViewTablesComponent,
    CreateTableComponent,
    ViewEventsComponent,
    CreateEventComponent,
    EditEventComponent,
    ViewMachinesComponent,
    CreateMachineComponent,
    CreateTrainingComponent,
    ViewTrainingComponent,
    EditTrainingComponent,
    EditGymMachinesComponent,
    ViewUsersComponent,
    EditConsultUserComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NativeDateModule,
    MatSnackBarModule,
    MatCardModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatBadgeModule,
    MatChipsModule,
    MatTooltipModule,
    NgxChartsModule,
  ],
  providers: [authInterceptorProviders, spinnerInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
