import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  // template: `<div class="overlay" *ngIf="is_Loading$ | async">
  //   <div class="lds-roller">
  //     <div></div>
  //     <div></div>
  //     <div></div>
  //     <div></div>
  //     <div></div>
  //     <div></div>
  //     <div></div>
  //     <div></div>
  //   </div>
  // </div>`,
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent implements OnInit {
  is_Loading$ = this.spinnerService.isLoading$;
  isLoading: boolean = false;
  constructor(private spinnerService: SpinnerService) {}

  ngOnInit(): void {}
}
