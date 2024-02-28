import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { INotification } from 'src/app/interfaces/notification.interface';
import { ResponseHTTP } from 'src/app/interfaces/response-http.interface';
import { TrainingTable } from 'src/app/interfaces/training-table/trainingTable.interface';
import * as uuid from 'uuid';
import baseUrl from '../helper';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  public refresh$ = new Subject<void>();
  viewEdit: boolean | undefined;
  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  /**
   * Lista las tablas
   * @returns
   */
  public listTrainingTable(): Observable<ResponseHTTP<TrainingTable[]>> {
    return this.http.get<ResponseHTTP<TrainingTable[]>>(
      `${baseUrl[1]}/api/gymfit/training-tables`
    );
  }

  /**
   * Lista las tablas por el usuario
   * @returns
   */
  public listTrainingTableByUser(
    userId: string
  ): Observable<ResponseHTTP<TrainingTable[]>> {
    return this.http.get<ResponseHTTP<TrainingTable[]>>(
      `${baseUrl[1]}/api/gymfit/training-tables/users/${userId}`
    );
  }

  /**
   * Crea una nueva tabla
   * @param table
   * @returns
   */
  public createTable(
    table: TrainingTable
  ): Observable<ResponseHTTP<TrainingTable>> {
    return this.http
      .post<ResponseHTTP<TrainingTable>>(
        `${baseUrl[1]}/api/gymfit/training-table`,
        table
      )
      .pipe(
        tap((response: ResponseHTTP<TrainingTable>) => {
          const notification: INotification = {
            id: uuid.v4(),
            title: 'Nueva Tabla de Entrenamiento',
            description: `Se ha creado una nueva tabla de entrenamiento: ${response.body.name}`,
            date: new Date(),
            read: false,
            page: `/tables/${table.id}`,
          };
          // Agregar la notificación al servicio de notificaciones

          this.notificationService.addNotification(notification);

          this.refresh$.next();
        })
      );
  }

  /**
   *
   * Borra una tabla de entrenamiento
   *
   * @param trainingTableId
   * @returns
   */
  public deleteTrainingTable(
    trainingTableId: string
  ): Observable<ResponseHTTP<string>> {
    return this.http
      .delete<ResponseHTTP<string>>(
        `${baseUrl[1]}/api/gymfit/training-tables/${trainingTableId}`
      )
      .pipe(
        tap(() => {
          const notification: INotification = {
            id: uuid.v4(),
            title: 'Eliminar Tabla de Entrenamiento',
            description: `Se ha eliminado la tabla de entrenamiento correctamente`,
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
   * Obtiene una tabla de entrenamiento por su id
   *
   * @param trainingTableId
   * @returns
   */
  public getTrainingTable(
    trainingTableId: string
  ): Observable<ResponseHTTP<TrainingTable>> {
    return this.http.get<ResponseHTTP<TrainingTable>>(
      `${baseUrl[1]}/api/gymfit/training-tables/${trainingTableId}`
    );
  }

  /**
   * Obtiene tablas de entrenamiento según el tipo de entrenamiento
   * y el usuario logeado en la aplicación
   *
   * @param typeTrainingTable
   * @returns
   */
  public getTrainingTableByTypeTraining(
    typeTraining: string,
    idUser: string
  ): Observable<ResponseHTTP<TrainingTable[]>> {
    return this.http.get<ResponseHTTP<TrainingTable[]>>(
      `${baseUrl[1]}` + '/api/gymfit/training-tables/find-type-training',
      {
        params: {
          typeTraining: typeTraining,
          idUser: idUser,
        },
      }
    );
  }

  /**
   * Edita una tabla de entrenamiento
   *
   * @param trainingTable
   * @returns
   */
  public editTrainingTable(
    trainingTable: TrainingTable
  ): Observable<ResponseHTTP<TrainingTable>> {
    return this.http
      .patch<ResponseHTTP<TrainingTable>>(
        `${baseUrl[1]}/api/gymfit/training-table/`,
        trainingTable
      )
      .pipe(
        tap((response: ResponseHTTP<TrainingTable>) => {
          const notification: INotification = {
            id: uuid.v4(),
            title: 'Actualizar Tabla de Entrenamiento',
            description: `Se ha actualizado la tabla de entrenamiento: ${response.body.name}`,
            date: new Date(),
            read: false,
            page: `/tables/${trainingTable.id}`,
          };
          // Agregar la notificación al servicio de notificaciones

          this.notificationService.addNotification(notification);

          this.refresh$.next();
        })
      );
  }
}
