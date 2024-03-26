import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Event } from 'src/app/interfaces/calendars/event.interface';
import baseUrl from './helper';
import { INotification } from 'src/app/interfaces/notification.interface';
import * as uuid from 'uuid';
import { NotificationService } from './notification.service';
import { ResponseHTTP } from 'src/app/interfaces/response-http.interface';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  public refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  public getRefresh() {
    this.refresh$;
  }

  public listEvents(): Observable<ResponseHTTP<Event[]>> {
    return this.http.get<ResponseHTTP<Event[]>>(
      `${baseUrl[2]}/api/gymfit/calendars`
    );
  }

  /**
   * Lista los eventos publicados en el sistema
   */
  public listEventsPublished(): Observable<ResponseHTTP<Event[]>> {
    return this.http.get<ResponseHTTP<Event[]>>(
      `${baseUrl[2]}/api/gymfit/calendars/published`
    );
  }

  public createEvent(event: Event): Observable<ResponseHTTP<Event>> {
    return this.http
      .post<ResponseHTTP<Event>>(`${baseUrl[2]}/api/gymfit/calendar`, event)
      .pipe(
        tap((response: ResponseHTTP<Event>) => {
          const notification: INotification = {
            id: uuid.v4(),
            title: 'Nuevo Evento',
            description: `Se ha creado un nuevo evento: ${response.body.title}`,
            date: new Date(),
            read: false,
            page: `/events/${response.body.id}`,
          };
          // Agregar la notificación al servicio de notificaciones

          this.notificationService.addNotification(notification);
          this.refresh$.next();
        })
      );
  }

  public deleteEvent(eventId: string): Observable<ResponseHTTP<string>> {
    return this.http
      .delete<ResponseHTTP<string>>(
        `${baseUrl[2]}/api/gymfit/calendars/${eventId}`
      )
      .pipe(
        tap(() => {
          const notification: INotification = {
            id: uuid.v4(),
            title: 'Eliminar Evento',
            description: `Se ha eliminado el evento correctamente`,
            date: new Date(),
            read: false,
            page: '',
          };
          // Agregar la notificación al servicio de notificaciones

          this.notificationService.addNotification(notification);
          this.refresh$.next();
        })
      );
  }
  public getEvent(eventId: string): Observable<ResponseHTTP<Event>> {
    return this.http.get<ResponseHTTP<Event>>(
      `${baseUrl[2]}/api/gymfit/calendars/${eventId}`
    );
  }

  public editEvent(event: Event): Observable<ResponseHTTP<Event>> {
    return this.http
      .patch<ResponseHTTP<Event>>(`${baseUrl[2]}/api/gymfit/calendar`, event)
      .pipe(
        tap(() => {
          const notification: INotification = {
            id: uuid.v4(),
            title: 'Actualizar Evento',
            description: `Se ha actualizado el evento: ${event.title}`,
            date: new Date(),
            read: false,
            page: `/events/${event.id}`,
          };
          // Agregar la notificación al servicio de notificaciones

          this.notificationService.addNotification(notification);

          this.refresh$.next();
        })
      );
  }
}
