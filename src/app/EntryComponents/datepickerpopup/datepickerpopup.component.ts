import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-datepickerpopup',
  templateUrl: './datepickerpopup.component.html',
  styleUrls: ['./datepickerpopup.component.scss']
})
export class DatepickerpopupComponent implements OnInit {
  // declare this EventListener in order to listen on it in the parent component.
  @Output() onSelectValue = new EventEmitter<{ fromDate: Date, toDate: Date }>();
  fromDate: Date;
  toDate: Date;
  constructor() { }

  ngOnInit(): void {
    this.fromDate = new Date();
    this.toDate = new Date();
  }

  SelectDate() {
    this.onSelectValue.emit({ fromDate: this.fromDate, toDate: this.toDate });
  }


}
