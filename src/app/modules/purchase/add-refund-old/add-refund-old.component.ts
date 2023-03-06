import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationService } from '../../shell/services/notification.service';

@Component({
  selector: 'app-add-refund-old',
  templateUrl: './add-refund-old.component.html',
  styleUrls: ['./add-refund-old.component.scss']
})
export class AddRefundOldComponent implements OnInit, OnDestroy {
  selectedProducts: any[] = [];
  displayInfo = false;
  displayTrackable = false;
  products: any[] = [
    { Product: 'a', Quantity: 3, Price: 1, isRefund: false }
  ];
  purchaseDetail: any;
  bckPurchaseDetail: any;
  totalProducts = 0;
  subTotal: any = 0;
  totalDiscount: any = 0;
  totalTax: any = 0;
  grandTotal: any = 0;


  constructor(private api: vaplongapi, private activatedRoute: ActivatedRoute, private notificationService: NotificationService) {

  }
  ngOnDestroy(): void {

  }
  ngOnInit() {
    const snapshot = this.activatedRoute.snapshot;
    this.api.GetPurchaseById(snapshot.params.id).pipe(untilDestroyed(this)).subscribe(x => {
      if (x.ResponseCode == 0) {

        this.purchaseDetail = x.AllPurchaseList[0];

        this.purchaseDetail.PurchasesDetails.forEach((item, i) => {
          item.selectedQuantity = item.ReturnedQuantity - item.Quantity;
          item.NewReturnedQuantity = item.Quantity - item.ReturnedQuantity;
          item.isNewRefund = false;
          item.displayTrackable = false;
        });
        this.bckPurchaseDetail = x.AllPurchaseList[0];
      }
    });
  }

  refreshRefundSummary(item: any = null) {

    const retQty = item ? item.Quantity : 0 - item ? item.ReturnedQuantity : 0;
    if (item && ((retQty) < item.NewReturnedQuantity || item.NewReturnedQuantity <= 0)) {
      item.NewReturnedQuantity = retQty;
      return;
    }

    let discount = 0;
    let returnTotalDiscount = 0;
    let returnSubTotal = 0;
    let returnTotalTax = 0;
    let returnCartTotal = 0;

    if (this.purchaseDetail.PurchasesDetails.length > 0) {
      this.purchaseDetail.PurchasesDetails.forEach((purchase, i) => {
        if (purchase.isNewRefund) {
          discount = (purchase.dTotalDiscount * purchase.dTotalAmount) / 100;
          discount = (discount / purchase.Quantity) * purchase.Quantity;
          returnTotalDiscount += (discount);
          returnSubTotal += (purchase.dTotalAmount / purchase.Quantity) * (purchase.NewReturnedQuantity)
          returnTotalTax += purchase.TaxAmount;
          // discount = parseFloat((purchase.dTotalDiscount * purchase.dTotalAmount)/100).toFixed(3);
          // discount = parseFloat((parseFloat(discount) / purchase.Quantity) * item.Quantity).toFixed(3);
          // returnTotalDiscount += parseFloat(discount);
          // returnSubTotal += parseFloat(parseFloat((purchase.dTotalAmount / purchase.Quantity) * parseInt(item.Quantity)).toFixed(3));
          // returnTotalTax += parseFloat(parseFloat(purchase.TaxAmount).toFixed(3));
        }
      });

      returnCartTotal = (returnTotalTax) + (returnSubTotal) - (returnTotalDiscount);

      this.totalProducts = this.purchaseDetail.PurchasesDetails.filter(x => x.isNewRefund).length;
      this.subTotal = returnSubTotal.toFixed(3);
      this.totalDiscount = returnTotalDiscount.toFixed(3);
      this.totalTax = returnTotalTax.toFixed(3);
      this.grandTotal = returnCartTotal.toFixed(3);
      // $("#txtSubTotal").text('@POS.Web.Models.SessionManagement.userDetails.SystemConfig.CurrencySign ' + returnSubTotal);
      // $("#txtTotalDiscount").text('@POS.Web.Models.SessionManagement.userDetails.SystemConfig.CurrencySign ' + returnTotalDiscount);
      // $("#txtTotalTax").text('@POS.Web.Models.SessionManagement.userDetails.SystemConfig.CurrencySign ' + returnTotalTax);
      // $("#txtGrandTotal").text('@POS.Web.Models.SessionManagement.userDetails.SystemConfig.CurrencySign ' + returnCartTotal);
    }
    else {
      this.totalProducts = 0;
      this.subTotal = 0;
      this.totalDiscount = 0;
      this.totalTax = 0;
      this.grandTotal = 0;
    }
  }
  refund() {

  }
  getTrackable(product) {
    return product.TrackableProductsPurchaseDetails.filter(x => x.IsReturnedItem).length;
  }
  fullPurchaseRefund() {

  }
}
