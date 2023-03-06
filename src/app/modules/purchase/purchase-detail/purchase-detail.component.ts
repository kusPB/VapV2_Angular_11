import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import * as html2canvas from 'html2canvas';
import { NotificationService } from '../../shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { StorageService } from 'src/app/shared/services/storage.service';
import { isNullOrUndefined } from 'util';
@Component({
  selector: 'app-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styleUrls: ['./purchase-detail.component.scss']
})
export class PurchaseDetailComponent implements OnInit, OnDestroy {
  date = new Date();
  products: any[] = [
    { Product: 'a', Quantity: 3, Price: 1, isRefund: false }
  ];
  purchaseDetail: any = {};
  @ViewChild('screen') screen: ElementRef;
  usermodel: any;
  // api/Purchase/GetByPurchaseID
  constructor(private api: vaplongapi, private activatedRoute: ActivatedRoute,  public route: Router,private notificationService: NotificationService, private storageService: StorageService) {
    this.usermodel = this.storageService.getItem('UserModel');

    const obj = {
      Action: 'View',
      Description: `View Purchase Details`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.api.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnDestroy(): void {

  }
  ngOnInit() {
    const snapshot = this.activatedRoute.snapshot;
    const Param = { ID: snapshot.params.id };
    this.api.GetPurchaseById(Param).pipe(untilDestroyed(this)).subscribe(x => {
      if (x.ResponseCode === 0) {

        this.purchaseDetail = x.AllPurchaseList[0];
        let productSubtotal = 0;
        let productSubtotalFC = 0;
        let subtotal = 0;
        let totalDiscount = 0;
        let grandTotal = 0;
        let discPerc = 0;
        let btntrackable;

        x.AllPurchaseList[0].PurchasesDetails.forEach(item => {
          productSubtotal = item.dTotalAmount + item.dTotalDiscount;
          productSubtotalFC = item.dTotalAmountFC + item.dTotalDiscountFC;
          item.ProductUnitPrice = productSubtotal / item.Quantity;
          productSubtotalFC = productSubtotalFC / item.Quantity;
          discPerc = (item.dTotalDiscount * 100) / (productSubtotal);

          subtotal = subtotal + productSubtotal;
          totalDiscount = totalDiscount + item.dTotalDiscount;
          grandTotal = grandTotal + item.dTotalAmount;
          item.discPerc = ((item.dTotalDiscount * 100) / (productSubtotal)).toFixed(2);
        });
        this.purchaseDetail.subTotal = subtotal.toFixed(2);
        this.purchaseDetail.totalDiscount = totalDiscount.toFixed(2);
        this.purchaseDetail.grandTotal = grandTotal.toFixed(2);
        const Params = { ID: this.purchaseDetail.SupplierID };
        this.api.GetSupplierByID(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
          if (response.ResponseCode === 0) {
            response.SupplierModel.FirstName = response.SupplierModel.FirstName != null ? response.SupplierModel.FirstName : '';
            response.SupplierModel.LastName = response.SupplierModel.LastName != null ? response.SupplierModel.LastName : '';
            response.SupplierModel.FullName = response.SupplierModel.FirstName + ' ' + response.SupplierModel.LastName;
            this.purchaseDetail.supplierDetail = response.SupplierModel;

          }
          else {
            this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Internal Server Error');
          }

        }
        );
      }

    });
  }
  Close() {
    let callingRoute = this.storageService.getItem('PurchaseDetailRoute');
    if (isNullOrUndefined(callingRoute) || callingRoute == '') {
      this.route.navigate(['/purchase/purchase-order-report']);
    }
    else {
      this.route.navigate([callingRoute]);
    }
  }
  Print() {
    //  html2canvas(this.screen.nativeElement).then(canvas => {

    //    const canv = canvas.toDataURL();
    //    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    //    popupWin.document.open();
    //    popupWin.document.write(`
    //  <html>
    //      <head>
    //          <title>Purchase Report</title>
    //      </head>
    //      <body onload="window.print(); window.close()">
    //      <img src="${canv}" />
    //      </body>
    //  </html>
    //  `
    //    );
    //    popupWin.document.close();
    //  });
  }
  Print1() {
    //  html2canvas(this.screen.nativeElement).then(canvas => {

    //    const canv = canvas.toDataURL();
    //    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    //    popupWin.document.open();
    //    popupWin.document.write(`
    //  <html>
    //      <head>
    //          <title>Purchase Report</title>
    //      </head>
    //      <body onload="window.print(); window.close()">
    //      <img src="${canv}" />
    //      </body>
    //  </html>
    //  `
    //    );
    //    popupWin.document.close();
    //  });
  }
}
