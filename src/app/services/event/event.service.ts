import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IEvent } from 'src/app/interfaces/calendars/event.interface';
import baseUrl from '../helper';
import { INotification } from 'src/app/interfaces/notification.interface';
import * as uuid from 'uuid';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  public refresh$ = new Subject<void>();
  numNewEventCreated: number = 0;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  public getRefresh() {
    this.refresh$;
  }

  public listEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${baseUrl[2]}/api/gymfit/calendars`);
  }

  /**
   * Lista los eventos publicados en el sistema
   */
  public listEventsPublished(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(
      `${baseUrl[2]}/api/gymfit/calendars/published`
    );
  }

  public createEvent(event: IEvent): Observable<IEvent> {
    return this.http
      .post<IEvent>(`${baseUrl[2]}/api/gymfit/calendar`, event)
      .pipe(
        tap(() => {
          const notification: INotification = {
            id: uuid.v4(),
            title: 'Nuevo Evento',
            description: `Se ha creado un nuevo evento: ${event.title}`,
            date: new Date(),
            read: false,
            page: `/gym-machines/${event.id}`,
          };
          // Agregar la notificación al servicio de notificaciones

          this.notificationService.addNotification(notification);
          this.refresh$.next();
        })
      );
  }

  public deleteEvent(eventId: string): Observable<string> {
    return this.http
      .delete<string>(`${baseUrl[2]}/api/gymfit/calendars/${eventId}`)
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
  public getEvent(eventId: string): Observable<IEvent> {
    return this.http.get<IEvent>(
      `${baseUrl[2]}/api/gymfit/calendars/${eventId}`
    );
  }

  public editEvent(event: IEvent): Observable<IEvent> {
    return this.http
      .put<IEvent>(`${baseUrl[2]}/api/gymfit/calendar`, event)
      .pipe(
        tap(() => {
          const notification: INotification = {
            id: uuid.v4(),
            title: 'Actualizar Evento',
            description: `Se ha actualizado el evento: ${event.title}`,
            date: new Date(),
            read: false,
            page: `/tables/${event.id}`,
          };
          // Agregar la notificación al servicio de notificaciones

          this.notificationService.addNotification(notification);

          this.refresh$.next();
        })
      );
  }

  
}
