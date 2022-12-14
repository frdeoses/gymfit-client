import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from 'src/app/services/event/event.service';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
})
export class CreateEventComponent implements OnInit {
  events: any = [];

  eventData = {
    title: '',
    description: '',
    activo: true,
    // type: {
    //   name: '',
    // },
  };

  constructor(
    private eventService: EventService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventService.listEvents().subscribe(
      (data: any) => {
        this.events = data;
        console.log(data);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error!!', 'Error al cargar los eventos...', 'error');
      }
    );
  }

  saveEvent() {
    console.log(this.eventData);

    if (_.isEmpty(this.eventData.title) || _.isNull(this.eventData.title)) {
      this.snack.open('El titulo es obligatorio introducirlo...', '', {
        duration: 3000,
      });

      return;
    }

    this.eventService.createEvent(this.eventData).subscribe(
      (data: any) => {
        console.log(data);
        Swal.fire(
          'Evento creado',
          'El evento ha sido creado con exito!!',
          'success'
        );
        this.eventData = {
          activo: true,
          description: '',
          title: '',
          // type: {
          //   name: '',
          // },
        };

        this.router.navigate(['/admin/events']);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error', 'Error al crear el evento!!', 'error');
      }
    );
  }
}
