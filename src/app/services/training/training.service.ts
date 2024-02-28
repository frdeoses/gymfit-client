import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { INotification } from 'src/app/interfaces/notification.interface';
import { ResponseHTTP } from 'src/app/interfaces/response-http.interface';
import { Training } from 'src/app/interfaces/training-table/training.interface';
import * as uuid from 'uuid';
import baseUrl from '../helper';
import { NotificationService } from '../notification/notification.service';

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
  public listTraining(): Observable<ResponseHTTP<Training[]>> {
    return this.http.get<ResponseHTTP<Training[]>>(
      `${baseUrl[1]}/api/gymfit/training-tables/trainings`
    );
  }

  /**
   * Lista las tablas por el usuario
   * @returns
   */
  public listTrainingByUser(
    userId: string
  ): Observable<ResponseHTTP<Training[]>> {
    return this.http.get<ResponseHTTP<Training[]>>(
      `${baseUrl[1]}/api/gymfit/training-tables/trainings/users/${userId}`
    );
  }

  /**
   * Crea una nueva tabla
   * @param training
   * @returns
   */
  public createTraining(
    training: Training
  ): Observable<ResponseHTTP<Training>> {
    return this.http
      .post<ResponseHTTP<Training>>(
        `${baseUrl[1]}/api/gymfit/training-tables/training`,
        training
      )
      .pipe(
        tap((response: ResponseHTTP<Training>) => {
          const notification: INotification = {
            id: uuid.v4(),
            title: 'Nuevo Entrenamiento',
            description: `Se ha creado un nuevo entrenamiento: ${response.body.name}`,
            date: new Date(),
            read: false,
            page: `/trainings/${response.body.id}`,
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
  public getTraining(trainingId: string): Observable<ResponseHTTP<Training>> {
    return this.http.get<ResponseHTTP<Training>>(
      `${baseUrl[1]}/api/gymfit/training-tables/trainings/${trainingId}`
    );
  }

  /**
   * Obtiene tablas de entrenamiento según el tipo de entrenamiento
   * y el usuario logeado en la aplicación
   *
   * @param typeTrainingTable
   * @returns
   */
  public getTrainingByTypeTraining(
    typeTraining: string,
    idUser: string
  ): Observable<ResponseHTTP<Training[]>> {
    return this.http.get<ResponseHTTP<Training[]>>(
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
  public editTraining(training: Training): Observable<ResponseHTTP<Training>> {
    return this.http
      .patch<ResponseHTTP<Training>>(
        `${baseUrl[1]}/api/gymfit/training-tables/training`,
        training
      )
      .pipe(
        tap((response: ResponseHTTP<Training>) => {
          const notification: INotification = {
            id: uuid.v4(),
            title: 'Actualizar Ejercicio',
            description: `Se ha actualizado el ejercicio: ${response.body.name}`,
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
   * Lita tipos de entrenamiento (Pecho, hombro,etc.)
   * @returns
   */
  public allTrainingType(): Observable<ResponseHTTP<string[]>> {
    return this.http.get<ResponseHTTP<string[]>>(
      `${baseUrl[1]}/api/gymfit/training-tables/type-training`
    );
  }
}
