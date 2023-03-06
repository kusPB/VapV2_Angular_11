import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, SelectItem, MenuItem } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { ProductDropDownData } from 'src/app/Helper/models/ProductDropDownData';
import { ProductLocationReportModel } from 'src/app/Helper/models/ProductLocationReportModel';

import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { StorageService } from 'src/app/shared/services/storage.service';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';


@Component({
  selector: 'app-product-location-details',
  templateUrl: './product-location-details.component.html',
  styleUrls: ['./product-location-details.component.scss']

})
export class ProductLocationDetailsComponent implements OnInit, OnDestroy {
  dateForDD: any;
  productDetail: ProductDropDownData;
  selectedDated: 7;
  totalRecords = 0;
  rows = 25;
  first = 0;
  IsSpinner = false;
  loading = false;
  items: MenuItem[];
  ProductDropDownInfoList: any[] = [];
  AllStockList: any[] = [];
  selectedStock;
  ProductDropdown: SelectItem[];
  filteredProduct: any[];
  selectedProduct: any;
  selectedProductID = '';

  usermodel: UserModel;
  imageBasePath;
  imgSrc = '';
  displayImage = false;
  productLocationReportModel: ProductLocationReportModel;
  

  genericMenuItems: GenericMenuItems[] = [];
  columns: Columns[] = [
    {
      field: 'ProductImage', header: 'Product', sorting: '', placeholder: '', type: TableColumnEnum.IMAGE,
      translateCol: 'SSGENERIC.PRODUCT'
    },
    { field: 'ProductVariant', header: 'Name', sorting: 'ProductVariant', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Barcode', header: 'EAN', sorting: 'Barcode', placeholder: '', translateCol: 'SSGENERIC.EAN' },
    { field: 'Quantity', header: 'Quantity', sorting: 'Quantity', placeholder: '', translateCol: 'SSGENERIC.QUANTITY' },
    { field: 'Location', header: 'Location', sorting: 'Location', placeholder: '', translateCol: 'SSGENERIC.LOCATION' ,type: TableColumnEnum.LOCATION_ROWS}
  ];
  productsColumn: Columns[] = [
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '' },
    { field: 'Color', header: 'Color', sorting: 'Color', placeholder: '' },
    { field: 'PurchasePrice', header: 'PurchasePrice', sorting: 'PurchasePrice', placeholder: '', type:TableColumnEnum.CURRENCY_SYMBOL,  }
  ];
  globalFilterFields = ['ProductVariant'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  ProductData: any[] = [];
  IsOpenProductDialog = false;
  dataFunc: any = customSearchFn;

  constructor(private apiService: vaplongapi, private storageService: StorageService, private notificationService: NotificationService) {
    this.imageBasePath = this.apiService.imageBasePath;
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View All Products Location Details`,
      PerformedAt: new Date().toISOString(), 
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {
    this.productLocationReportModel = new ProductLocationReportModel();
    this.productLocationReportModel.PageNo = 0;
    this.productLocationReportModel.PageSize = 25;
    this.productLocationReportModel.ProductID = 0;
    this.productLocationReportModel.ProductVariantID = 0;
    this.productLocationReportModel.Search = '';
    this.usermodel = this.storageService.getItem('UserModel');
    //this.GetProductDropDownList();
  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
  }
  GetProductDropDownList() {

    this.ProductDropdown = [];
    // this.apiService.GetProductDropDownDatawithVariantInfo().pipe(untilDestroyed(this)).subscribe((response: any) => {
    //   if (response.ResponseText === 'success'){
    //     this.ProductDropDownInfoList = response.DropDownData;
    //     for (let i = 0; i < response.DropDownData.length ; i++){
    //       this.ProductDropdown.push({
    //         value: response.DropDownData[i].ProductVariantID ,
    //         label: response.DropDownData[i].ProducVariantName,
    //       });
    //     }
    this.apiService.GetPurchaseProduct().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.ProductData = response.AllProductVariantList;
        for (const item of response.AllProductVariantList) {
          this.ProductDropDownInfoList.push({
            value: item.ID,
            label: item.Product,
          });
        }
        this.filteredProduct = this.ProductDropDownInfoList;
        if (this.ProductDropDownInfoList.length > 0) {
          this.selectedProductID = response.AllProductVariantList[0].ID;
          this.selectedProduct = {
            value: response.AllProductVariantList[0].ID,
            label: response.AllProductVariantList[0].Product,
          };
          this.getAllStockByLocation(Number(this.selectedProductID), false);
        }
      } else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
        // console.log('internal serve Error', response);
      }
    });
  }

  SearchByProduct(event: any) {
    this.selectedProductID = event.value;
    this.getAllStockByLocation(Number(event.value), false);
  }
  getAllStockByLocation(productVariantID: number, isTrackable: boolean) {
    this.productDetail = this.ProductData.filter(y => y.ID === productVariantID)[0];
    this.productLocationReportModel.PageNo = 0;
    this.productLocationReportModel.PageSize = 25;
    this.productLocationReportModel.ProductID = this.productDetail.ProductID;
    this.productLocationReportModel.ProductVariantID = productVariantID;
    this.productLocationReportModel.Search = '';

    const filterRM = {
      PageNo: 0,
      PageSize: 25,
      Product: '',
      IsTrackable: isTrackable,
    };
    this.GetAllStockDataWithLazyLoadinFunction(filterRM);
  }

  GetAllStockDataWithLazyLoadinFunction(filterRM ) {
    let IsTrackable = false;
    this.productLocationReportModel.LocationStatus = 3;
    this.productLocationReportModel.OutletID = this.usermodel.OutletID;
    this.productLocationReportModel.PageNo = filterRM.PageNo;
    this.productLocationReportModel.PageSize = filterRM.PageSize;
    this.productLocationReportModel.Search = filterRM.Product;
    IsTrackable = filterRM.IsTrackable;

      this.apiService.GetNonTrackableProductLocationTotalCountReportNew(this.productLocationReportModel)
        .pipe(untilDestroyed(this)).subscribe((response: any) => {
          if (response.ResponseCode === 0) {

            this.totalRecords = response.TotalRowCount;
          } else {
            this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
          }
        },
        );
      this.apiService.GetNonTrackableProductLocationReportNew(this.productLocationReportModel)
        .pipe(untilDestroyed(this)).subscribe((response: any) => {
          if (response.ResponseCode === 0) {
            this.AllStockList = response.AllNonTrackableProductsLocationModelList;
          } else {
            this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
          }
        });
    
  }
  replaceAll(string, search, replace) {
    return string.split(search).join(replace);
  }
  
  OpenProductDialog() {
    this.IsOpenProductDialog = true;
  }
  selectValue(newValue: any) {
    const obj = {
      value: newValue.ID,
      label: newValue.Product
    };
    this.selectedProduct = obj;
    this.selectedProductID = newValue.ID;
    this.IsOpenProductDialog = false;
    this.getAllStockByLocation(Number(this.selectedProductID), false);
  }
}
