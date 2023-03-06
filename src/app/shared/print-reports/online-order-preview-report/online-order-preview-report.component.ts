import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-online-order-preview-report',
  templateUrl: './online-order-preview-report.component.html',
  styleUrls: ['./online-order-preview-report.component.scss']
})
export class OnlineOrderPreviewReportComponent implements OnInit {
  environmentData: any;
  @Input() SaleDetails: any = null;
  @Input() isHidden: boolean = true;
  
  constructor() {
    this.environmentData = environment;
    
  }

  ngOnInit() {
  }


}
