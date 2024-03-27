import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GymMachine } from 'src/app/interfaces/training-table/gymMachine.interface';
import baseUrl from './helper';
import { NotificationService } from './notification.service';
import * as uuid from 'uuid';
import { ResponseHTTP } from 'src/app/interfaces/response-http.interface';
import { Notification } from '@interfaces/notification.interface';
@Injectable({
  providedIn: 'root',
})
export class MachineService {
  public refresh$ = new Subject<void>();
  viewEdit: boolean = false;
  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  /**
   * Lista las maquinas de entrenamiento
   * @returns
   */
  public listGymMachines(): Observable<ResponseHTTP<GymMachine[]>> {
    return this.http.get<ResponseHTTP<GymMachine[]>>(
      `${baseUrl[1]}/api/gymfit/training-tables/gym-machines`
    );
  }

  /**
   * Crea una maquina de entrenamiento.
   *
   * @param machine
   * @returns
   */
  public createGymMachine(
    machine: GymMachine
  ): Observable<ResponseHTTP<GymMachine>> {
    return this.http
      .post<ResponseHTTP<GymMachine>>(
        `${baseUrl[1]}/api/gymfit/training-tables/gym-machine`,
        machine
      )
      .pipe(
        tap((response: ResponseHTTP<GymMachine>) => {
          const notification: Notification = {
            id: uuid.v4(),
            title: 'Nueva Maquina',
            description: `Se ha creado una nueva máquina: ${response.body.name}`,
            date: new Date(),
            read: false,
            page: `/gym-machines/${machine.id}`,
          };
          // Agregar la notificación al servicio de notificaciones

          this.notificationService.addNotification(notification);

          this.refresh$.next();
        })
      );
  }

  /**
   *
   * Borra una maquina de entrenamiento
   *
   * @param gymMachineId
   * @returns
   */
  public deleteGymMachine(
    gymMachineId: string
  ): Observable<ResponseHTTP<string>> {
    return this.http
      .delete<ResponseHTTP<string>>(
        `${baseUrl[1]}/api/gymfit/training-tables/gym-machines/${gymMachineId}`
      )
      .pipe(
        tap(() => {
          const notification: Notification = {
            id: uuid.v4(),
            title: 'Eliminar Máquina',
            description: `Se ha eliminado la máquina correctamente`,
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

  /**
   * Obtiene la maquina de entrenamiento por su id
   *
   * @param gymMachineId
   * @returns
   */
  public getGymMachine(
    gymMachineId: string
  ): Observable<ResponseHTTP<GymMachine>> {
    return this.http.get<ResponseHTTP<GymMachine>>(
      `${baseUrl[1]}/api/gymfit/training-tables/gym-machines/${gymMachineId}`
    );
  }

  /**
   * Edita una máquina entrenamiento
   *
   * @param gymMachine
   * @returns
   */
  public editGymMachine(
    gymMachine: GymMachine
  ): Observable<ResponseHTTP<GymMachine>> {
    return this.http
      .patch<ResponseHTTP<GymMachine>>(
        `${baseUrl[1]}/api/gymfit/training-tables/gym-machine`,
        gymMachine
      )
      .pipe(
        tap((response: ResponseHTTP<GymMachine>) => {
          const notification: Notification = {
            id: uuid.v4(),
            title: 'Actualizar Máquina',
            description: `Se ha actualizado la máquina: ${response.body.name}`,
            date: new Date(),
            read: false,
            page: `/gym-machines/${gymMachine.id}`,
          };
          // Agregar la notificación al servicio de notificaciones

          this.notificationService.addNotification(notification);

          this.refresh$.next();
        })
      );
  }

  /**
   * Cambiamos el valor de la var de la sesión
   *  que nos permiten entrar en modo edición o
   * en modo consulta
   * @param value
   */
  likeAdd(value: string) {
    localStorage.setItem('likeAdd', value);
  }

  // Obtenemos en que modo estamos
  public getLikeAdd() {
    return localStorage.getItem('likeAdd');
  }

  //  eliminamos el token
  public removeItems() {
    localStorage.removeItem('likeAdd');
  }
}
