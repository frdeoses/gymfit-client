import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { Comment, Event, ResponseHTTP } from '@interfaces/index';

import { EventService } from '@services/event.service';
import { LoginService } from '@services/login/login.service';
import { ValidatorService } from '@services/validator.service';
import { ViewModeService } from '@services/view-mode.service';

import { CommentDialogComponent } from 'src/app/components/dialog/comment/comment-dialog.component';

import * as _ from 'lodash';
import Swal from 'sweetalert2';
import * as uuid from 'uuid';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css'],
})
export class EditEventComponent implements OnInit {
  eventId: string = '';
  event?: Event;

  myForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    published: [false],
    // Agrega las otras propiedades y validaciones aquí
  });

  comments: Comment[] = [];
  editMode: boolean | undefined;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private eventService: EventService,
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private viewModeService: ViewModeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params['eventId'];

    this.editMode = this.viewModeService.getModeEdit() === 'yes' ? true : false;

    this.eventService.getEvent(this.eventId).subscribe(
      (response: ResponseHTTP<Event>) => {
        this.event = response.body;

        this.myForm.reset(this.event);

        this.comments =
          !_.isUndefined(this.event.comments) &&
          !_.isNull(this.event.comments) &&
          !_.isEmpty(this.event.comments)
            ? this.event.comments
            : [];
        console.log(this.event);
      },
      (error: HttpErrorResponse) => {
        console.error(error);

        debugger;
        const msjError =
          error.error.error || 'Ha ocurrido un error en el sistema...';

        Swal.fire('Error en el sistema', msjError, 'error');

        this.router.navigate(['/error']);
      }
    );
  }

  public editEvent() {
    this.myForm.markAllAsTouched();

    const formValues = this.myForm.value; // Obtén todos los valores del formulario
    this.event = {
      ...this.event,
      ...formValues, // Actualiza el objeto user con los valores del formulario
    };

    if (!this.event) return;

    this.eventService.editEvent(this.event).subscribe(
      (response: ResponseHTTP<Event>) => {
        Swal.fire(
          'Evento actualizado',
          `El evento ${response.body.title} se ha modificado con éxito...`,
          'success'
        );
        this.router.navigate(['/admin/events']);
        this.myForm.reset();
      },
      (error) => {
        Swal.fire(
          'Error en el sistema',
          'El evento no se ha modificado con éxito...',
          'error'
        );
        console.error(error);
      }
    );
  }

  createComment() {
    let user = this.loginService.getUser();

    const dialogRef = this.dialog.open(CommentDialogComponent, {
      data: {
        id: uuid.v4(),
        idUser: user.id,
        userName: user.username,
        text: '',
        date: new Date(),
      } as Comment,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (!_.isUndefined(result) && !_.isEmpty(result.text))
        this.comments.push(result);
      this.addComment();
    });
  }

  /**
   * Entrar en modo consulta
   */
  modeConsult() {
    this.editMode = false;
    this.viewModeService.modeEdit('no');
  }

  addComment() {
    if (!this.event) return;
    this.event.comments = this.comments;

    this.eventService.editEvent(this.event).subscribe(
      (data: ResponseHTTP<Event>) => {
        console.log(data);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  isValidField(field: string) {
    return this.validatorService.isValidField(this.myForm, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(field, this.myForm);
  }

  getMessage(field: string) {
    return this.validatorService.getMessageErrorFieldOptional(field);
  }
}
