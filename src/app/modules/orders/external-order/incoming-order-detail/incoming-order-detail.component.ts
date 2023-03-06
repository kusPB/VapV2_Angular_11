import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-incoming-order-detail',
  templateUrl: './incoming-order-detail.component.html',
  styleUrls: ['./incoming-order-detail.component.scss']
})
export class IncomingOrderDetailComponent implements OnInit, OnDestroy {

  SaleDetails: any;
  customerDetails = {
    Number: '',
    Address: '',
    CurrentBalance: ''
  };
  DeliverToDetails = {
    Number: '',
    Address: ''
  };
  usermodel: any;
  constructor(
    private apiService: vaplongapi,  private storageService: StorageService,private notificationService: NotificationService, public router: ActivatedRoute)
  {
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Details of a External Order`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }
  ngOnDestroy() {

  }
  ngOnInit() {
    const id = this.router.snapshot.params.id;
    this.GetbyID(Number(id));
  }
  GetbyID(id) {
    const req = { ID: id };
    ;
    this.apiService.getPerfomaSaleById(req).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
      
        this.SaleDetails = response1.PerfomaSale;
        //this.SaleDetails.OrderByName = this.SaleDetails.Customer;
        this.customerDetail(this.SaleDetails.CustomerID, true);
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response1.message);
      }
    });
  }

  customerDetail(customerId, isCustomer: boolean = true) {
    const id = {
      ID: customerId,
    };
    this.apiService.GetCustomerbyID(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        if (isCustomer) {
          this.customerDetails.Number = response.CustomerModel.PhoneNo;
          this.customerDetails.Address = response.CustomerModel.Address;
          this.customerDetails.CurrentBalance = response.CustomerModel.CurrentBalance;
          this.SaleDetails.OrderByCompany = response.CustomerModel.PhoneNo;
          this.SaleDetails.InvoiceAddress = response.CustomerModel.Address;
          this.SaleDetails.CustomerDetails = this.customerDetails;
        } else {
          this.DeliverToDetails.Number = response.CustomerModel.PhoneNo;
          // this.DeliverToDetails.Address = response.CustomerModel.Address;
          this.SaleDetails.DeliveredToCompanyName = response.CustomerModel.PhoneNo;
        }
      }
    });
  }
  Print() {
    setTimeout(() => {


      let printContents;
      let popupWin;

      printContents = document.getElementById('printA4-incoming-order-detail').innerHTML;
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
