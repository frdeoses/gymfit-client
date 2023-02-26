import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { CommentDialogComponent } from 'src/app/components/dialog/comment/comment-dialog.component';
import { IComment } from 'src/app/interfaces/calendars/comment.interface';
import { IEvent } from 'src/app/interfaces/calendars/event.interface';
import { EventService } from 'src/app/services/event/event.service';
import { LoginService } from 'src/app/services/login/login.service';
import Swal from 'sweetalert2';
import * as uuid from 'uuid';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css'],
})
export class EditEventComponent implements OnInit {
  eventId: string = '';
  event: IEvent = {
    comments: [],
    description: '',
    id: '',
    published: false,
    title: '',
  };

  comments: IComment[] = [];
  editMode: boolean | undefined;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params['eventId'];

    this.editMode = this.eventService.getModeEdit() === 'yes' ? true : false;

    this.eventService.getEvent(this.eventId).subscribe(
      (data: IEvent) => {
        this.event = data;
        this.comments =
          !_.isUndefined(this.event.comments) &&
          this.event.comments?.length != 0
            ? this.event.comments
            : [];
        console.log(this.event);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public editEvent() {
    this.eventService.editEvent(this.event).subscribe(
      (data: IEvent) => {
        Swal.fire(
          'Evento actualizado',
          'El evento se ha modificado con exito...',
          'success'
        );
        this.router.navigate(['/admin/events']);
      },
      (error) => {
        Swal.fire(
          'Error en el sistema',
          'El evento no se ha modificado con exito...',
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
      } as IComment,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (!_.isUndefined(result) && !_.isEmpty(result.text))
        this.comments.push(result);
      this.addComment();
    });
  }

  addComment() {
    this.event.comments = this.comments;
    // this.event.comments = [];

    this.eventService.editEvent(this.event).subscribe(
      (data: IEvent) => {
        console.log(data);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
