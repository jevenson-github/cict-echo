import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPartnerAdminComponent } from './view-partner-admin.component';

describe('ViewPartnerAdminComponent', () => {
  let component: ViewPartnerAdminComponent;
  let fixture: ComponentFixture<ViewPartnerAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPartnerAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPartnerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
