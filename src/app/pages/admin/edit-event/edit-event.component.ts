import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Comment, Event, ResponseHTTP, CommentDto } from '@interfaces/index';

import { EventService } from '@services/event.service';
import { LoginService } from '@services/login/login.service';
import { ValidatorService } from '@services/validator.service';
import { ViewModeService } from '@services/view-mode.service';

import { CommentDialogComponent } from 'src/app/components/dialog/comment/comment-dialog.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css'],
})
export class EditEventComponent implements OnInit, OnDestroy {
  eventId: string = '';
  event?: Event;

  subscription: Subscription = new Subscription();

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
    private snack: MatSnackBar,
    private validatorService: ValidatorService,
    private viewModeService: ViewModeService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params['eventId'];

    this.editMode = this.viewModeService.getModeEdit() === 'yes' ? true : false;

    this.eventService.getEvent(this.eventId).subscribe(
      (response: ResponseHTTP<Event>) => {
        this.event = response.body;
        this.comments = this.event.comments || [];

        this.myForm.reset(this.event);

        console.log(this.event);
      },
      (error: HttpErrorResponse) => {
        console.error(error);

        const msjError =
          error.error.error || 'Ha ocurrido un error en el sistema...';

        Swal.fire('Error en el sistema', msjError, 'error');

        this.router.navigate(['/error']);
      }
    );

    this.subscription = this.eventService.refresh$.subscribe(() => {
      this.eventService.getEvent(this.eventId).subscribe(
        (response: ResponseHTTP<Event>) => {
          this.event = response.body;

          if (this.event && this.event.comments) {
            this.comments = [...this.event.comments.reverse()];
          }

          console.log(response);
        },
        (error) => {
          console.error(error);

          const message = error.error.error || 'Error en el sistema';
          Swal.fire('Error', message, 'error');
        }
      );
    });
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
          `El evento '${response.body.title}' se ha modificado con éxito...`,
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
    const username = this.loginService.getUser().username;

    const dialogRef = this.dialog.open(CommentDialogComponent, {
      data: {
        idCalendar: this.event?.id,
        username: username,
        comment: '',
      } as CommentDto,
    });

    dialogRef.afterClosed().subscribe((result: CommentDto) => {
      console.log('The dialog was closed');

      if (!this.isValidCommentDto(result)) return;

      this.addComment(result);
    });
  }

  /**
   * Entrar en modo consulta
   */
  modeConsult() {
    this.editMode = false;
    this.viewModeService.modeEdit('no');
  }

  addComment(commentDto: CommentDto) {
    this.eventService.addComment(commentDto).subscribe(
      () => {
        Swal.fire(
          'Comentario añadido:',
          `El comentario ha sido añadido con éxito...`,
          'success'
        );
      },
      (error) => {
        console.error(error);
        Swal.fire('Error', 'No se ha podido añadir el comentario', 'error');
      }
    );
  }

  isValidCommentDto(commentDto: CommentDto): boolean {
    if (!commentDto) return false;

    if (!commentDto.comment || commentDto.comment.length == 0) {
      this.snack.open('No se ha introducido ningún comentario...', 'Aceptar', {
        duration: 3000,
      });
      return false;
    }

    return true;
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
