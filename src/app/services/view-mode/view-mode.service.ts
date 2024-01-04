import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewModeService {

  constructor() { }

  /**
   * Cambiamos el valor de la var de la sesión
   *  que nos permiten entrar en modo edición o
   * en modo consulta
   * @param value
   */
  modeEdit(value: string) {
    localStorage.setItem('modeView', value);
  }

  getModeEdit() {
    return localStorage.getItem('modeView');
  }

  removeItem() {
    localStorage.removeItem('modeView');
  }
}
