import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '@interfaces/index';
import { ResponseHTTP } from '@interfaces/response-http.interface';
import { UserService } from '@services/user.service';
import { ValidatorService } from '@services/validator.service';
import { of } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent }, // Asegúrate de tener LoginComponent importado
          // Agrega cualquier otra ruta necesaria para tus pruebas aquí
        ]),
      ],
      providers: [
        UserService,
        ValidatorService,
        { provide: Router, useClass: MockRouter }, // Donde MockRouter es una clase que mockea las funciones necesarias
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Más pruebas irán aquí

  it('should initialize form on component init', () => {
    expect(component.myForm).toBeDefined();
    expect(component.myForm.get('username')).toBeTruthy();
    expect(component.myForm.get('email')).toBeTruthy();
    // Verificar más campos si es necesario
  });

  it('should submit form and call createUser', () => {
    spyOn(userService, 'createUser').and.returnValue(
      of({
        code: 200,
        response: 'ok',
        body: {
          username: 'testUser',
          password: 'testPass',
          password2: 'testPass',
          name: 'Test',
          surname: 'User',
          email: 'test@example.com',
          phone: '1234567890',
          birthDate: new Date(),
          height: 180,
          authorities: [],
          weight: 75,
        } as User,
        error: null,
      } as ResponseHTTP<User>)
    );

    component.myForm.setValue({
      username: 'testUser',
      password: 'testPass',
      password2: 'testPass',
      name: 'Test',
      surname: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      birthDate: new Date(),
      height: 180,
      weight: 75,
      authorities: [],
      // Setear el resto de valores requeridos por el formulario
    } as User);

    component.onSubmit();

    expect(userService.createUser).toHaveBeenCalledWith(jasmine.any(Object));
  });
});
