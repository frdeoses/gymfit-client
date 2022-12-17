import { Component, OnInit } from '@angular/core';
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
  }

  deleteEvent(eventId: any) {
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
          () => {
            // this.events = this.events.filter((event: any) => {
            //   event.id != eventId;
            // });

            Swal.fire(
              'Examen eliminado',
              'El examen ha sido eliminado correctamente...',
              'success'
            );

            // TODO: RECARGAR TODOS LOS EVENTOS NUEVAMENTE
            // window.location.reload();
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
