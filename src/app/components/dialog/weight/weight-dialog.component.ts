import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { WorkedWeight } from '@interfaces/index';
import { ValidatorService } from '@services/validator.service';

import * as _ from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-weight-dialog',
  templateUrl: './weight-dialog.component.html',
  styleUrls: ['./weight-dialog.component.css'],
})
export class WeightDialogComponent implements OnInit {
  myForm: FormGroup = this.fb.group({
    serie: [undefined, Validators.required],
    weight: [undefined, Validators.required],
    // Agrega las otras propiedades y validaciones aquí
  });

  constructor(
    private dialogRef: MatDialogRef<WeightDialogComponent>,
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    @Inject(MAT_DIALOG_DATA) public workedWeights: WorkedWeight
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  validateFields(): void {
    this.myForm.markAllAsTouched();

    const formValues = this.myForm.value;

    this.workedWeights.serie = formValues['serie'];
    this.workedWeights.weight = formValues['weight'];

    // debugger;

    if (!this.workedWeights) return;

    if (
      _.isUndefined(this.workedWeights.serie) ||
      this.workedWeights.serie <= 0
    ) {
      Swal.fire(
        'Error:',
        'El numero de serie no es correcto (0 o menor) y no se ha podido introducir.... ',
        'error'
      );
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
      return;
    }
  }

  isValidField(field: string) {
    return this.validatorService.isValidField(this.myForm, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(field, this.myForm);
  }
}
