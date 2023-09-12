import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IWorkedWeights } from 'src/app/interfaces/training-table/workedWeights.interface';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-weight-dialog',
  templateUrl: './weight-dialog.component.html',
  styleUrls: ['./weight-dialog.component.css'],
})
export class WeightDialogComponent implements OnInit {
  weightFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    private dialogRef: MatDialogRef<WeightDialogComponent>,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public workedWeights: IWorkedWeights
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  // validateFields(): boolean {
  validateFields(): void {
    if (
      _.isUndefined(this.workedWeights.serie) ||
      this.workedWeights.serie <= 0
    ) {
      // this.snack.open(
      //   'El numero de serie no es correcto. (0 o menor)',
      //   'Aceptar',
      //   {
      //     duration: 3000,
      //     verticalPosition: 'top',
      //     horizontalPosition: 'right',
      //   }
      // );

      Swal.fire(
        'Error:',
        'El numero de serie no es correcto (0 o menor) y no se ha podido introducir.... ',
        'error'
      );
      // return true;
      return;
    }

    if (
      _.isUndefined(this.workedWeights.weight) ||
      this.workedWeights.weight <= 0
    ) {
      Swal.fire(
        'Error:',
        'El peso introducido no es correcto. (0 o menor)...',
        'error'
      );
      // this.snack.open(
      //   'El peso en la serie no es correcto (0 o menor) y no se ha podido introducir....',
      //   'Aceptar',
      //   {
      //     duration: 3000,
      //     verticalPosition: 'top',
      //     horizontalPosition: 'right',
      //   }
      // );
      // return true;
      return;
    }

    // return false;
  }
}
