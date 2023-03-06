import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { DatePipe } from '@angular/common';
import { ProductPricesDetailModel } from 'src/app/Helper/models/ProductPricesDetailModel';
import { StorageService } from 'src/app/shared/services/storage.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';

@Component({
  selector: 'app-product-lastaverageprice-dialog',
  templateUrl: './product-lastaverageprice-dialog.component.html',
  styleUrls: ['./product-lastaverageprice-dialog.component.scss'],
  providers: [DatePipe]
})
export class ProductLastAveragePriceDialogComponent implements OnInit, OnDestroy {

  usermodel: UserModel;
  loading: boolean;
  currencySign: string;
  lastAvgPriceDetails: ProductPricesDetailModel;
  @Input() selectedCartRow: any;
  @Input() ProductName: string;
  // @Input() ProductVariantID:number;

  constructor(private apiService: vaplongapi, private storageService: StorageService, private datepipe: DatePipe) {

    this.currencySign = '€';
  }

  ngOnInit(): void {
    this.lastAvgPriceDetails = new ProductPricesDetailModel();
    this.SetProductPriceVariable('0', '0', '0', '0');
    this.SetProductIncomingQuantityVariable('0','0','0');
    this.usermodel = this.storageService.getItem('UserModel');
    this.GetLastAvaragePrice();
    this.getIncomingQuantity();
  }
  ngOnDestroy(): void {
  }

  // GetLastAvaragePrice() {
  //   const params = {
  //     ProductID: this.selectedCartRow.ProductID,
  //     ProductVariantID: this.selectedCartRow.ProductVariantID,
  //     OutletID: this.usermodel.OutletID,
  //     DepartmentID: -1,
  //     CategoryID: -1,
  //     SubCategoryID: 0,
  //     ClassificationID: -1,
  //     IsAllProduct: false,
  //     FromDate: this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
  //     ToDate: this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
  //     PageNo: 0,
  //     PageSize: 100,
  //     IsGetAll: true,
  //     Search: '',
  //     IsReseller:false,
  //     ResellerID:0,

  //   };
  //   if(this.usermodel.IsReseller){
  //     params.IsReseller=true;
  //     params.ResellerID=this.usermodel.ID;
  //   }

  //   this.apiService.GetAllProductStockOverall(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
  //     if (response.ResponseCode === 0) {
  //       if (response.AllStockList.length > 0) {
  //         let Quantity = this.selectedCartRow.Quantity;
  //         if (Quantity === 0) {
  //           Quantity = 1;
  //         }
  //         // tslint:disable-next-line: max-line-length
  //         const profit = ((this.selectedCartRow.UnitPrice - response.AllStockList[0].PurchasePrice.toFixed(2)) * Quantity) - this.selectedCartRow.DiscVal;
  //         // tslint:disable-next-line: max-line-length
  //         this.SetProductPriceVariable(response.AllStockList[0].RemainingStock, response.AllStockList[0].AvgPurchasePrice.toFixed(2), response.AllStockList[0].PurchasePrice.toFixed(2), profit.toFixed(2));
  //       }
  //       else {
  //         this.SetProductPriceVariable('0', '0', '0', '0');
  //       }
  //     }
  //     else {
  //       console.log('internal server error ! not getting api data');
  //     }
  //   },
  //   );


  // }

  GetLastAvaragePrice() {
    const params = {
      ID: this.selectedCartRow.ProductID,
    };
    if(this.usermodel.IsReseller){
   
    }

    //this.apiService.GetProductByProductID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.apiService.GetProductByID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        const jsonobj = response.ProductModel;
          let Quantity = this.selectedCartRow.Quantity;
          if (Quantity === 0) {
            Quantity = 1;
          }
          // tslint:disable-next-line: max-line-length
          const profit = ((this.selectedCartRow.UnitPrice - jsonobj.PurchasePrice.toFixed(2)) * Quantity) - this.selectedCartRow.DiscVal;
          // tslint:disable-next-line: max-line-length
          this.SetProductPriceVariable(jsonobj.AvailibleQuantity, jsonobj.LTAveragPurchasePrice.toFixed(2), jsonobj.PurchasePrice.toFixed(2), profit.toFixed(2));
        
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    },
    );


  }
  getIncomingQuantity() {
    var filterRequestModel = new FilterRequestModel(
      this.selectedCartRow.ProductID,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      new Date(),
      new Date(),
      150000,
      0,
      true,
      false,
      -1,
      -1,
      0,
      false,
      false,
      false,
      "",
      "",
      false,
      false,
      -1,
      -1,
      false,
      false,
      "",
      "",
      "",
      0,
      true
    );

    this.apiService
      .GetAllIncomingQuantity(filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          var AllProductList = response.ProductIncomingQuantityList;
          var totalIncomingQuantity = AllProductList.reduce(function (total, currentValue) {
            return total + currentValue.Quantity;
          }, 0);
          var totalReceivedQuantity = AllProductList.reduce(function (total, currentValue) {
            return total + currentValue.ReceivedQuantity;
          }, 0);
          var totalRemainingQuantity = totalIncomingQuantity-totalReceivedQuantity;
          this.SetProductIncomingQuantityVariable(totalIncomingQuantity.toString(),totalReceivedQuantity.toString(),totalRemainingQuantity.toString());
        } else {
          console.log("internal server error ! not getting api data");
        }
      });
  }

  SetProductIncomingQuantityVariable(
    // tslint:disable-next-line: variable-name
    IncomingQuantity_value: string, ReceivedQuantity_value: string, RemainingQuantity_value: string) {

    this.lastAvgPriceDetails.IncomingQuantity = IncomingQuantity_value;
    this.lastAvgPriceDetails.ReceivedQuantity = ReceivedQuantity_value;
    this.lastAvgPriceDetails.RemainingQuantity = RemainingQuantity_value;
  }

  SetProductPriceVariable(
    // tslint:disable-next-line: variable-name
    availableStock_value: string, averagePurchasePrice_value: string, lastPurchasePrice_value: string, profit_value: string) {

    this.lastAvgPriceDetails.AvailableStock = availableStock_value;
    this.lastAvgPriceDetails.AveragePurchasePrice = averagePurchasePrice_value;
    this.lastAvgPriceDetails.LastPurchasePrice = lastPurchasePrice_value;
    this.lastAvgPriceDetails.Profit = profit_value;
  }


}
