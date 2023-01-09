import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConsultUserComponent } from './edit-consult-user.component';

describe('EditConsultUserComponent', () => {
  let component: EditConsultUserComponent;
  let fixture: ComponentFixture<EditConsultUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConsultUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConsultUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
