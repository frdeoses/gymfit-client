import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import baseUrl from '../helper';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  public eventStatusSubject = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  public listEvents() {
    return this.http.get(`${baseUrl[2]}/api/gymfit/calendars`);
  }

  public createEvent(event: any) {
    return this.http.post(`${baseUrl[2]}/api/gymfit/calendar`, event);
  }

  public deleteEvent(eventId: any) {
    return this.http.delete(`${baseUrl[2]}/api/gymfit/calendars/${eventId}`);
  }
  public getEvent(eventId: any) {
    return this.http.get(`${baseUrl[2]}/api/gymfit/calendars/${eventId}`);
  }

  public editEvent(eventId: any) {
    return this.http.put(`${baseUrl[2]}/api/gymfit/calendar`, eventId);
  }
}
