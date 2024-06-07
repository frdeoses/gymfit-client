import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isVisible = new BehaviorSubject<boolean>(true);

  isVisible$ = this.isVisible.asObservable();

  constructor() {}

  toggleSidebar() {
    this.isVisible.next(!this.isVisible.value);
  }
}
