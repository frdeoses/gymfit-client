import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/model/user/usuario.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user: IUser = {
    id: undefined,
    name: '',
    userName: '',
    password: '',
    surname: '',
    email: '',
    birthDate: new Date(),
    height: undefined,
    phone: '',
  };

  constructor() {}

  ngOnInit(): void {}
}
