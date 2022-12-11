import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrlUser from '../helper';

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
    return this.http.get(`${baseUrlUser[1]}/api/gymfit/training-tables`);
  }

  /**
   * Crea una nueva tabla
   * @param table
   * @returns
   */
  public createTable(table: any) {
    return this.http.post(`${baseUrlUser[1]}/api/gymfit/training-table`, table);
  }
}
