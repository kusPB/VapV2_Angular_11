/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OpencartLogComponent } from './opencartlog.component';

describe('OpencartLogComponent', () => {
  let component: OpencartLogComponent;
  let fixture: ComponentFixture<OpencartLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpencartLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpencartLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
