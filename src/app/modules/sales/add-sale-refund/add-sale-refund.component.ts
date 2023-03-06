import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { NotificationService } from '../../shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { isNullOrUndefined } from 'util';
import { randomNumber } from 'src/app/Helper/randomNumber';

@Component({
  selector: 'app-add-sale-refund',
  templateUrl: './add-sale-refund.component.html',
  styleUrls: ['./add-sale-refund.component.scss'],
  providers: [ConfirmationService]
})
export class AddSaleRefundComponent implements OnInit, OnDestroy {
  selectedProducts: any[] = [];
  displayInfo = false;
  displayTrackable = false;
  isbtnFullSaleReturnEnable = false;
  products: any[] = [{ Product: 'a', Quantity: 3, Price: 1, isRefund: false }];
  saleData: any;
  bckSaleDetail: any;
  totalProducts = 0;
  subTotal: any = 0;
  totalDiscount: any = 0;
  totalTax: any = 0;
  grandTotal: any = 0;

  returnTrackables: any[] = [];
  returnDetails: any[] = [];
  displayTrackableBtn = false;
  PaymentModeID = 1;
  saleID: number;
  usermodel: UserModel;
  CashRegisterHistoryID = 1;

  isCaptchaDisplayed = false;
  isCapchaValidated = false;
  firstNumber=0;
  secondNumber=0;
  ActionType=1;

  constructor(
    private api: vaplongapi,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    public router: Router,
    private storageService: StorageService
  ) { }
  ngOnDestroy(): void {

  }
  ngOnInit() {
    this.usermodel = this.storageService.getItem('UserModel');
    this.CashRegisterHistoryID = this.storageService.getItem('CashRegisterHistoryID');

    const snapshot = this.activatedRoute.snapshot;
    this.saleID = Number(snapshot.params.id);
    const param = { ID: this.saleID };
    this.api.GetSaleByID(param).pipe(untilDestroyed(this)).subscribe((x) => {
      if (x.ResponseCode === 0) {
        this.saleData = x.Sale;
        this.PaymentModeID = this.saleData.PaymentModeID;

        if (this.saleData.IsReturned) {
          if (this.saleData.ReturnedTyped === 1 || 2) {
            this.isbtnFullSaleReturnEnable = false;
          } else {
            this.isbtnFullSaleReturnEnable = true;
          }
        } else {
          this.isbtnFullSaleReturnEnable = true;
        }

        const deleteIndexes: any[] = [];
        if (this.saleData != null) {
          this.saleData.SaleDetails.forEach((item, i) => {
            item.OriginalQuantity = item.Quantity;
            item.Quantity = item.Quantity - item.ReturnedQuantity;
            item.dTotalValue = item.dTotalUnitValue * item.Quantity;
            item.dTotalDiscount = item.dTotalDiscount - (item.dTotalDiscount / item.OriginalQuantity);

            // item.selectedQuantity = item.OriginalQuantity;
            item.NewReturnedQuantity = item.Quantity;
            item.isNewRefund = false;
            item.displayTrackable = false;
            item.dDiscountPer = (item.Quantity === 0) ? 0 : (item.dTotalDiscount / item.dTotalValue * 100);
            if (item.TrackableProductsSaleDetails.length > 0) {
              item.displayTrackableBtn = true;
            } else {
              item.displayTrackableBtn = false;
            }
            if (item.Quantity === 0) {
              deleteIndexes.push(i);
              this.saleData.SaleDetails.splice(i, 1);
            }
          });
          deleteIndexes.forEach(index => {
            if (index > -1) {
              this.saleData.SaleDetails.splice(index, 1);
            }
          });
        }
        this.bckSaleDetail = x.Sale;
      }
    });
  }

  selectUnselectProduct(item1, selectAllTrackable = true) {
    const item = this.saleData.SaleDetails.filter(x => x.ID === item1.ID)[0];
    const isTrackable = (item.TrackableProductsSaleDetails.length > 0) ? true : false;

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
        this.saleData.SaleDetails.filter(x => x.ID === item1.ID)[0].isNewRefund = false;
        if (selectAllTrackable) {
          item.TrackableProductsSaleDetails.array.forEach(element => {
            this.returnTrackables.push(element.TrackableCode);
          });
        } else {
          quantity = 0;
        }
      } else {
        this.saleData.SaleDetails.filter(x => x.ID === item1.ID)[0].isNewRefund = true;
      }

      const detail = { SaleDetailID: item.ID, Quantity: quantity, ReturnTrackableCodeList: this.returnTrackables };
      this.returnDetails.push(detail);
    }
    else {
      const indexDetails = this.returnDetails.findIndex(x => x.SaleDetailID === item.ID);
      // tslint:disable-next-line: deprecation
      if (isNullOrUndefined(indexDetails)) {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Product is not selected');
      }
      else {
        this.returnDetails.splice(indexDetails, 1);
        this.saleData.SaleDetails.filter(x => x.ID === item1.ID)[0].isNewRefund = false;
        // $('#txtQuantityID' + index).val(item.Quantity);
      }
    }
    this.refreshRefundSummary(item1);
  }

  selectUnselectTrackableCode(item1, item2) {

    const item = this.saleData.SaleDetails.filter(x => x.ID === item1.ID).shift();
    const saleID = item1.ID;

    if (item2.IsReturnedItem) {
      let details = this.returnDetails.filter(x => x.SaleDetailID === Number(saleID)).shift();
      // tslint:disable-next-line: deprecation
      if (isNullOrUndefined(details)) {
        this.saleData.SaleDetails.filter(x => x.ID === item1.ID)[0].isNewRefund = false;
        this.selectUnselectProduct(item1, false);
        details = this.returnDetails.filter(x => x.SaleDetailID === Number(saleID)).shift();
      }

      details.Quantity = details.Quantity + 1;
      this.saleData.SaleDetails.filter(x => x.ID === item1.ID)[0].NewReturnedQuantity = details.Quantity;

      this.returnTrackables = details.ReturnTrackableCodeList;
      this.returnTrackables.push(item2.TrackableCode);
      details.ReturnTrackableCodeList = this.returnTrackables;
    }
    else {
      const details = this.returnDetails.filter(x => x.SaleDetailID === Number(saleID)).shift();
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
          this.saleData.SaleDetails.filter(x => x.ID === item1.ID)[0].NewReturnedQuantity = details.Quantity;

          if (details.Quantity === 0) {
            this.saleData.SaleDetails.filter(x => x.ID === item1.ID)[0].isNewRefund = false;
            this.selectUnselectProduct(item1, false);
          }
        }
      }
    }

    this.refreshRefundSummary(item1);
  }
  refreshTrackablesDetailsTable(item1) {
    const sale = this.saleData.SaleDetails.filter(x => x.ID === item1.ID).shift();
    const jsonobj = sale.TrackableProductsSaleDetails;
    let isProductFoundInReturn = false;
    const isChecked = false;
    let productCheckBox;
    let trackables;
    const newtrackablelistForAssign: any[] = [];
    const detail = this.returnDetails.filter(x => x.SaleDetailID === item1.ID).shift();
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
        this.saleData.SaleDetails.filter(x => x.ID === item1.ID).TrackableProductsSaleDetails = newtrackablelistForAssign;

      }
    }

    this.saleData.SaleDetails.filter(x => x.ID === item1.ID)[0].displayTrackable = true;
  }

  changeQuantityOfReturnProduct(item1) {
    let quantity = item1.NewReturnedQuantity;

    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(quantity)) {
      quantity = 0;
    }

    const item = this.saleData.SaleDetails.filter(x => x.ID === item1.ID).shift();
    // const isTrackable = (item.TrackableProductsSaleDetails.length > 0) ? true : false;

    const detail = this.returnDetails.filter(x => x.SaleDetailID === item.ID).shift();

    detail.Quantity = quantity;

    this.refreshRefundSummary(item1);
  }

  blurQuantityOfReturnProduct(item1) {
    const quantity = item1.NewReturnedQuantity;

    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(quantity) || quantity <= 0 || quantity === '0') {
      this.saleData.SaleDetails.filter(x => x.ID === item1.ID)[0].isNewRefund = false;
      this.selectUnselectProduct(item1, false);
    }

    const item = this.saleData.SaleDetails.filter(x => x.ID === item1.ID).shift();

    if (quantity > item.Quantity) {
      this.saleData.SaleDetails.filter(x => x.ID === item1.ID)[0].NewReturnedQuantity = item.Quantity;
      this.changeQuantityOfReturnProduct(item1);
    }

    this.refreshRefundSummary(item1);
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

    if (this.saleData.SaleDetails.length > 0) {
      this.saleData.SaleDetails.forEach((sale, i) => {
        if (sale.isNewRefund) {
          discount = ((sale.dTotalDiscount / sale.Quantity) * item.NewReturnedQuantity);
          returnTotalDiscount += discount;
          returnSubTotal +=
            (sale.dTotalValue / sale.Quantity) *
            sale.NewReturnedQuantity;
          returnTotalTax += sale.TaxAmount;

        }
      });

      returnCartTotal = returnTotalTax + returnSubTotal - returnTotalDiscount;

      this.totalProducts = this.saleData.SaleDetails.filter(
        (x) => x.isNewRefund
      ).length;
      this.subTotal = returnSubTotal.toFixed(2);
      this.totalDiscount = returnTotalDiscount.toFixed(2);
      this.totalTax = returnTotalTax.toFixed(2);
      this.grandTotal = returnCartTotal.toFixed(2);

    } else {
      this.totalProducts = 0;
      this.subTotal = 0;
      this.totalDiscount = 0;
      this.totalTax = 0;
      this.grandTotal = 0;
    }
  }

  getTrackable(product) {
    return product.TrackableProductsSaleDetails.filter(
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
    this.fullSaleRefund();
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




  fullSaleRefund() {

    
 if(!this.isCapchaValidated)
 {
   this.openCaptcha();
this.ActionType =1;
   return;
}
    this.confirmationService.confirm({
      message: 'Do you want to refund full sale?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const params = {
          PaymentModeID: this.PaymentModeID,
          SaleID: this.saleID,
          UpdatedByID: this.usermodel.ID,
          CashRegisterHistoryID: Number(this.CashRegisterHistoryID),
          OutletID: this.usermodel.OutletID,
        };
        this.api.FullSaleReturn(params).pipe(untilDestroyed(this)).subscribe((x) => {
          if (x.ResponseCode === 0) {
            this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', x.ResponseText);
            this.router.navigate(['/sale/sale-index']);
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
      message: 'Do you want to refund this sale?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        if (this.returnDetails.length < 1) {
          this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please select a product');
          return;
        }
        const returnSaleDetaillist = [];

        this.returnDetails.forEach(element => {
          const model = {
            SaleDetailID: element.SaleDetailID,
            Quantity: element.Quantity,
          };
          returnSaleDetaillist.push(model);

        });

        const params = {
          PaymentModeID: this.PaymentModeID,
          SaleID: this.saleID,
          UpdatedByID: this.usermodel.ID,
          ReturnSaleDetailList: returnSaleDetaillist,
          CashRegisterHistoryID: Number(this.CashRegisterHistoryID),
          OutletID: this.usermodel.OutletID,
        };
        this.api.HalfSaleReturn(params).pipe(untilDestroyed(this)).subscribe((x) => {
          if (x.ResponseCode === 0) {
            this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', x.ResponseText);
            this.router.navigate(['/sale/sale-index']); 
          } else {
            this.notificationService.notify(NotificationEnum.ERROR, 'Error', x.ResponseText);
          }
        });
      }
    });
  }
}
