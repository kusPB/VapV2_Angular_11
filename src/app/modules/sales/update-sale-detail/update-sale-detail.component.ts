import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { NonTrackableProductsLocationModel } from 'src/app/Helper/models/NonTrackableProductsLocationModel';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { randomNumber } from 'src/app/Helper/randomNumber';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { StorageService } from 'src/app/shared/services/storage.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationService } from '../../shell/services/notification.service';

@Component({
  selector: 'app-update-sale-detail',
  templateUrl: './update-sale-detail.component.html',
  styleUrls: ['./update-sale-detail.component.scss']
})
export class UpdateSaleDetailComponent implements OnInit, OnDestroy {

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
  displayProductLocations = false;
  AllProductLocationList: any[] = [];
  usermodel: UserModel;

  isCaptchaDisplayed = false;
  isCapchaValidated = false;
  firstNumber=0;
  secondNumber=0;
  ActionType=1;

  constructor(
    private apiService: vaplongapi, private notificationService: NotificationService, public router: ActivatedRoute,
    public route: Router, private storageService: StorageService) {
    this.usermodel = this.storageService.getItem('UserModel');
  }
  ngOnDestroy(): void {

  }
  ngOnInit() {
    const id = this.router.snapshot.params['id'];
    this.GetSaleByID(id);
  }
  GetSaleByID(id) {
    const req = { ID: id };
    this.apiService.getSaleById(req).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        this.SaleDetails = response1.Sale;
        const saleDetails = [];
        this.SaleDetails.OrderByName = this.SaleDetails.Customer;
        this.customerDetail(this.SaleDetails.CustomerID, true);
        this.customerDetail(this.SaleDetails.DeliveredToID, false);
        let subtotal = 0;
        let totalDiscount = 0;
        this.SaleDetails.DeliveredToName = this.SaleDetails.DeliveredTo;
        this.SaleDetails.DeliveryAddress = this.SaleDetails.DeliveryAddress;
        this.DeliverToDetails.Address = this.SaleDetails.DeliveryAddress;
        this.SaleDetails.SaleDetails.forEach(item => {

          subtotal = subtotal + Number(item.dTotalValue.toFixed(2));
          totalDiscount = totalDiscount + Number(item.dTotalDiscount.toFixed(2));
          item.dDiscountPer = (item.Quantity === 0) ? 0 : (item.dTotalDiscount / Number(item.dTotalValue.toFixed(2)) * 100);
        });
        this.CalculateCartTotals();
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response1.message);
      }
    });
  }
  OpenProductLocations(event) {
    this.AllProductLocationList = this.SaleDetails.SaleDetails.filter(x =>
      x.ProductVariantID === event.ProductVariantID)[0].SaleDetailNonTrackableLocations;
    this.displayProductLocations = true;
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
        } else {
          this.DeliverToDetails.Number = response.CustomerModel.PhoneNo;
          // this.DeliverToDetails.Address = response.CustomerModel.Address;
          this.SaleDetails.DeliveredToCompanyName = response.CustomerModel.PhoneNo;
        }
      }
    });
  }
  OnChangeText(product: any) {
    // let discValue = product.dDiscountPer * product.dTotalUnitValue / 100;
    // let totaldiscount = discValue * product.Quantity;
    // product.dTotalDiscount = totaldiscount.toFixed(2);
    // let total = (product.Quantity * product.dTotalUnitValue);
    // product.dTotalValue = total.toFixed(2);

    this.CalculateCartTotals();
  }
  CalculateCartTotals() {
    let subtotal = 0;
    let totalDiscount = 0;
    let grandTotal = 0;
    // let shipment = this.SaleDetails.ShippingCost;
    // this.SaleDetails.newSaleDetails = [...this.SaleDetails.SaleDetails];
    this.SaleDetails.SaleDetails.forEach(item => {
      item.dDiscountPer = Number(item.dDiscountPer.toFixed(2));
      item.dTotalDiscount = ((Number(item.dDiscountPer.toFixed(2)) * Number(item.dTotalUnitValue.toFixed(2)) / 100) * item.Quantity);
      item.dTotalValue = (item.Quantity * Number(item.dTotalUnitValue.toFixed(2)));
      subtotal += item.dTotalValue;
      totalDiscount += item.dTotalDiscount;
    });
    grandTotal = subtotal - totalDiscount + this.SaleDetails.ShippingCost;
    const restAmount = grandTotal - this.SaleDetails.dTotalPaidValue;
    this.SaleDetails.dDiscountValue = totalDiscount.toFixed(2);
    this.SaleDetails.subTotal = subtotal.toFixed(2);
    this.SaleDetails.totalDiscount = totalDiscount.toFixed(2);
    // this.SaleDetails.shipment=shipment.toFixed(2);
    this.SaleDetails.grandTotal = grandTotal.toFixed(2);
    this.SaleDetails.restAmount = restAmount.toFixed(2);
  }

  
ValidateCaptcha(newValue: any) {
  this.isCaptchaDisplayed = false;
  // console.log(newValue.IsDone);
  this.isCapchaValidated = newValue.IsDone;
  if(this.isCapchaValidated)
  {
if(this.ActionType==1)
    this.UpdateSale();
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



  UpdateSale() {


    if(!this.isCapchaValidated)
    {
      this.openCaptcha();
	this.ActionType =1;
      return;
 }
 
    const typeId = 0;

    let detail;
    let productText;
    let isInvoiceCreated;
    let isTraceable;
    let isRefundable;
    const saleDetails = new Array();
    let product;
    let quantity;
    let unitPrice;
    let discount;
    let discountPer;
    let subtotal;
    let grandTotal;
    for (const item of this.SaleDetails.SaleDetails) {

      productText = item.ProductVariant;
      product = productText.split('(')[0];
      quantity = item.Quantity;
      unitPrice = item.dTotalUnitValue;
      discountPer = item.dDiscountPer;
      discount = item.dTotalDiscount;
      subtotal = (quantity * unitPrice);
      grandTotal = subtotal - discount;
      detail = {
        ID: item.ID,
        Product: product,
        ProductVariantID: item.ProductVariantID,
        Quantity: quantity,
        dTotalAmount: grandTotal,
        dTotalDiscount: Number(discount),
        dDiscountPer: Number(discountPer),
        TaxAmount: 0,
        TaxPer: 0,
        dTotalValue: subtotal,
        dTotalUnitValue: unitPrice,
        TrackableProductsSaleDetails: [],
        SaleDetailNonTrackableLocations: []
      };
      if (detail.TrackableProductsSaleDetails.length > 0) {
        detail.TrackableProductsSaleDetails.forEach(x => { x.ID = 0; });
      }
      if (detail.SaleDetailNonTrackableLocations.length > 0) {
        detail.SaleDetailNonTrackableLocations.forEach(x => { x.ID = 0; });
      }
      saleDetails.push(detail);
    }

    isInvoiceCreated = false;
    isTraceable = false;
    isRefundable = false;


    const discoutPercentage = (Number(this.SaleDetails.totalDiscount) / Number(this.SaleDetails.subTotal)) +
      Number(this.SaleDetails.totalDiscount);
    // let discoutPercentage = (this.SaleDetails.totalDiscount / this.SaleDetails.subTotal) *100;

    const params = {
      ID: this.SaleDetails.ID,
      CustomerID: this.SaleDetails.CustomerID,
      DeliveredToID: this.SaleDetails.DeliveredToID,
      DeliveryAddressID: this.SaleDetails.DeliveryAddressID,
      sRemarks: this.SaleDetails.sRemarks,
      dtDate: this.SaleDetails.dtDate,
      SaleDate: this.SaleDetails.SaleDate,
      PaymentConditionID: this.SaleDetails.PaymentConditionID,
      ShippingMethodID: this.SaleDetails.PaymentConditionID,
      // ShippingCost: this.SaleDetails.shipment,
      ShippingCost: this.SaleDetails.ShippingCost,
      dTotalPaidValue: this.SaleDetails.dTotalPaidValue,
      PaymentModeID: 1,
      SaleDetails: saleDetails,
      IsInvoiceCreated: isInvoiceCreated,
      IsTraceable: isTraceable,
      IsRefundable: isRefundable,
      dTotalSaleValue: Number(this.SaleDetails.grandTotal) - this.SaleDetails.ShippingCost,
      dDiscountValue: Number(this.SaleDetails.totalDiscount),
      dDiscountPercentage: discoutPercentage,
      CreatedByUserID: this.usermodel.ID,
      OutletID: this.usermodel.OutletID,
      TypeID: typeId,
      Type: 'Angular Ui',
      CashRegisterHistoryID: Number(this.storageService.getItem('CashRegisterHistoryID')),
    };

    this.apiService.UpdateSalePayment(params).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.route.navigate(['/sale/sale-index']);
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.message);
      }
    }, (err: any) => {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', err.message);
    });
  }

}
