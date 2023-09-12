import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IEvent } from 'src/app/interfaces/calendars/event.interface';
import { MachineService } from 'src/app/services/gym-machine/machine.service';
import { LoginService } from 'src/app/services/login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar-user',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  events: IEvent[] = [];
  subscription: Subscription = new Subscription();

  trainingTypes: string[] = [];

  constructor(
    private machineService: MachineService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.machineService.allTrainingType().subscribe(
      (data: string[]) => {
        this.trainingTypes = data;
        console.log(this.trainingTypes);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error:', 'Error al cargar los tipos de ejercicios');
      }
    );
  }

  public logout() {
    this.loginService.logout();
    window.location.reload();
  }
}
