/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PurchaseDetailPackingListCustomizedReportComponent } from './purchase-detail-packinglist-customized-report.component';

describe('PurchaseDetailPackingListCustomizedReportComponent', () => {
  let component: PurchaseDetailPackingListCustomizedReportComponent;
  let fixture: ComponentFixture<PurchaseDetailPackingListCustomizedReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseDetailPackingListCustomizedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseDetailPackingListCustomizedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
