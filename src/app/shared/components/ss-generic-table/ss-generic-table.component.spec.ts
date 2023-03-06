import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SsGenericTableComponent } from './ss-generic-table.component';

describe('SsGenericTableComponent', () => {
  let component: SsGenericTableComponent;
  let fixture: ComponentFixture<SsGenericTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SsGenericTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsGenericTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
