import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sale-invoice-report',
  templateUrl: './sale-invoice-report.component.html',
  styleUrls: ['./sale-invoice-report.component.scss']
})
export class SaleInvoiceReportComponent implements OnInit {
  environmentData: any;
  @Input() SaleDetails: any = null;
  txtTotal = 0;
  txtTotalDiscount=0;
  txtSubTotal = 0;
  constructor() {
    this.environmentData = environment;
    // this.txtSubTotal=this.SaleDetails.PackingSlipDetails.reduce((sum, current) => sum + current.dTotalValue, 0)
    // this.txtTotalDiscount=this.SaleDetails.PackingSlipDetails.reduce((sum, current) => sum + current.dTotalDiscount, 0)
    // this.txtTotal = this.txtSubTotal-this.txtTotalDiscount+this.SaleDetails.ShippingCost;
  }

  ngOnInit() {
  }


}
