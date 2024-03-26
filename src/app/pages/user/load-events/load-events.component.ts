import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Event } from 'src/app/interfaces/calendars/event.interface';
import { ResponseHTTP } from 'src/app/interfaces/response-http.interface';
import { EventService } from '@services/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-load-events',
  templateUrl: './load-events.component.html',
  styleUrls: ['./load-events.component.css'],
})
export class LoadEventsComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  subscription: Subscription = new Subscription();

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.listEventsPublished().subscribe(
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
      this.eventService.listEventsPublished().subscribe(
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
}
