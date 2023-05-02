import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerAdminComponent } from './partner-admin.component';

describe('PartnerAdminComponent', () => {
  let component: PartnerAdminComponent;
  let fixture: ComponentFixture<PartnerAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
