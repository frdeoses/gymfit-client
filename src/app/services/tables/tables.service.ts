import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  public listTables() {
    return this.http.get(`${baseUrl[1]}/api/gymfit/training-tables`);
  }

  /**
   * Crea una nueva tabla
   * @param table
   * @returns
   */
  public createTable(table: any) {
    return this.http.post(`${baseUrl[1]}/api/gymfit/training-table`, table);
  }
}
