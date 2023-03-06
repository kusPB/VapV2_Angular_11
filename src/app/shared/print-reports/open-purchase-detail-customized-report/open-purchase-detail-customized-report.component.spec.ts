/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OpenPurchaseDetailCustomizedReportComponent } from './open-purchase-detail-customized-report.component';

describe('OpenPurchaseDetailCustomizedReportComponent', () => {
  let component: OpenPurchaseDetailCustomizedReportComponent;
  let fixture: ComponentFixture<OpenPurchaseDetailCustomizedReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenPurchaseDetailCustomizedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenPurchaseDetailCustomizedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
