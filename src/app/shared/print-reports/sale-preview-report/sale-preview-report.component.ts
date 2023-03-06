import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sale-preview-report',
  templateUrl: './sale-preview-report.component.html',
  styleUrls: ['./sale-preview-report.component.scss']
})
export class SalePreviewReportComponent implements OnInit {
  environmentData: any;
  imageBasePath:string;
  @Input() SaleDetails: any = null;
  @Input() isHidden: boolean = true;
  @Input() TotalQuantity : number= 0;
  constructor() {
    this.environmentData = environment;
    this.imageBasePath = this.environmentData.imageBasePath;
    
  }

  ngOnInit() {
    //this.TotalQuantity = this.SaleDetails.newSaleDetails.reduce((accumulator, value) => { return accumulator + value.Quantity; }, 0); 
  }


}
