import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { StorageService } from 'src/app/shared/services/storage.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { isNullOrUndefined } from 'util';
import { NotificationService } from '../../shell/services/notification.service';

@Component({
  selector: 'app-online-order-detail',
  templateUrl: './online-order-detail.component.html',
  styleUrls: ['./online-order-detail.component.scss']
})
export class OnlineOrderDetailComponent implements OnInit, OnDestroy {

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
    private apiService: vaplongapi, private storageService: StorageService,private notificationService: NotificationService,public route: Router,
    public router: ActivatedRoute) {
      this.usermodel = this.storageService.getItem('UserModel');

      const obj = {
        Action: 'View',
        Description: `View Details of Online Order`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then(x => { }); 
     }

  ngOnDestroy(): void {

  }
  ngOnInit() {
    const id = this.router.snapshot.params['id'];
    this.PrintingInvoiceFuntion(id);
  }
  Close() {
    let callingRoute = this.storageService.getItem('OnlineSaleDetailRoute');
    if (isNullOrUndefined(callingRoute) || callingRoute == '') {
      this.route.navigate(['/reports/online-orders']);
    }
    else {
      this.route.navigate([callingRoute]);
    }
  }
  PrintingInvoiceFuntion(id) {
    const req = { ID: id };
    this.apiService.GetOnlineOrderPackingSlipByID(req).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        
        this.SaleDetails = response1.PackingSlip;
        
        const saleDetails = [];
        this.SaleDetails.OrderByName = this.SaleDetails.CustomerName;
        this.customerDetail(this.SaleDetails.CustomerID, true);
        //this.customerDetail(this.SaleDetails.DeliveredToID, false);

        let subtotal = 0;
        let totalDiscount = 0;
        let grandTotal = 0;
        this.SaleDetails.DeliveredToName = this.SaleDetails.DeliveredToName;
        this.SaleDetails.DeliveryAddress = this.SaleDetails.ShippingAddress;
        this.SaleDetails.InvoiceAddress = this.SaleDetails.InvoiceAddress;
        
        const shipment = this.SaleDetails.ShippingCost;
        this.SaleDetails.newSaleDetails = [...this.SaleDetails.PackingSlipDetails];
        this.SaleDetails.PackingSlipDetails.forEach(item => {
          subtotal = subtotal + (item.dTotalValue-item.dTotalTaxValue);
          //totalDiscount = totalDiscount + item.dTotalDiscount;
          item.display = false;
        });
        grandTotal = subtotal - this.SaleDetails.dTotalDiscountValue  + shipment + this.SaleDetails.dTotalTaxValue ;
        const restAmount = grandTotal - this.SaleDetails.dTotalPaidValue;
        //this.SaleDetails.dDiscountValue = totalDiscount;
        this.SaleDetails.subTotal = subtotal;
        //this.SaleDetails.totalDiscount = totalDiscount;
        this.SaleDetails.shipment = shipment;
        this.SaleDetails.grandTotal = grandTotal;
        //this.SaleDetails.restAmount = restAmount;
       
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
        } else {
          this.DeliverToDetails.Number = response.CustomerModel.PhoneNo;
          this.SaleDetails.DeliveredToCompanyName = response.CustomerModel.PhoneNo;
        }
      }
    });
  }
  Print() {
    setTimeout(() => {


      let printContents;
      let popupWin;

      printContents = document.getElementById('printA4-online-order-preview').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
  <html>
    <head>
      <title>Report</title>
      <style>
      //........Customized style.......
      .sty{
        'width: 67%;color: #000; float: left;text-align: left; margin: 0;font-size: 12px; font-weight: 600;padding-right: 10px;
      }
      </style>
    </head>
<body onload='window.print();self.close();'>${printContents}</body>
  </html>`);
      popupWin.document.close();
    }, 500);
  }

}
