import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/model/user/usuario.interface';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  user: IUser  = {
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

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {}

  formSubmit() {
    debugger
    this.userService.createUser(this.user).subscribe(
      (data) => {
        debugger
        console.log(data);
        alert('Usuario creado con exito!!');
      },
      (error) => {
        debugger
        console.error(error);
        alert('Ha ocurrido un error en el sistema!!');
      }
    );
  }
}
