import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ILoginData } from 'src/app/interfaces/login.interface';
import { IUser } from 'src/app/interfaces/user/usuario.interface';
import baseUrlUser from '../helper';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public loginStatusSubject = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  // Generar el token

  public generateToken(loginData: ILoginData) {
    return this.http.post(`${baseUrlUser[0]}/generate-token`, loginData);
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    return true;
  }

  // Obtenemos token
  public getToken() {
    return localStorage.getItem('token');
  }

  public setUser(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUser() {
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

  public getUserRoles() {
    let user = this.getUser();

    return user.authorities[0].authority;
  }

  public getCurrentUser() {
    return this.http.get(`${baseUrlUser[0]}/current-user`);
  }
}
