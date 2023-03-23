import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadTrainingComponent } from './load-training.component';

describe('LoadTrainingComponent', () => {
  let component: LoadTrainingComponent;
  let fixture: ComponentFixture<LoadTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
