import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProgramAdminComponent } from './add-program-admin.component';

describe('AddProgramAdminComponent', () => {
  let component: AddProgramAdminComponent;
  let fixture: ComponentFixture<AddProgramAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProgramAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProgramAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
