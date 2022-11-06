import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ILoginData } from 'src/app/model/login.interface';
import { IUser } from 'src/app/model/user/usuario.interface';
import baseUrlUser from '../helper';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public loginStatusSubject = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  // Generar el token

  public generateToken(loginData: ILoginData) {
    return this.http.post(`${baseUrlUser}/generate-token`, loginData);
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
    } else {
      this.logout();
      return null;
    }
  }

  public getUserRoles() {
    let user = this.getUser();

    return user.authorities[0].authority;
  }

  public getCurrentUser() {
    return this.http.get(`${baseUrlUser}/current-user`);
  }
}
