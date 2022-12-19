import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IEvent } from 'src/app/interfaces/calendars/event.interface';
import baseUrl from '../helper';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  public refresh$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  public getRefresh() {
    this.refresh$;
  }

  public listEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${baseUrl[2]}/api/gymfit/calendars`);
  }

  public createEvent(event: IEvent): Observable<IEvent> {
    return this.http
      .post<IEvent>(`${baseUrl[2]}/api/gymfit/calendar`, event)
      .pipe(
        tap(() => {
          this.refresh$.next();
        })
      );
  }

  public deleteEvent(eventId: string): Observable<string> {
    return this.http
      .delete<string>(`${baseUrl[2]}/api/gymfit/calendars/${eventId}`)
      .pipe(
        tap(() => {
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
          this.refresh$.next();
        })
      );
  }
}
