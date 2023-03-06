import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vp-sale-packing-report',
  templateUrl: './vp-sale-packing-report.component.html',
  styleUrls: ['./vp-sale-packing-report.component.scss']
})
export class VpSalePackingReportComponent implements OnInit {
  environmentData: any;
  imageBasePath:string;

  @Input() SaleDetails: any = null;
  @Input() isHidden = true;
  @Input() TotalQuantity : number= 0;

  constructor() {
    this.environmentData = environment;
    this.imageBasePath = this.environmentData.imageBasePath;
  }

  ngOnInit() {
    //this.TotalQuantity = this.SaleDetails.PackingSlipDetails.reduce((accumulator, value) => { return accumulator + value.Quantity; }, 0); 

  }


}
