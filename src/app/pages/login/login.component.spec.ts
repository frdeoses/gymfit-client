import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from '@services/login/login.service';
import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from '../admin/dashboard/dashboard.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: LoginService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        MatSnackBarModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule, // Necesario para MatSnackBar
        RouterTestingModule.withRoutes([
          { path: 'admin', component: DashboardComponent }, // Configura la ruta 'admin'
          // Puedes agregar otras rutas necesarias aquí
        ]),
      ],
      providers: [LoginService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginService = TestBed.inject(LoginService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Más pruebas irán aquí

  it('should call generateToken on formSubmit with valid data', () => {
    spyOn(loginService, 'generateToken').and.returnValue(
      of({ token: 'fakeToken' })
    );
    spyOn(loginService, 'loginUser');
    spyOn(loginService, 'getCurrentUser').and.returnValue(
      of({ role: 'ADMIN' })
    );
    // Simular getCurrentUserRole para que devuelva un rol válido
    spyOn(loginService, 'getCurrentUserRole').and.returnValue('ADMIN');

    component.loginData.username = 'testUser';
    component.loginData.password = 'testPass';

    component.formSubmit();

    expect(loginService.generateToken).toHaveBeenCalledWith(
      component.loginData
    );
    expect(loginService.loginUser).toHaveBeenCalledWith('fakeToken');
    // Verificar si se navega al dashboard del admin o cualquier otro comportamiento esperado
  });

  it('should show snack bar on generateToken error', () => {
    spyOn(loginService, 'generateToken').and.returnValue(
      throwError(() => new Error('Error'))
    );
    const snackSpy = spyOn(TestBed.inject(MatSnackBar), 'open');

    component.loginData.username = 'testUser';
    component.loginData.password = 'testPass';
    component.formSubmit();

    expect(snackSpy).toHaveBeenCalledWith(
      'Detalles inválidos, vuelva a intentarlo!!',
      'Aceptar',
      { duration: 3000 }
    );
  });
});
