import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { NotificationService } from '../../shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { StorageService } from 'src/app/shared/services/storage.service';
import { isNullOrUndefined } from 'util';
@Component({
  selector: 'app-return-purchase-detail',
  templateUrl: './return-purchase-detail.component.html',
  styleUrls: ['./return-purchase-detail.component.scss']
})
export class ReturnPurchaseDetailComponent implements OnInit, OnDestroy {
  date = new Date();
  products: any[] = [
    { Product: 'a', Quantity: 3, Price: 1, isRefund: false }
  ];
  purchaseDetail: any = {};
  @ViewChild('screen') screen: ElementRef;
  // api/Purchase/GetByPurchaseID
  constructor(private api: vaplongapi, private activatedRoute: ActivatedRoute, private notificationService: NotificationService ,public route: Router, private storageService: StorageService) { }

  ngOnDestroy(): void {

  }
  Close() {
    let callingRoute = this.storageService.getItem('ReturnPurchaseDetailRoute');
    if (isNullOrUndefined(callingRoute) || callingRoute == '') {
      this.route.navigate(['/purchase/return-purchase-report']);
    }
    else {
      this.route.navigate([callingRoute]);
    }
  }
  ngOnInit() {
    const snapshot = this.activatedRoute.snapshot;
    const param = { ID: snapshot.params.id };
    this.api.GetReturnPurchaseByID(param).pipe(untilDestroyed(this)).subscribe(x => {
      if (x.ResponseCode === 0) {
        this.purchaseDetail = x.AllReturnPurchaseList[0];
        let productSubtotal = 0;
        let productSubtotalFC = 0;
        let subtotal = 0;
        let totalDiscount = 0;
        let grandTotal = 0;
        let discPerc = 0;

        this.purchaseDetail.ReturnPurchaseDetails.forEach(item => {
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
        const Param = { ID: this.purchaseDetail.SupplierID };
        this.api.GetSupplierByID(Param).pipe(untilDestroyed(this)).subscribe((response: any) => {

          if (response.ResponseCode === 0) {

            response.SupplierModel.FirstName = response.SupplierModel.FirstName != null ? response.SupplierModel.FirstName : '';
            response.SupplierModel.LastName = response.SupplierModel.LastName != null ? response.SupplierModel.LastName : '';
            response.SupplierModel.FullName = response.SupplierModel.FirstName + ' ' + response.SupplierModel.LastName;

            this.purchaseDetail.supplierDetail = response.SupplierModel;

          }
          else {
            this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error');
          }
        });
      }

    });
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
}
