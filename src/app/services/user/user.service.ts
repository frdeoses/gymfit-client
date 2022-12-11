import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from 'src/app/interfaces/user/usuario.interface';
import baseUrlUser from '../helper';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  public createUser(user: IUser) {
    return this.httpClient.post(`${baseUrlUser[0]}/api/gymfit/user`, user);
  }
}
