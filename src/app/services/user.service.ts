import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ResponseHTTP, User, UserDto, UserRsDto } from '@interfaces/index';

import baseUrl from './helper';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public refresh$ = new Subject<void>();
  viewEdit: boolean = false;
  navigateProfile: boolean = false;
  constructor(private httpClient: HttpClient) {}

  public createUser(user: User): Observable<ResponseHTTP<User>> {
    return this.httpClient.post<ResponseHTTP<User>>(
      `${baseUrl[0]}/api/gymfit/user`,
      user
    );
  }

  /**
   * Lista los usuarios
   * @returns
   */
  public listUser(): Observable<ResponseHTTP<UserRsDto[]>> {
    return this.httpClient.get<ResponseHTTP<UserRsDto[]>>(
      `${baseUrl[0]}/api/gymfit/users`
    );
  }

  public allRoleUser(): Observable<ResponseHTTP<UserRsDto[]>> {
    return this.httpClient.get<ResponseHTTP<UserRsDto[]>>(
      `${baseUrl[0]}/api/gymfit/users/role/users`
    );
  }

  /**
   *
   * Borra un usuario
   *
   * @param userId
   * @returns
   */
  public deleteUser(userId: string): Observable<ResponseHTTP<string>> {
    return this.httpClient
      .delete<ResponseHTTP<string>>(`${baseUrl[0]}/api/gymfit/users/${userId}`)
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
  public getUser(userId: string): Observable<ResponseHTTP<UserRsDto>> {
    return this.httpClient.get<ResponseHTTP<UserRsDto>>(
      `${baseUrl[0]}/api/gymfit/users/${userId}`
    );
  }

  /**
   * Edita un usuario
   *
   * @param user
   * @returns
   */
  public editUser(user: UserDto): Observable<ResponseHTTP<UserRsDto>> {
    return this.httpClient
      .patch<ResponseHTTP<UserRsDto>>(`${baseUrl[0]}/api/gymfit/user`, user)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  activateNavigateProfile() {
    this.navigateProfile = true;
  }

  disableNavigateProfile() {
    this.navigateProfile = false;
  }
}
