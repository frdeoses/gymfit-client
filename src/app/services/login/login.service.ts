import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import baseUrl from '../helper';

import { UserRsDto, LoginData } from '@interfaces/index';

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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('modeView');
    // localStorage.clear();

    return true;
  }

  // Obtenemos token
  public getToken() {
    return localStorage.getItem('token');
  }

  public setUser(user: UserRsDto) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUser(): UserRsDto {
    let userStr = localStorage.getItem('user');

    if (userStr != null) {
      return JSON.parse(userStr);
    }
    this.logout();

    return {
      id: '',
      username: '',
      birthDate: new Date(),
      caloriesBurned: 0,
      email: '',
      height: 0,
      listUserWeight: [],
      listFatPercentage: [],
      heartRate: 0,
      name: '',
      phone: '',
      surname: '',
      userRoles: [],
      weight: 0,
    } as UserRsDto;
  }

  public getCurrentUserRole(): string {
    const user: UserRsDto = this.getUser();

    if (user.userRoles.length > 0) {
      const [firstRol] = user.userRoles;
      return firstRol.nameRole || '';
    }

    return '';
  }

  public getCurrentUser(): Observable<UserRsDto> {
    return this.http.get<UserRsDto>(`${baseUrl[0]}/current-user`);
  }
}
