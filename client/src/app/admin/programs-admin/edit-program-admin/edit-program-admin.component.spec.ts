import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProgramAdminComponent } from './edit-program-admin.component';

describe('EditProgramAdminComponent', () => {
  let component: EditProgramAdminComponent;
  let fixture: ComponentFixture<EditProgramAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProgramAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProgramAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
