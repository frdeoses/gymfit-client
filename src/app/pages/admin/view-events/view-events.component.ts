import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IEvent } from 'src/app/interfaces/calendars/event.interface';
import { EventService } from 'src/app/services/event/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.css'],
})
export class ViewEventsComponent implements OnInit, OnDestroy {
  events: IEvent[] = [];
  subscription: Subscription = new Subscription();

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.eventService.listEvents().subscribe(
      (data: IEvent[]) => {
        this.events = data;
        console.log(data);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error!!', 'Error al cargar los eventos...', 'error');
      }
    );

    this.subscription = this.eventService.refresh$.subscribe(() => {
      this.eventService.listEvents().subscribe(
        (data: IEvent[]) => {
          this.events = data;
          console.log(data);
        },
        (error) => {
          console.error(error);
          Swal.fire('Error!!', 'Error al cargar los eventos...', 'error');
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.log('Observable cerrado');
  }

  deleteEvent(eventId: string) {
    Swal.fire({
      title: 'Eliminar evento',
      text: '¿Estas seguro de eliminar el evento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteEvent(eventId).subscribe(
          (eventIdDeleted: string) => {
            Swal.fire(
              'Evento eliminado',
              'El evento ha sido eliminado correctamente...',
              'success'
            );
          },
          (error) => {
            console.error(error);
            Swal.fire('Error!!', 'Error al eliminar el evento...', 'error');
          }
        );
      }
    });
  }
}
