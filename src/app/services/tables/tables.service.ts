import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITrainingTable } from 'src/app/interfaces/training-table/trainingTable.interface';
import baseUrl from '../helper';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
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
}
