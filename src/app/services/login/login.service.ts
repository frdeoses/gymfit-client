import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from 'src/app/interfaces/user/usuario.interface';
import baseUrl from '../helper';
import { LoginData } from '@interfaces/login.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public loginStatusSubject = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  // Generar el token

  public generateToken(loginData: LoginData) {
    return this.http.post(`${baseUrl[0]}/generate-token`, loginData);
  }

  // iniciamos sesión y establecemos el token en el localStorage

  public loginUser(token: string) {
    localStorage.setItem('token', token);
  }

  public isLoggedIn() {
    let tokenStr = localStorage.getItem('token');

    if (tokenStr == undefined || tokenStr == null || tokenStr == '') {
      return false;
    } else {
      return true;
    }
  }

  // Cerramos sesión y eliminamos el token

  public logout() {
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    // localStorage.removeItem('modeView');
    localStorage.clear();

    return true;
  }

  // Obtenemos token
  public getToken() {
    return localStorage.getItem('token');
  }

  public setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUser(): User {
    let userStr = localStorage.getItem('user');

    if (userStr != null) {
      return JSON.parse(userStr);
    }
    this.logout();

    let userEmpty = {
      id: undefined,
      name: '',
      username: '',
      password: '',
      userRols: [],
      surname: '',
      email: '',
      birthDate: new Date(),
      height: undefined,
      phone: '',
      authorities: [
        {
          authority: ' ',
        },
      ],
    };
    return userEmpty;
  }

  public getCurrentUserRole() {
    let user = this.getUser();

    return user.authorities[0].authority;
  }

  public getCurrentUser() {
    return this.http.get(`${baseUrl[0]}/current-user`);
  }
}
