import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { Event, ResponseHTTP } from '@interfaces/index';

import { EventService } from '@services/event.service';
import { ValidatorService } from '@services/validator.service';

import * as _ from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
})
export class CreateEventComponent implements OnInit {
  myForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    published: [true],
  });
  events: Event[] = [];

  eventData?: Event;

  constructor(
    private eventService: EventService,
    private snack: MatSnackBar,
    private router: Router,
    private fb: FormBuilder,
    private validatorService: ValidatorService
  ) {}

  ngOnInit(): void {
    this.eventService.listEvents().subscribe(
      (response: ResponseHTTP<Event[]>) => {
        this.events = response.body;
        console.log(response);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error!!', 'Error al cargar los eventos...', 'error');
      }
    );
  }

  saveEvent() {
    console.log(this.eventData);

    this.myForm.markAllAsTouched();

    const formValues = this.myForm.value; // Obtén todos los valores del formulario

    this.eventData = {
      ...this.eventData,
      ...formValues, // Actualiza el objeto user con los valores del formulario
    };

    if (!this.eventData) return;

    if (_.isEmpty(this.eventData.title) || _.isNull(this.eventData.title)) {
      this.snack.open('El titulo es obligatorio introducirlo...', '', {
        duration: 3000,
      });

      return;
    }

    this.eventService.createEvent(this.eventData).subscribe(
      (response: ResponseHTTP<Event>) => {
        console.log(response);
        Swal.fire(
          'Evento creado',
          'El evento ha sido creado con éxito!!',
          'success'
        );

        this.myForm.reset();

        // FIXME: Revisar si las notificaciones
        this.router.navigate(['/admin/events']);
      },
      (error) => {
        console.error(error);
        const message =
          error.error.error ||
          'Error en el sistema al crear el siguiente evento';
        Swal.fire('Error:', message, 'error');
      }
    );
  }

  isValidField(field: string) {
    return this.validatorService.isValidField(this.myForm, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(field, this.myForm);
  }
}
