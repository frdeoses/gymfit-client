import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrlUser from '../helper';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  // Generar el token

  public generateToken(loginData: any) {
    return this.http.post(`${baseUrlUser}/generate-token`, loginData);
  }

  // iniciamos sesión y establecemos el token en el localStorage

  public loginUser(token: any) {
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

  public setUser(user: any) {
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
