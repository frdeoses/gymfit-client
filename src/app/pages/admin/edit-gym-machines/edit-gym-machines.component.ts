import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IGymMachine } from 'src/app/interfaces/training-table/gymMachine.interface';
import { MachineService } from 'src/app/services/gym-machine/machine.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-gym-machines',
  templateUrl: './edit-gym-machines.component.html',
  styleUrls: ['./edit-gym-machines.component.css'],
})
export class EditGymMachinesComponent implements OnInit, OnDestroy {
  gymMachineId: string = '';
  editMode: boolean | undefined;
  subscription: Subscription = new Subscription();
  likeAdd: boolean = false;
  gymMachine: IGymMachine = {
    id: '',
    name: '',
    model: '',
    numMachine: 0,
    like: 0,
    // listWorkedWeights: [],
    description: '',
    exercisedArea: '',
  };

  panelOpenState: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private machineService: MachineService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gymMachineId = this.route.snapshot.params['gymMachineId'];

    this.machineService.getGymMachine(this.gymMachineId).subscribe(
      (data: IGymMachine) => {
        this.gymMachine = data;
        console.log(this.gymMachine);
      },
      (error) => {
        console.error(error);
      }
    );
    this.editMode = this.machineService.getModeEdit() === 'yes' ? true : false;
    this.likeAdd = this.machineService.getLikeAdd() === 'yes' ? true : false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.machineService.removeItems();
  }

  public editGymMachine() {
    this.machineService.editGymMachine(this.gymMachine).subscribe(
      (data: IGymMachine) => {
        Swal.fire(
          'Máquina de entrenamiento actualizado',
          'La máquina de entrenamiento se ha modificado con éxito...',
          'success'
        );
        this.router.navigate(['/admin/gym-machines']);
      },
      (error) => {
        Swal.fire(
          'Error en el sistema',
          'La máquina de entrenamiento no se ha modificado con éxito...',
          'error'
        );
        console.error(error);
      }
    );
  }

  like() {
    this.gymMachine.like++;
    this.machineService.likeAdd('yes');
    this.likeAdd = true;
    this.machineService.editGymMachine(this.gymMachine).subscribe(
      (data: IGymMachine) => {
        console.log('like add and update success');
      },
      (error) => {
        console.error(error);
      }
    );
  }

  modeEdit() {
    this.machineService.modeEdit('yes');
    this.editMode = true;
  }
}
