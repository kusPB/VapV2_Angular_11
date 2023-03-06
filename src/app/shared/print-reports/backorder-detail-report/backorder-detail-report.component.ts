import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-backorder-detail-report',
  templateUrl: './backorder-detail-report.component.html',
  styleUrls: ['./backorder-detail-report.component.scss']
})
export class BackOrderDetailReportComponent implements OnInit {
  environmentData: any;
  @Input() purchaseDetail: any = null;
  constructor() {
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
