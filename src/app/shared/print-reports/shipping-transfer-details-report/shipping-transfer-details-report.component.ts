import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shipping-transfer-details-report',
  templateUrl: './shipping-transfer-details-report.component.html',
  styleUrls: ['./shipping-transfer-details-report.component.scss']
})
export class ShippingTransferDetailsReportComponent implements OnInit {
  environmentData: any;
  @Input() selectedshipping: any = null;
  @Input() FromOutLetData: any = null;
  @Input() ToOutLetData: any = null;
  @Input() totalData: any = null;
  @Input() isHidden = true;

  ShipmentDetails: any[] = [];
  constructor() {
    this.environmentData = environment;
  }

  ngOnInit() {
    this.ShipmentDetails = this.selectedshipping.ShipmentDetails;
  }

  Print() {
    setTimeout(() => {
      let printContents;
      let popupWin;

      printContents = document.getElementById('printA4').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
  <html>
    <head>
      <title>Report</title>
      <style>
      //........Customized style.......
      .sty{
        "width: 67%;color: #000; float: left;text-align: left; margin: 0;font-size: 12px; font-weight: 600;padding-right: 10px;
      }
      </style>
    </head>
<body onload="window.print();self.close();">${printContents}</body>
  </html>`);
      popupWin.document.close();
    }, 500);
  }
}
