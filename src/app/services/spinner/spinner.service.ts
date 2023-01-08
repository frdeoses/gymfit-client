import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  isLoading$ = new Subject<boolean>();
  isLoading: boolean = false;

  constructor() {}

  show(): void {
    // this.isLoading = true;
    this.isLoading$.next(true);
  }

  hide(): void {
    // this.isLoading = false;
    this.isLoading$.next(false);
  }
}
