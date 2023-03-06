import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vp-sale-preview-report',
  templateUrl: './vp-sale-preview-report.component.html',
  styleUrls: ['./vp-sale-preview-report.component.scss']
})
export class VpSalePreviewReportComponent implements OnInit {
  environmentData: any;
  @Input() SaleDetails: any = null;
  @Input() isHidden: boolean = true;
  
  constructor() {
    this.environmentData = environment;
    
  }

  ngOnInit() {
  }


}
