import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ITraining } from 'src/app/interfaces/training-table/training.interface';
import { IUser } from 'src/app/interfaces/user/usuario.interface';
import baseUrl from '../helper';
import * as uuid from 'uuid';
import { NotificationService } from '../notification/notification.service';
import { INotification } from 'src/app/interfaces/notification.interface';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  public refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  /**
   * Lista las tablas
   * @returns
   */
  public listTraining(): Observable<ITraining[]> {
    return this.http.get<ITraining[]>(
      `${baseUrl[1]}/api/gymfit/training-tables/trainings`
    );
  }

  /**
   * Lista las tablas por el usuario
   * @returns
   */
  public listTrainingByUser(user: IUser): Observable<ITraining[]> {
    return this.http.post<ITraining[]>(
      `${baseUrl[1]}/api/gymfit/training-tables/trainings/user`,
      user
    );
  }

  /**
   * Crea una nueva tabla
   * @param table
   * @returns
   */
  public createTraining(table: ITraining): Observable<ITraining> {
    return this.http
      .post<ITraining>(
        `${baseUrl[1]}/api/gymfit/training-tables/training`,
        table
      )
      .pipe(
        tap(() => {
          const notification: INotification = {
            id: uuid.v4(),
            title: 'Nuevo Entrenamiento',
            description: `Se ha creado un nuevo entrenamiento: ${table.name}`,
            date: new Date(),
            read: false,
            page: `/trainings/${table.id}`,
          };
          // Agregar la notificación al servicio de notificaciones

          this.notificationService.addNotification(notification);

          this.refresh$.next();
        })
      );
  }

  /**
   *
   * Borra un entrenamiento
   *
   * @param trainingId
   * @returns
   */
  public deleteTraining(trainingId: string): Observable<string> {
    return this.http
      .delete<string>(
        `${baseUrl[1]}/api/gymfit/training-tables/trainings/${trainingId}`
      )
      .pipe(
        tap(() => {
          const notification: INotification = {
            id: uuid.v4(),
            title: 'Eliminar Ejercicio',
            description: `Se ha eliminado el ejercicio correctamente`,
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
   * Obtiene un entrenamiento por su id
   *
   * @param trainingId
   * @returns
   */
  public getTraining(trainingId: string): Observable<ITraining> {
    return this.http.get<ITraining>(
      `${baseUrl[1]}/api/gymfit/training-tables/trainings/${trainingId}`
    );
  }

  /**
   * Obtiene tablas de entrenamiento segun el tipo de entrenamiento
   * y el usuario logeado en la aplicación
   *
   * @param typeTrainingTable
   * @returns
   */
  public getTrainingByTypeTraining(
    typeTraining: string,
    idUser: string
  ): Observable<ITraining[]> {
    return this.http.get<ITraining[]>(
      `${baseUrl[1]}` +
        '/api/gymfit/training-tables/trainings/find-type-training',
      {
        params: {
          typeTraining: typeTraining,
          idUser: idUser,
        },
      }
    );
  }

  /**
   * Edita un entrenamiento
   *
   * @param training
   * @returns
   */
  public editTraining(training: ITraining): Observable<ITraining> {
    return this.http
      .put<ITraining>(
        `${baseUrl[1]}/api/gymfit/training-tables/training`,
        training
      )
      .pipe(
        tap(() => {
          const notification: INotification = {
            id: uuid.v4(),
            title: 'Actualizar Ejercicio',
            description: `Se ha actualizado el ejercicio: ${training.name}`,
            date: new Date(),
            read: false,
            page: `/trainings/${training.id}`,
          };
          // Agregar la notificación al servicio de notificaciones

          this.notificationService.addNotification(notification);

          this.refresh$.next();
        })
      );
  }

  /**
   * Cambiamos el valor de la var de la sesion
   *  que nos permiten entrar en modo edicion o
   * en modo consulta
   * @param value
   */
  modeEdit(value: string) {
    localStorage.setItem('modeView', value);
  }

  // Obtenemos en que modo estamos
  public getModeEdit() {
    return localStorage.getItem('modeView');
  }
  //  eliminamos el token
  public removeItem() {
    localStorage.removeItem('modeView');
  }
}
