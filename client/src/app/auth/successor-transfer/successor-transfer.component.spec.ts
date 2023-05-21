import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessorTransferComponent } from './successor-transfer.component';

describe('SuccessorTransferComponent', () => {
  let component: SuccessorTransferComponent;
  let fixture: ComponentFixture<SuccessorTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessorTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessorTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
