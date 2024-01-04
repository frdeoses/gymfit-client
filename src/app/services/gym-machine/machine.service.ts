import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IGymMachine } from 'src/app/interfaces/training-table/gymMachine.interface';
import baseUrl from '../helper';
import { NotificationService } from '../notification/notification.service';
import { INotification } from 'src/app/interfaces/notification.interface';
import * as uuid from 'uuid';
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
  public listGymMachines(): Observable<IGymMachine[]> {
    return this.http.get<IGymMachine[]>(
      `${baseUrl[1]}/api/gymfit/training-tables/gym-machines`
    );
  }

  /**
   * Lita tipos de entrenamiento (Pecho, hombro,etc.)
   * @returns
   */
  public allTrainingType(): Observable<string[]> {
    return this.http.get<string[]>(
      `${baseUrl[1]}/api/gymfit/training-tables/type-training`
    );
  }

  /**
   * Crea una maquina de entrenamiento.
   *
   * @param machine
   * @returns
   */
  public createGymMachine(machine: IGymMachine): Observable<IGymMachine> {
    return this.http
      .post<IGymMachine>(
        `${baseUrl[1]}/api/gymfit/training-tables/gym-machine`,
        machine
      )
      .pipe(
        tap(() => {
          const notification: INotification = {
            id: uuid.v4(),
            title: 'Nueva Maquina',
            description: `Se ha creado una nueva máquina: ${machine.name}`,
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
  public deleteGymMachine(gymMachineId: string): Observable<string> {
    return this.http
      .delete<string>(
        `${baseUrl[1]}/api/gymfit/training-tables/gym-machines/${gymMachineId}`
      )
      .pipe(
        tap(() => {
          const notification: INotification = {
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
  public getGymMachine(gymMachineId: string): Observable<IGymMachine> {
    return this.http.get<IGymMachine>(
      `${baseUrl[1]}/api/gymfit/training-tables/gym-machines/${gymMachineId}`
    );
  }

  /**
   * Edita una máquina entrenamiento
   *
   * @param gymMachine
   * @returns
   */
  public editGymMachine(gymMachine: IGymMachine): Observable<IGymMachine> {
    return this.http
      .put<IGymMachine>(
        `${baseUrl[1]}/api/gymfit/training-tables/gym-machine`,
        gymMachine
      )
      .pipe(
        tap(() => {
          const notification: INotification = {
            id: uuid.v4(),
            title: 'Actualizar Máquina',
            description: `Se ha actualizado la máquina: ${gymMachine.name}`,
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
