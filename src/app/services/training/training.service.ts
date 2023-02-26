import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ITraining } from 'src/app/interfaces/training-table/training.interface';
import baseUrl from '../helper';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  public refresh$ = new Subject<void>();

  constructor(private http: HttpClient) {}

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
   * Crea una nueva tabla
   * @param table
   * @returns
   */
  public createTraining(table: ITraining): Observable<ITraining> {
    return this.http.post<ITraining>(
      `${baseUrl[1]}/api/gymfit/training-tables/training`,
      table
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
