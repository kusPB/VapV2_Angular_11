import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-incoming-order-detail-report',
  templateUrl: './incoming-order-detail-report.component.html',
  styleUrls: ['./incoming-order-detail-report.component.scss']
})
export class IncomingOrderDetailReportComponent implements OnInit {
  environmentData: any;
  @Input() SaleDetails: any = null;
  @Input() isHidden: boolean = true;
  
  constructor() {
    this.environmentData = environment;
    
  }

  ngOnInit() {
  }


}
