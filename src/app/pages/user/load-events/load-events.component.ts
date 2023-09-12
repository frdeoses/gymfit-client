import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IEvent } from 'src/app/interfaces/calendars/event.interface';
import { EventService } from 'src/app/services/event/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-load-events',
  templateUrl: './load-events.component.html',
  styleUrls: ['./load-events.component.css'],
})
export class LoadEventsComponent implements OnInit, OnDestroy {
  events: IEvent[] = [];
  subscription: Subscription = new Subscription();

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.listEventsPublished().subscribe(
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
      this.eventService.listEventsPublished().subscribe(
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
}
