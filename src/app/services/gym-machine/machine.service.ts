import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IGymMachine } from 'src/app/interfaces/training-table/gymMachine.interface';
import baseUrl from '../helper';

@Injectable({
  providedIn: 'root',
})
export class MachineService {
  public refresh$ = new Subject<void>();
  viewEdit: boolean = false;
  constructor(private http: HttpClient) {}

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
   * @param event
   * @returns
   */
  public createGymMachine(event: IGymMachine): Observable<IGymMachine> {
    return this.http
      .post<IGymMachine>(
        `${baseUrl[1]}/api/gymfit/training-tables/gym-machine`,
        event
      )
      .pipe(
        tap(() => {
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
          this.refresh$.next();
        })
      );
  }

  modeEdit(modeView: boolean) {
    this.viewEdit = modeView;
  }
}
