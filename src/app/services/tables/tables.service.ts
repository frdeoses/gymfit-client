import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ITrainingTable } from 'src/app/interfaces/training-table/trainingTable.interface';
import baseUrl from '../helper';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  public refresh$ = new Subject<void>();
  viewEdit: boolean | undefined;
  constructor(private http: HttpClient) {}

  /**
   * Lista las tablas
   * @returns
   */
  public listTrainingTable(): Observable<ITrainingTable[]> {
    return this.http.get<ITrainingTable[]>(
      `${baseUrl[1]}/api/gymfit/training-tables`
    );
  }

  /**
   * Crea una nueva tabla
   * @param table
   * @returns
   */
  public createTable(table: ITrainingTable): Observable<ITrainingTable> {
    return this.http.post<ITrainingTable>(
      `${baseUrl[1]}/api/gymfit/training-table`,
      table
    );
  }

  /**
   *
   * Borra una tabla de entrenamiento
   *
   * @param trainingTableId
   * @returns
   */
  public deleteTrainingTable(trainingTableId: string): Observable<string> {
    return this.http
      .delete<string>(
        `${baseUrl[1]}/api/gymfit/training-tables/${trainingTableId}`
      )
      .pipe(
        tap(() => {
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
  public getTrainingTable(trainingTableId: string): Observable<ITrainingTable> {
    return this.http.get<ITrainingTable>(
      `${baseUrl[1]}/api/gymfit/training-tables/${trainingTableId}`
    );
  }

  /**
   * Edita una tabla de entrenamiento
   *
   * @param trainingTable
   * @returns
   */
  public editTrainingTable(
    trainingTable: ITrainingTable
  ): Observable<ITrainingTable> {
    return this.http
      .put<ITrainingTable>(
        `${baseUrl[1]}/api/gymfit/training-table/`,
        trainingTable
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
