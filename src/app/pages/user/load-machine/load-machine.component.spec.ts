import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadMachineComponent } from './load-machine.component';

describe('LoadMachineComponent', () => {
  let component: LoadMachineComponent;
  let fixture: ComponentFixture<LoadMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadMachineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
