import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css'],
})
export class EditEventComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {}

  eventId = '';
  event = {
    comments: undefined,
    description: '',
    id: '',
    published: false,
    title: '',
  };

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params['eventId'];

    this.eventService.getEvent(this.eventId).subscribe(
      (data: any) => {
        this.event = data.body;
        console.log(this.event);
      },
      (error) => {
        console.error(error);
      }
    );

    // alert(this.eventId);
  }

  public editEvent() {
    this.eventService.editEvent(this.event).subscribe(
      (data: any) => {
        Swal.fire(
          'Evento actualizado',
          'El evento se ha modificado con exito...',
          'success'
        );
        this.router.navigate(['/admin/events']);
      },
      (error) => {
        Swal.fire(
          'Error en el sistema',
          'El evento no se ha modificado con exito...',
          'error'
        );
        console.error(error);
      }
    );
  }
}
