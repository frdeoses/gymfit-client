import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { CreateMachineComponent } from './create-machine.component';

import { MachineService } from '@services/machine.service';
import { TrainingService } from '@services/training.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ResponseHTTP } from '@interfaces/response-http.interface';
import { GymMachine } from '@interfaces/index';
import Swal from 'sweetalert2';

describe('CreateMachineComponent', () => {
  let component: CreateMachineComponent;
  let fixture: ComponentFixture<CreateMachineComponent>;
  let machineService: MachineService;
  let trainingService: TrainingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      declarations: [CreateMachineComponent],
      providers: [MachineService, TrainingService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMachineComponent);
    component = fixture.componentInstance;
    machineService = TestBed.inject(MachineService);
    trainingService = TestBed.inject(TrainingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.myForm.valid).toBeFalsy();
  });

  it('should call createMachine and navigate on successful creation', () => {
    spyOn(machineService, 'createGymMachine').and.returnValue(
      of({ body: { name: 'New Machine' } } as ResponseHTTP<GymMachine>)
    );

    // Espía el servicio Router directamente
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');

    component.createMachine();

    expect(machineService.createGymMachine).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/admin/gym-machines']);
  });

  it('should display error when createMachine fails', () => {
    spyOn(machineService, 'createGymMachine').and.returnValue(
      throwError(() => new Error('Failed to create machine'))
    );
    const spy = spyOn(Swal, 'fire');

    component.createMachine();

    expect(machineService.createGymMachine).toHaveBeenCalled();

    expect(spy).toHaveBeenCalledWith(
      'Error:',
      'Error al crear la máquina de entrenamiento',
      'error'
    );
  });
});
