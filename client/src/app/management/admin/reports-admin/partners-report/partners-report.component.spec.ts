import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersReportComponent } from './partners-report.component';

describe('PartnersReportComponent', () => {
  let component: PartnersReportComponent;
  let fixture: ComponentFixture<PartnersReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnersReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
