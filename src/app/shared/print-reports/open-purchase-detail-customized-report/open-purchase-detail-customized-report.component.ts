import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PurchasePermissionEnum } from '../../constant/purchase-permission';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-open-purchase-detail-customized-report',
  templateUrl: './open-purchase-detail-customized-report.component.html',
  styleUrls: ['./open-purchase-detail-customized-report.component.scss']
})
export class OpenPurchaseDetailCustomizedReportComponent implements OnInit {
  environmentData: any;
  PurchasePermission = PurchasePermissionEnum;

  @Input() purchaseDetail: any = null;
  constructor(private permission: PermissionService) {
    this.environmentData = environment;
  }

  ngOnInit() {
  }

  Print() {
    setTimeout(() => {
      // use this.printData variable to print data
      // this.printData 

      let printContents, popupWin;

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
