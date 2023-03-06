/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {OpenPurchaseDetailCustomizedComponent} from './open-purchase-detail-customized.component'
describe('OpenPurchaseDetailCustomizedComponent', () => {
  let component: OpenPurchaseDetailCustomizedComponent;
  let fixture: ComponentFixture<OpenPurchaseDetailCustomizedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenPurchaseDetailCustomizedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenPurchaseDetailCustomizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
