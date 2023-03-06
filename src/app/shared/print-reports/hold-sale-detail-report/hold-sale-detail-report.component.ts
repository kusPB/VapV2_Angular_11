import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hold-sale-detail-report',
  templateUrl: './hold-sale-detail-report.component.html',
  styleUrls: ['./hold-sale-detail-report.component.scss']
})
export class HoldSaleDetailReportComponent implements OnInit {
  environmentData: any;
  @Input() SaleDetails: any = null;
  
  constructor() {
    this.environmentData = environment;
    
  }

  ngOnInit() {
  }


}
