import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightDialogComponent } from './weight-dialog.component';

describe('WeightDialogComponent', () => {
  let component: WeightDialogComponent;
  let fixture: ComponentFixture<WeightDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeightDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
