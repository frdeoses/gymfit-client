import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITrainingTable } from 'src/app/interfaces/training-table/trainingTable.interface';
import { TablesService } from 'src/app/services/tables/tables.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css'],
})
export class InstructionsComponent implements OnInit {
  tableId: string = '';

  // table: ITrainingTable = {
  //   creationDate: new Date(),
  //   endDate: new Date(),
  //   initDate: new Date(),
  //   name: '',
  //   typeTraining: '',
  //   user: {
  //     name: '',
  //     birthDate: new Date(),
  //     authorities: [],
  //     email: '',
  //     password: '',
  //     phone: '',
  //     surname: '',
  //     username: '',
  //   },
  // };

  constructor() // private tableService: TablesService,
  // private router: ActivatedRoute
  {}

  ngOnInit(): void {
    // this.tableId = this.router.snapshot.params['tableId'];
    // this.tableService.getTrainingTable(this.tableId).subscribe(
    //   (data: ITrainingTable) => {
    //     this.table = data;
    //     console.log(this.table);
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );
  }
}
