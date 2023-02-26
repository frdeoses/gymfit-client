import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConsultTableComponent } from './edit-consult-table.component';

describe('EditConsultTableComponent', () => {
  let component: EditConsultTableComponent;
  let fixture: ComponentFixture<EditConsultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConsultTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConsultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
