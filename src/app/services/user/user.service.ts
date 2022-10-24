import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from 'src/app/model/user/usuario.interface';
import baseUrlUser from '../helper';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  public createUser(user: IUser) {
    debugger;
    return this.httpClient.post(`${baseUrlUser}/api/gymfit/user`, user);
  }
}
