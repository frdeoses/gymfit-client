import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGymMachinesComponent } from './edit-gym-machines.component';

describe('EditGymMachinesComponent', () => {
  let component: EditGymMachinesComponent;
  let fixture: ComponentFixture<EditGymMachinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGymMachinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGymMachinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
