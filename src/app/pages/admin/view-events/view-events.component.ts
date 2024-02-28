import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Event } from 'src/app/interfaces/calendars/event.interface';
import { ResponseHTTP } from 'src/app/interfaces/response-http.interface';
import { EventService } from 'src/app/services/event/event.service';
import { ViewModeService } from 'src/app/services/view-mode/view-mode.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.css'],
})
export class ViewEventsComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  subscription: Subscription = new Subscription();

  constructor(
    private eventService: EventService,

    private viewModeService: ViewModeService
  ) {}

  ngOnInit(): void {
    this.eventService.listEvents().subscribe(
      (response: ResponseHTTP<Event[]>) => {
        this.events = response.body;
        console.log(response);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error!!', 'Error al cargar los eventos...', 'error');
      }
    );

    this.subscription = this.eventService.refresh$.subscribe(() => {
      this.eventService.listEvents().subscribe(
        (response: ResponseHTTP<Event[]>) => {
          this.events = response.body;
          console.log(response);
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
          (response: ResponseHTTP<string>) => {
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

  /**
   * Entrar en modo edición
   */
  modeEdit() {
    this.viewModeService.modeEdit('yes');
  }

  /**
   * Entrar en modo consulta
   */
  modeConsult() {
    this.viewModeService.modeEdit('no');
  }
}
