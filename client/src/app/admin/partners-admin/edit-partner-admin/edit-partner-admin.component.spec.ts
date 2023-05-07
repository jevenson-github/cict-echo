import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPartnerAdminComponent } from './edit-partner-admin.component';

describe('EditPartnerAdminComponent', () => {
  let component: EditPartnerAdminComponent;
  let fixture: ComponentFixture<EditPartnerAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPartnerAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPartnerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
