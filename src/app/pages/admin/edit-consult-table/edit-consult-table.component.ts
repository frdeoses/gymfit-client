import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { ITraining } from 'src/app/interfaces/training-table/training.interface';
import { ITrainingTable } from 'src/app/interfaces/training-table/trainingTable.interface';
import { IUser } from 'src/app/interfaces/user/usuario.interface';
import { MachineService } from 'src/app/services/gym-machine/machine.service';
import { LoginService } from 'src/app/services/login/login.service';
import { TablesService } from 'src/app/services/tables/tables.service';
import { TrainingService } from 'src/app/services/training/training.service';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-consult-table',
  templateUrl: './edit-consult-table.component.html',
  styleUrls: ['./edit-consult-table.component.css'],
  providers: [],
})
export class EditConsultTableComponent implements OnInit, OnDestroy {
  tableId: string = '';
  editMode: boolean | undefined;

  trainingTable: ITrainingTable = {
    id: '',
    user: {
      name: '',
      username: '',
      authorities: [],
      birthDate: new Date(),
      email: '',
      password: '',
      phone: '',
      surname: '',
    },
    name: '',
    typeTraining: '',
    creationDate: new Date(),
    endDate: new Date(),
    initDate: new Date(),
  };

  trainingTypes: string[] = [];
  listTraining: ITraining[] = [];
  users: IUser[] = [];

  // TODO: Revisar estas validaciones de fechas
  initADD: boolean = false;
  endADD: boolean = false;

  rolLogin: string = '';

  constructor(
    private tableService: TablesService,
    private userService: UserService,
    private trainingService: TrainingService,
    private loginService: LoginService,
    private machineService: MachineService,
    private snack: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    this.tableService.removeItem();
  }

  ngOnInit(): void {
    let rolUser = this.loginService.getCurrentUserRole();

    if (!_.isUndefined(rolUser)) {
      this.rolLogin = rolUser.toUpperCase();
    }

    this.tableId = this.route.snapshot.params['tableId'];

    this.editMode = this.tableService.getModeEdit() === 'yes' ? true : false;

    this.tableService.getTrainingTable(this.tableId).subscribe(
      (data: ITrainingTable) => {
        this.trainingTable = data;

        console.log(this.trainingTable);
      },
      (error) => {
        console.error(error);
      }
    );

    this.trainingService.listTraining().subscribe(
      (data: ITraining[]) => {
        this.listTraining = data;
        console.log(this.listTraining);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error!!', 'Error al cargar los ejercicios', 'error');
      }
    );

    this.machineService.allTrainingType().subscribe(
      (data: string[]) => {
        this.trainingTypes = data;
        console.log(this.trainingTypes);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error:', 'Error al cargar los tipos de ejercicios');
      }
    );

    this.userService.listUser().subscribe(
      (data: IUser[]) => {
        this.users = data;
        console.log(this.users);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error:', 'Error al cargar los usuarios', 'error');
      }
    );
  }

  formSubmit() {
    if (
      _.isNull(this.trainingTable) ||
      _.isUndefined(this.trainingTable.user)
    ) {
      this.snack.open('Es obligatorio asignar un usuario', 'Aceptar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      });
      return;
    }

    // Para evitar problemas al guardar en el back
    this.trainingTable.user.authorities = [];

    // Para evitar problemas al guardar en el back
    if (
      !_.isUndefined(this.trainingTable.listTraining) &&
      this.trainingTable.listTraining.length > 0
    )
      this.checkUserListTrainings(this.trainingTable.listTraining);

    // TODO: Revisar ya que cuando falla al tener formateados los valores me suma dias sin sumar
    if (_.isFunction(this.trainingTable.initDate.getDate) && !this.initADD) {
      this.trainingTable.initDate.setDate(
        this.trainingTable.initDate.getDate() + 1
      );
      this.initADD = true;
    } else {
      this.trainingTable.initDate = new Date(this.trainingTable.initDate);
    }

    if (_.isFunction(this.trainingTable.endDate.getDate) && !this.endADD) {
      this.trainingTable.endDate.setDate(
        this.trainingTable.endDate.getDate() + 1
      );
      this.endADD = true;
    } else {
      this.trainingTable.endDate = new Date(this.trainingTable.endDate);
    }

    if (
      _.isNull(this.trainingTable) ||
      _.isNull(this.trainingTable.name) ||
      _.isEmpty(this.trainingTable.name)
    ) {
      this.snack.open(
        'El nombre de la tabla de entrenamiento es obligatorio',
        'Aceptar',
        {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        }
      );
      return;
    }
    if (
      _.isNull(this.trainingTable) ||
      _.isNull(this.trainingTable.typeTraining) ||
      _.isEmpty(this.trainingTable.typeTraining)
    ) {
      this.snack.open(
        'El tipo de entrenamiento de la tabla de entrenamiento es obligatorio',
        'Aceptar',
        {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        }
      );
      return;
    }
    if (_.isNull(this.trainingTable) || _.isNull(this.trainingTable.initDate)) {
      this.snack.open(
        'La fecha de iniciación de la tabla de entrenamiento es obligatorio',
        'Aceptar',
        {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        }
      );
      return;
    }

    if (_.isNull(this.trainingTable) || _.isNull(this.trainingTable.endDate)) {
      this.snack.open(
        'La fecha de finalización de entrenamiento de la tabla de entrenamiento es obligatorio',
        'Aceptar',
        {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        }
      );
      return;
    }

    // TODO: Revisar todo esto
    // ;

    if (this.initADD)
      this.trainingTable.initDate.setDate(
        this.trainingTable.initDate.getDate() - 1
      );

    if (this.endADD)
      this.trainingTable.endDate.setDate(
        this.trainingTable.endDate.getDate() - 1
      );

    if (
      this.trainingTable.initDate.getDate() >=
      this.trainingTable.endDate.getDate()
    ) {
      if (this.initADD) {
        this.trainingTable.initDate.setDate(
          this.trainingTable.initDate.getDate() + 1
        );
        // this.initADD = true;
      }

      if (this.endADD) {
        this.trainingTable.endDate.setDate(
          this.trainingTable.endDate.getDate() + 1
        );
        // this.endADD = true;
      }

      this.endADD = true;
      this.initADD = true;

      this.snack.open(
        'Las fechas introducidas no son correctas, por favor vuelve a introducirla de nuevo.....',
        'Aceptar',
        {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        }
      );
      return;
    }

    // TODO: Revisar todo esto
    if (this.initADD)
      this.trainingTable.initDate.setDate(
        this.trainingTable.initDate.getDate() + 1
      );

    if (this.endADD)
      this.trainingTable.endDate.setDate(
        this.trainingTable.endDate.getDate() + 1
      );

    this.tableService.editTrainingTable(this.trainingTable).subscribe(
      (data) => {
        console.log(data);
        Swal.fire(
          'Tabla de entrenamiento guardado:',
          'La tabla de entrenamiento se ha actualizado con éxito!!',
          'success'
        );
        this.router.navigate(['/admin/tables']);
      },
      (error) => {
        console.error(error);

        Swal.fire(
          'Error:',
          'Ha ocurrido un error en el sistema al actualizar la tabla de entrenamiento!!',
          'error'
        );
      }
    );
  }

  /**
   * Borra los roles para evitar errores en el server
   * @param listTraining
   */
  checkUserListTrainings(listTraining: ITraining[]) {
    listTraining.forEach((training) => {
      let user = this.trainingTable.user;
      training.user = user;
    });
  }
}
