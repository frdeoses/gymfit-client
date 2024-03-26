import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  phonePattern: string = '^[0-9]*$';

  constructor() {}

  public isValidField(form: FormGroup, field: string) {
    // debugger;
    return form.controls[field].errors && form.controls[field].touched;
  }

  public getFieldError(field: string, form: FormGroup): string | null {
    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres `;
        case 'notEquals':
          return 'Las contraseñas deben de ser iguales';
        case 'pattern':
          return 'Los datos introducidos no son correctos, por favor vuelve a introducirlos';
        case 'invalidDate':
          return 'La fecha introducida es incorrecta, o no se ha introducido la fecha';
        case 'futureDate':
          return 'La fecha no puede ser futura';
      }
    }
    return null;
  }

  public isFieldOneEqualFieldTwo(field1: string, field2: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;

      if (fieldValue1 !== fieldValue2) {
        formGroup.get(field2)?.setErrors({ notEquals: true });
        return { notEqual: true };
      }

      formGroup.get(field2)?.setErrors(null);
      return null;
    };
  }

  public getMessageErrorFieldOptional(field1: string): string {
    switch (field1) {
      case 'description':
        return 'No se ha introducido ninguna descripción';

      case 'exercisedArea':
        return 'No se ha introducido ningún area ejercitada';

      default:
        return '';
    }
  }

  public validarFecha(field: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const fechaString = formGroup.get(field)?.value;
      if (!fechaString) {
        formGroup.get(field)?.setErrors({ invalidDate: true }); // o { required: true } si la fecha es obligatoria
        return { required: true }; // o { required: true } si la fecha es obligatoria
      }

      const date = new Date(fechaString);
      if (isNaN(date.getTime())) {
        formGroup.get(field)?.setErrors({ invalidDate: true });
        return { invalidDate: true };
      }

      // Obtener la fecha actual
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Omitir la hora actual para comparar solo la fecha

      // Verificar si la fecha es futura
      if (date > today) {
        formGroup.get(field)?.setErrors({ futureDate: true });
        return { futureDate: true };
      }

      // Aquí puedes agregar lógica adicional para validar el rango de fechas
      // Por ejemplo, no permitir fechas futuras para una fecha de nacimiento

      formGroup.get(field)?.setErrors(null);
      return null;
    };
  }
}
