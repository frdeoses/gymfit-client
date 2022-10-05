import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from 'src/app/model/user/usuario.interface';
import baseUrl from '../helper';

@Injectable({
  providedIn: 'root'
})
export class UserService  {

  constructor(
    private httpClient: HttpClient
  ) { }

  public createUser(user: IUser){

    debugger
    return this.httpClient.post(`${baseUrl}/user`,user)

  }

  
}
