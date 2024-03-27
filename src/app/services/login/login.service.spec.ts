import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';
import { LoginData } from '@interfaces/login.interface';

const baseUrl = [
  'http://localhost:8001',
  'http://localhost:8002',
  'http://localhost:8003',
];

describe('LoginService', () => {
  let loginService: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService],
    });

    loginService = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(loginService).toBeTruthy();
  });

  it('should generate token', () => {
    const loginData: LoginData = { username: 'test', password: 'password' };
    const mockToken = 'testToken';

    loginService.generateToken(loginData).subscribe((token) => {
      expect(token).toEqual(mockToken);
    });

    const req = httpMock.expectOne(`${baseUrl[0]}/generate-token`);
    expect(req.request.method).toBe('POST');
    req.flush(mockToken);
  });

  it('should login and set token in localStorage', () => {
    const token = 'testToken';
    loginService.loginUser(token);
    expect(localStorage.getItem('token')).toBe(token);
  });

  it('should logout and clear localStorage', () => {
    loginService.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should check if user is logged in', () => {
    const token = 'testToken';
    localStorage.setItem('token', token);
    expect(loginService.isLoggedIn()).toBeTruthy();

    localStorage.removeItem('token');
    expect(loginService.isLoggedIn()).toBeFalsy();
  });

  // Agrega más pruebas según sea necesario para cubrir las funcionalidades clave de tu servicio
});
