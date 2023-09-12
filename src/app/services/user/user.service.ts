import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IUser } from 'src/app/interfaces/user/usuario.interface';
import baseUrl from '../helper';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public refresh$ = new Subject<void>();
  viewEdit: boolean = false;
  navigateProfile: boolean = false;
  constructor(private httpClient: HttpClient) {}

  public createUser(user: IUser) {
    return this.httpClient.post(`${baseUrl[0]}/api/gymfit/user`, user);
  }

  /**
   * Lista los usuarios
   * @returns
   */
  public listUser(): Observable<IUser[]> {
    return this.httpClient.get<IUser[]>(`${baseUrl[0]}/api/gymfit/users`);
  }

  /**
   *
   * Borra un usuario
   *
   * @param userId
   * @returns
   */
  public deleteUser(userId: string): Observable<string> {
    return this.httpClient
      .delete<string>(`${baseUrl[0]}/api/gymfit/users/${userId}`)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  /**
   * Obtiene un usuario por su id
   *
   * @param userId
   * @returns
   */
  public getUser(userId: string): Observable<IUser> {
    return this.httpClient.get<IUser>(
      `${baseUrl[0]}/api/gymfit/users/${userId}`
    );
  }

  /**
   * Edita un usuario
   *
   * @param user
   * @returns
   */
  public editUser(user: IUser): Observable<IUser> {
    user.authorities = [];
    return this.httpClient
      .put<IUser>(`${baseUrl[0]}/api/gymfit/user`, user)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  /**
   * Cambiamos el valor de la var de la sesión
   *  que nos permiten entrar en modo edición o
   * en modo consulta
   * @param value
   */
  modeEdit(value: string) {
    localStorage.setItem('modeView', value);
  }

  activateNavigateProfile() {
    this.navigateProfile = true;
  }

  disableNavigateProfile() {
    this.navigateProfile = false;
  }

  // Obtenemos en que modo estamos
  public getModeEdit() {
    return localStorage.getItem('modeView');
  }

  //  eliminamos el token
  public removeItem() {
    localStorage.removeItem('modeView');
  }
}
