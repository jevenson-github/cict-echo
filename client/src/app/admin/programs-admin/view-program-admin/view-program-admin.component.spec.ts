import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProgramAdminComponent } from './view-program-admin.component';

describe('ViewProgramAdminComponent', () => {
  let component: ViewProgramAdminComponent;
  let fixture: ComponentFixture<ViewProgramAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProgramAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProgramAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
