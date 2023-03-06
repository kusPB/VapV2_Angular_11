import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { NotificationService } from '../../shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { StorageService } from 'src/app/shared/services/storage.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { isNullOrUndefined } from 'util';
import { randomNumber } from 'src/app/Helper/randomNumber';

@Component({
  selector: 'app-add-refund',
  templateUrl: './add-refund.component.html',
  styleUrls: ['./add-refund.component.scss'],
  providers: [ConfirmationService]
})
export class AddRefundComponent implements OnInit, OnDestroy {
  selectedProducts: any[] = [];
  displayInfo = false;
  displayTrackable = false;
  isbtnFullPurchaseReturnEnable = false;
  // products: any[] = [{ Product: 'a', Quantity: 3, Price: 1, isRefund: false }];
  purchaseDetail: any;
  bckPurchaseDetail: any;
  totalProducts = 0;
  subTotal: any = 0;
  totalDiscount: any = 0;
  totalTax: any = 0;
  grandTotal: any = 0;

  returnTrackables: any[] = [];
  returnDetails: any[] = [];
  displayTrackableBtn = false;
  PaymentModeID = 1;
  purchaseID: number;
  usermodel: UserModel;

  isCaptchaDisplayed = false;
  isCapchaValidated = false;
  firstNumber=0;
  secondNumber=0;

  ActionType = 1;


  constructor(
    private api: vaplongapi,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    public router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.usermodel = this.storageService.getItem('UserModel');
    const snapshot = this.activatedRoute.snapshot;
    this.purchaseID = Number(snapshot.params.id);
    const param = { ID: this.purchaseID };
    this.api.GetPurchaseById(param).pipe(untilDestroyed(this)).subscribe((x) => {
      if (x.ResponseCode === 0) {
        this.purchaseDetail = x.AllPurchaseList[0];
        this.PaymentModeID = this.purchaseDetail.PaymentModeID;


        if (this.purchaseDetail.IsReturned) {
          if (this.purchaseDetail.ReturnedTyped === 1 || 2) {
            // $('#btnFullPurchaseReport').addClass('display-none');
            this.isbtnFullPurchaseReturnEnable = false;
          } else {
            // $('#btnFullPurchaseReport').removeClass('display-none');
            this.isbtnFullPurchaseReturnEnable = true;
          }
        } else {
          // $('#btnFullPurchaseReport').removeClass('display-none');
          this.isbtnFullPurchaseReturnEnable = true;
        }


        let singleproductprice = 0;
        if (this.purchaseDetail != null) {
          this.purchaseDetail.PurchasesDetails.forEach((item, i) => {
            singleproductprice = item.dTotalAmount / item.Quantity;
            item.OriginalQuantity = item.Quantity;
            item.Quantity = item.Quantity - item.ReturnedQuantity;
            item.dTotalAmount = singleproductprice * item.Quantity;

            // item.selectedQuantity =  item.OriginalQuantity;
            item.NewReturnedQuantity = item.Quantity;
            item.isNewRefund = false;
            item.displayTrackable = false;

            if (item.TrackableProductsPurchaseDetails.length > 0) {
              item.displayTrackableBtn = true;
            } else {
              item.displayTrackableBtn = false;
            }
          });
        }


        this.bckPurchaseDetail = x.AllPurchaseList[0];
      }
    });
  }
  ngOnDestroy(): void {
  }
  selectUnselectProduct(item1, selectAllTrackable = true) {
    const item = this.purchaseDetail.PurchasesDetails.filter(x => x.ID === item1.ID)[0];
    const isTrackable = (item.TrackableProductsPurchaseDetails.length > 0) ? true : false;

    if (item.isNewRefund) {
      const retQty = item ? item.Quantity : 0 - item ? item.ReturnedQuantity : 0;
      if (
        item &&
        (retQty < item.NewReturnedQuantity || item.NewReturnedQuantity <= 0)
      ) {
        item.NewReturnedQuantity = retQty;
        return;
      }
      let quantity = item.NewReturnedQuantity;
      this.returnTrackables = [];
      if (isTrackable) {
        this.purchaseDetail.PurchasesDetails.filter(x => x.ID === item1.ID)[0].isNewRefund = false;
        if (selectAllTrackable) {
          item.TrackableProductsPurchaseDetails.array.forEach(element => {
            this.returnTrackables.push(element.TrackableCode);
          });
        } else {
          quantity = 0;
        }
      } else {
        this.purchaseDetail.PurchasesDetails.filter(x => x.ID === item1.ID)[0].isNewRefund = true;
      }

      const detail = { PurchaseDetailID: item.ID, Quantity: quantity, ReturnTrackableCodeList: this.returnTrackables };
      this.returnDetails.push(detail);
    } else {
      const indexDetails = this.returnDetails.findIndex(x => x.PurchaseDetailID === item.ID);
      // tslint:disable-next-line: deprecation
      if (isNullOrUndefined(indexDetails)) {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Product is not selected');
      }
      else {
        this.returnDetails.splice(indexDetails, 1);
        this.purchaseDetail.PurchasesDetails.filter(x => x.ID === item1.ID)[0].isNewRefund = false;
        // $('#txtQuantityID' + index).val(item.Quantity);
      }
    }
    this.refreshRefundSummary();
  }

  selectUnselectTrackableCode(item1, item2) {
    const item = this.purchaseDetail.PurchasesDetails.filter(x => x.ID === item1.ID).shift();
    const purchaseID = item1.ID;
    let details;
    if (item2.IsReturnedItem) {
      details = this.returnDetails.filter(x => x.PurchaseDetailID === Number(purchaseID)).shift();
      // tslint:disable-next-line: deprecation
      if (isNullOrUndefined(details)) {
        this.purchaseDetail.PurchasesDetails.filter(x => x.ID === item1.ID)[0].isNewRefund = false;
        this.selectUnselectProduct(item1, false);
        details = this.returnDetails.filter(x => x.PurchaseDetailID === Number(purchaseID)).shift();
      }

      details.Quantity = details.Quantity + 1;
      this.purchaseDetail.PurchasesDetails.filter(x => x.ID === item1.ID)[0].NewReturnedQuantity = details.Quantity;

      this.returnTrackables = details.ReturnTrackableCodeList;
      this.returnTrackables.push(item2.TrackableCode);
      details.ReturnTrackableCodeList = this.returnTrackables;
    }
    else {
      details = this.returnDetails.filter(x => x.PurchaseDetailID === Number(purchaseID)).shift();
      // tslint:disable-next-line: deprecation
      if (isNullOrUndefined(details)) {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Product is not selected');
      }
      else {
        // tslint:disable-next-line: only-arrow-functions
        const trackable = details.ReturnTrackableCodeList.findIndex(function (d) { return d === '' + item2.TrackableCode; });
        // tslint:disable-next-line: deprecation
        if (isNullOrUndefined(trackable)) {
          this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Trackable code is not selected');

        }
        else {
          details.ReturnTrackableCodeList.splice(trackable, 1);
          details.Quantity = details.Quantity - 1;
          this.purchaseDetail.PurchasesDetails.filter(x => x.ID === item1.ID)[0].NewReturnedQuantity = details.Quantity;

          if (details.Quantity === 0) {
            this.purchaseDetail.PurchasesDetails.filter(x => x.ID === item1.ID)[0].isNewRefund = false;
            this.selectUnselectProduct(item1, false);
          }
        }
      }
    }

    this.refreshRefundSummary();
  }
  refreshTrackablesDetailsTable(item1) {
    const purchase = this.purchaseDetail.PurchasesDetails.filter(x => x.ID === item1.ID).shift();
    const jsonobj = purchase.TrackableProductsPurchaseDetails;
    let isProductFoundInReturn = false;
    const isChecked = false;
    let productCheckBox;
    let trackables;
    const newtrackablelistForAssign: any[] = [];
    const detail = this.returnDetails.filter(x => x.PurchaseDetailID === item1.ID).shift();
    // tslint:disable-next-line: deprecation
    if (!isNullOrUndefined(detail)) {
      isProductFoundInReturn = true;
    }

    if (jsonobj != null) {
      if (jsonobj.length !== 0) {
        jsonobj.forEach(item => {
          if (isProductFoundInReturn) {
            // tslint:disable-next-line: only-arrow-functions
            trackables = detail.ReturnTrackableCodeList.filter(function (d) { return d === '' + item.TrackableCode; });
            if (trackables.length > 0) {
              productCheckBox = true;
            } else {
              productCheckBox = false;
            }
          } else {
            productCheckBox = false;
          }

          if (item.IsReturnedItem) {
            return;
          }

          const row = {
            IsReturnedItem: productCheckBox,
            TrackableCode: item.TrackableCode,
          };
          newtrackablelistForAssign.push(row);
        });
        this.purchaseDetail.PurchasesDetails.filter(x => x.ID === item1.ID).TrackableProductsPurchaseDetails = newtrackablelistForAssign;

      }
    }

    this.purchaseDetail.PurchasesDetails.filter(x => x.ID === item1.ID)[0].displayTrackable = true;
  }

  changeQuantityOfReturnProduct(item1) {
    let quantity = item1.NewReturnedQuantity;

    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(quantity)) {
      quantity = 0;
    }

    const item = this.purchaseDetail.PurchasesDetails.filter(x => x.ID === item1.ID).shift();
    const isTrackable = (item.TrackableProductsPurchaseDetails.length > 0) ? true : false;
    const detail = this.returnDetails.filter(x => x.PurchaseDetailID === item.ID).shift();
    detail.Quantity = quantity;
    this.refreshRefundSummary();
  }

  blurQuantityOfReturnProduct(item1) {
    const quantity = item1.NewReturnedQuantity;

    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(quantity) || quantity <= 0 || quantity === '0') {
      this.purchaseDetail.PurchasesDetails.filter(x => x.ID === item1.ID)[0].isNewRefund = false;
      this.selectUnselectProduct(item1, false);
    }

    const item = this.purchaseDetail.PurchasesDetails.filter(x => x.ID === item1.ID).shift();

    if (quantity > item.Quantity) {
      this.purchaseDetail.PurchasesDetails.filter(x => x.ID === item1.ID)[0].NewReturnedQuantity = item.Quantity;
      this.changeQuantityOfReturnProduct(item1);
    }

    this.refreshRefundSummary();
  }

  refreshRefundSummary(item: any = null) {
    const retQty = item ? item.Quantity : 0 - item ? item.ReturnedQuantity : 0;
    if (
      item &&
      (retQty < item.NewReturnedQuantity || item.NewReturnedQuantity <= 0)
    ) {
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
          returnTotalDiscount += discount;
          returnSubTotal +=
            (purchase.dTotalAmount / purchase.Quantity) *
            purchase.NewReturnedQuantity;
          returnTotalTax += purchase.TaxAmount;
          // discount = parseFloat((purchase.dTotalDiscount * purchase.dTotalAmount)/100).toFixed(3);
          // discount = parseFloat((parseFloat(discount) / purchase.Quantity) * item.Quantity).toFixed(3);
          // returnTotalDiscount += parseFloat(discount);
          // returnSubTotal += parseFloat(parseFloat((purchase.dTotalAmount / purchase.Quantity) * parseInt(item.Quantity)).toFixed(3));
          // returnTotalTax += parseFloat(parseFloat(purchase.TaxAmount).toFixed(3));
        }
      });

      returnCartTotal = returnTotalTax + returnSubTotal - returnTotalDiscount;

      this.totalProducts = this.purchaseDetail.PurchasesDetails.filter(
        (x) => x.isNewRefund
      ).length;
      this.subTotal = returnSubTotal.toFixed(2);
      this.totalDiscount = returnTotalDiscount.toFixed(2);
      this.totalTax = returnTotalTax.toFixed(2);
      this.grandTotal = returnCartTotal.toFixed(2);
      // $('#txtSubTotal').text('@POS.Web.Models.SessionManagement.userDetails.SystemConfig.CurrencySign ' + returnSubTotal);
      // $('#txtTotalDiscount').text('@POS.Web.Models.SessionManagement.userDetails.SystemConfig.CurrencySign ' + returnTotalDiscount);
      // $('#txtTotalTax').text('@POS.Web.Models.SessionManagement.userDetails.SystemConfig.CurrencySign ' + returnTotalTax);
      // $('#txtGrandTotal').text('@POS.Web.Models.SessionManagement.userDetails.SystemConfig.CurrencySign ' + returnCartTotal);
    } else {
      this.totalProducts = 0;
      this.subTotal = 0.00;
      this.totalDiscount = 0.00;
      this.totalTax = 0.00;
      this.grandTotal = 0.00;
    }
  }

  getTrackable(product) {
    return product.TrackableProductsPurchaseDetails.filter(
      (x) => x.IsReturnedItem
    ).length;
  }

  
ValidateCaptcha(newValue: any) {
  this.isCaptchaDisplayed = false;
  // console.log(newValue.IsDone);
  this.isCapchaValidated = newValue.IsDone;
  if(this.isCapchaValidated)
  {
    if(this.ActionType==1)
    this.fullPurchaseRefund();
    if(this.ActionType==2)
    this.refund();
  }
}

close() {
  this.isCaptchaDisplayed = false;
  this.isCapchaValidated =  false;
}

openCaptcha(){
  this.firstNumber = randomNumber.generate(1);
  this.secondNumber = randomNumber.generate(1);
  this.isCaptchaDisplayed = true;

}

  fullPurchaseRefund() {

    if(!this.isCapchaValidated)
    {
      this.openCaptcha();
      this.ActionType =1;
      return;
    }

    this.confirmationService.confirm({
      message: 'Do you want to refund full purchase?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const params = {
          PaymentModeID: this.PaymentModeID,
          PurchaseID: this.purchaseID,
          UpdatedByID: this.usermodel.ID,
        };
        this.api.FullPurchaseReturn(params).pipe(untilDestroyed(this)).subscribe((x) => {
          if (x.ResponseCode === 0) {
            this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', x.ResponseText);
            this.router.navigate(['/purchase/purchase-order-report']);

          } else {
            this.notificationService.notify(NotificationEnum.ERROR, 'Error', x.ResponseText);
          }

        });
      }

    });
  }
  refund() {

    if(!this.isCapchaValidated)
    {
      this.openCaptcha();
      this.ActionType =2;
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to refund this purchase?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const params = {
          PaymentModeID: this.PaymentModeID,
          PurchaseID: this.purchaseID,
          UpdatedByID: this.usermodel.ID,
          ReturnPurchaseDetailList: this.returnDetails,
        };
        this.api.HalfPurchaseReturn(params).pipe(untilDestroyed(this)).subscribe((x) => {
          if (x.ResponseCode === 0) {
            this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', x.ResponseText);
            this.router.navigate(['/purchase/purchase-order-report']);

          } else {
            this.notificationService.notify(NotificationEnum.ERROR, 'Error', x.ResponseText);
          }

        });
      }

    });
  }
}
