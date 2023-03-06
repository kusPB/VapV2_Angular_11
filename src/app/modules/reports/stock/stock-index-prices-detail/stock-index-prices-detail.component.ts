import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { datefilter } from '../../../../Helper/datefilter';
import { Stock } from '../../../../Helper/models/Stock';
import { DatePipe } from '@angular/common';
import { GetProductStockHistoryRequest } from 'src/app/Helper/models/GetProductStockHistoryRequest';

import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-stock-index-prices-detail',
  templateUrl: './stock-index-prices-detail.component.html',
  styleUrls: ['./stock-index-prices-detail.component.scss'],
  providers: [DatePipe]

})
export class StockIndexPricesDetailComponent implements OnInit, OnDestroy {
  AllStockList: Stock[] = [];
  selectedStock: Stock;

  SearchByDropdown: SelectItem[];
  SearchByDateDropdown: SelectItem[];
  OutletDropdown: SelectItem[];
  ClassificationDropdown: SelectItem[];
  DepartmentDropdown: SelectItem[];
  CategoryDropdown: SelectItem[];
  SubCategroyDropdown: SelectItem[];
  ProductDropdown: SelectItem[];
  ProductVariantDropdown: SelectItem[];
  selectedSearchByID = '4';
  selectedSearchByDateID = '';
  selectedOutletID : any;
  selectedClassificationID = '';
  selectedDepartmentID = '';
  selectedCategoryID = '';
  selectedSubCategoryID = '';
  selectedProductID = '';
  selectedProductVariantID = '';
  filteredProduct: any[] = [];
  selectedProduct: any;
  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 25;
  // last = 25;
  totalRecords = 0;
  IsClassificationSearch = false;
  IsDepartmentSearch = false;
  IsCategorySearch = false;
  IsSubCategorySearch = false;
  IsProductSearch = true;
  items: MenuItem[];
  imageBasePath;
  imgSrc = '';
  displayImage = false;

  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');

  selectedVariantIDforWishlist: number;
  selectedProductNameforWishlist: string;
  isAddToWishlist = false;
  stockRequestModel: GetProductStockHistoryRequest;
  counter = 1;
  genericMenuItems: GenericMenuItems[] = [   
  ];
  columns: Columns[] = [
    {
      field: 'ProductVariantID', header: 'InvoiceNo', sorting: 'ProductVariantID', placeholder: '', searching: true,
      translateCol: 'SSGENERIC.INVOICENO',type: TableColumnEnum.REDIRECTION_COLUMN,
    },
    // { field: 'Product', header: 'Name', sorting: 'Product', placeholder: '', searching: true, translateCol: 'SSGENERIC.NAME' },
    // { field: 'ProductModel', header: 'Model', sorting: 'ProductModel', placeholder: '', searching: true, translateCol: 'SSGENERIC.MODEL' },
    // { field: 'Barcode', header: 'EAN', sorting: 'Barcode', placeholder: '', searching: true, translateCol: 'SSGENERIC.EAN' },
     { field: 'RemainingStock', header: 'QUANTITY', sorting: 'RemainingStock', placeholder: '', searching: true, translateCol: 'SSGENERIC.QUANTITY' },
    // {
    //   field: 'AvgPurchasePrice', header: 'Avg. Purchase Price', sorting: 'AvgPurchasePrice', placeholder: '',
    //   type: TableColumnEnum.CURRENCY_SYMBOL, searching: true,
    //   translateCol: 'SSGENERIC.AVGPURCHASE'
    // },
    
    {
      field: 'AvgPurchasePrice', header: 'Purchase Price', sorting: 'PurchasePrice', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, searching: true, translateCol: 'SSGENERIC.PURCHASEPRICE'
    },
    {
      field: 'PurchasePrice', header: 'Total', sorting: 'PurchasePrice', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, searching: true, translateCol: 'SSGENERIC.TOTAL'
    },
    {
      field: 'Category', header: 'Purchase Date', sorting: 'PurchasePrice', placeholder: '',
      type: TableColumnEnum.NORMAL, searching: true, translateCol: 'SSGENERIC.PURCHASEDATE'
    }
  ];



  globalFilterFields = ['PurchaseID', 'AvgPurchasePrice', 'Category', 'AvgPurchasePrice'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];

  dataFunc: any = customSearchFn;
  usermodel: any;


  constructor(private apiService: vaplongapi, private storageService: StorageService, public router: Router,private datepipe: DatePipe, private notificationService: NotificationService) {

    this.imageBasePath = this.apiService.imageBasePath;
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Stock Report with Purchased Price Details`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {
    //this.GetSearchByDropDownList();
    this.GetProductDropDownList();
    this.GetSearchByDateDropDownList();
    this.GetOutletDropDownList();
    //this.GetDepartmentDropDownList();
    //this.GetCategoryDropDownList();
    //this.GetClassificationDropDownList();
    //this.GetSubCategoryDropDownList();
    // this.GetAllStock();

    this.stockRequestModel = new GetProductStockHistoryRequest();
    this.stockRequestModel.ProductID = 0;
    this.stockRequestModel.ProductVariantID = 0;
    this.stockRequestModel.OutletID = 1;
    this.stockRequestModel.DepartmentID = -1;
    this.stockRequestModel.CategoryID = -1;
    this.stockRequestModel.SubCategoryID = -1;
    this.stockRequestModel.ClassificationID = -1;
    this.stockRequestModel.IsAllProduct = true;
    this.stockRequestModel.FromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
    this.stockRequestModel.ToDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
    this.stockRequestModel.PageNo = 0;
    this.stockRequestModel.PageSize = 25;
    this.stockRequestModel.IsGetAll = true;
    this.stockRequestModel.Search = '';
  }
  ngOnDestroy(): void { }
  emitAction(event) {
    
  }
  Details(event) {
    this.router.navigate([`/purchase/details/${event.ProductVariantID}`]);
  }
  GetSearchByDropDownList() {
    this.SearchByDropdown = [];

    this.SearchByDropdown.push({ value: '0', label: 'All' });
    this.SearchByDropdown.push({ value: '5', label: 'Classification' });
    this.SearchByDropdown.push({ value: '1', label: 'Department' });
    this.SearchByDropdown.push({ value: '2', label: 'Category' });
    this.SearchByDropdown.push({ value: '3', label: 'Subcategory' });
    this.SearchByDropdown.push({ value: '4', label: 'Product' });
    this.selectedSearchByID = '0';
  }

  GetSearchByDateDropDownList() {

    this.SearchByDateDropdown = [];

    this.SearchByDateDropdown.push({ value: '0', label: 'Today' });
    this.SearchByDateDropdown.push({ value: '1', label: 'Yesterday' });
    this.SearchByDateDropdown.push({ value: '2', label: 'Last7Days' });
    this.SearchByDateDropdown.push({ value: '3', label: 'Last30Days' });
    this.SearchByDateDropdown.push({ value: '4', label: 'ThisMonth' });
    this.SearchByDateDropdown.push({ value: '5', label: 'LastMonth' });
    this.SearchByDateDropdown.push({ value: '6', label: 'All' });
    this.SearchByDateDropdown.push({ value: '7', label: 'Custom' });
    this.selectedSearchByDateID = '6';

  }

  GetOutletDropDownList() {

    this.OutletDropdown = [];
    this.apiService.GetOutletForDropdown().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        for (const item of response.DropDownData) {
          this.OutletDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
        let outlet = response.DropDownData.find(x=>x.ID==1);
        if(!isNullOrUndefined(outlet))
        {
          this.selectedOutletID = outlet.ID;
        }

      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
        // console.log('internal serve Error', response);
      }

    }
    );
  }

  GetClassificationDropDownList() {

    this.ClassificationDropdown = [];
    this.apiService.GetClassificationDropList().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.selectedClassificationID = response.DropDownData[0].ID;
        for (const item of response.DropDownData) {
          this.ClassificationDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }

      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
        // console.log('internal serve Error', response);
      }

    }
    );
  }
  SearchByDate(event: any) {
    if (event.value === '7') {
      this.isCustomDate = true;
    }
  }
  GetDepartmentDropDownList() {

    this.DepartmentDropdown = [];
    this.apiService.GetDepartmentsForDropDown().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.selectedDepartmentID = response.DropDownData[0].ID;
        for (const item of response.DropDownData) {
          this.DepartmentDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }

      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
        // console.log('internal serve Error', response);
      }

    }
    );
  }

  GetCategoryDropDownList() {

    this.CategoryDropdown = [];
    this.apiService.GetCategoryDropDownData().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.selectedCategoryID = response.DropDownData[0].ID;
        for (const item of response.DropDownData) {
          this.CategoryDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }

      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
        // console.log('internal serve Error', response);
      }

    }
    );
  }

  GetSubCategoryDropDownList() {

    this.SubCategroyDropdown = [];
    this.apiService.GetSubCategoriesForDropDown().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.selectedSubCategoryID = response.DropDownData[0].ID;
        for (const item of response.DropDownData) {
          this.SubCategroyDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }

      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
        // console.log('internal serve Error', response);
      }

    }
    );
  }

  GetProductDropDownList() {

    this.ProductDropdown = [];
    this.apiService.GetProductDropDownDatawithVariantInfo().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {

        for (const item of response.DropDownData) {
          this.ProductDropdown.push({
            value: item.ProductID,
            label: item.ProductName,
          });
        }
        this.filteredProduct = this.ProductDropdown;
        if (this.ProductDropdown.length > 0) {
          this.selectedProductID = response.DropDownData[0].ProductID;
          //this.GetProductVariantDropDownList(this.selectedProductID);
        }

      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
        // console.log('internal serve Error', response);
      }

    }
    );
  }

  GetProductVariantDropDownList(productId) {
    const id = {
      ID: productId
    };
    this.ProductVariantDropdown = [];
    this.ProductVariantDropdown.push({ value: '0', label: 'All' });
    this.apiService.GetProductVariantsForDropDown(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.selectedProductVariantID = '0';
        for (const item of response.DropDownData) {
          this.ProductVariantDropdown.push({
            value: item.ProductVariantID,
            label: item.ProducVariantName,
          });
        }
        // this.filteredProduct = this.ProductVariantDropdown
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
        // console.log('internal serve Error', response);
      }

    }
    );
  }
  SaveUpdateLevelDetails() {

  }
  SearchBy(event: any) {

    switch (event.value) {
      case '1':
        this.IsDepartmentSearch = true;
        this.IsCategorySearch = false;
        this.IsClassificationSearch = false;
        this.IsSubCategorySearch = false;
        this.IsProductSearch = false;
        break;
      case '2':
        this.IsCategorySearch = true;
        this.IsDepartmentSearch = false;
        this.IsClassificationSearch = false;
        this.IsSubCategorySearch = false;
        this.IsProductSearch = false;

        break;
      case '3':
        this.IsSubCategorySearch = true;
        this.IsDepartmentSearch = false;
        this.IsCategorySearch = false;
        this.IsClassificationSearch = false;
        this.IsProductSearch = false;
        break;
      case '4':
        this.IsProductSearch = true;
        this.IsDepartmentSearch = false;
        this.IsCategorySearch = false;
        this.IsClassificationSearch = false;
        this.IsSubCategorySearch = false;
        break;
      case '5':
        this.IsClassificationSearch = true;
        this.IsDepartmentSearch = false;
        this.IsCategorySearch = false;
        this.IsProductSearch = false;
        this.IsSubCategorySearch = false;
        break;
      default:
          this.IsClassificationSearch = false;
          this.IsDepartmentSearch = false;
          this.IsCategorySearch = false;
          this.IsProductSearch = false;
          this.IsSubCategorySearch = false;
          break;
    }

  }
  BindProductVariant(event: any) // Bind Product Variant On Onchange event off product dropdownlist
  {
    this.GetProductVariantDropDownList(event.value);
  }

  GetAllStock() {
    switch (this.selectedSearchByID) {
      case '0':
        this.GetAllStockListByFilter(-1, -1, -1, -1, 0, 0, Number(this.selectedOutletID), this.selectedSearchByDateID);

        break;
      case '1':
        this.GetAllStockListByFilter(Number(this.selectedDepartmentID), -1, -1, -1, 0, 0,
          Number(this.selectedOutletID), this.selectedSearchByDateID);
        break;
      case '2':
        this.GetAllStockListByFilter(-1, Number(this.selectedCategoryID), -1, -1, 0, 0,
          Number(this.selectedOutletID), this.selectedSearchByDateID);
        break;
      case '3':
        this.GetAllStockListByFilter(-1, -1, Number(this.selectedSubCategoryID), -1, 0, 0,
          Number(this.selectedOutletID), this.selectedSearchByDateID);
        break;
      // case '4':
      //   this.GetAllStockListByFilter(-1, -1, -1, -1, Number(this.selectedProduct.value),
      //     Number(this.selectedProductVariantID), Number(this.selectedOutletID), this.selectedSearchByDateID);
      //   break;
      case '4':
        this.GetAllStockListByFilter(-1, -1, -1, -1, Number(this.selectedProduct.value),
          0, Number(this.selectedOutletID), this.selectedSearchByDateID);
        break;
      default:
        this.GetAllStockListByFilter(-1, -1, -1, Number(this.selectedClassificationID), 0, 0,
          Number(this.selectedOutletID), this.selectedSearchByDateID);
        break;


    }
  }
  GetAllStockListByFilter(departmentId, CategoryId, subCategoryId, classificationID, productId, variantId, outletId, dateId) {
    let isAllProducts = false;

    if (productId === 0 || productId === '' || this.IsProductSearch === false) {
      isAllProducts = true;
      variantId = 0;
    }
    if (this.selectedOutletID === '0' || this.selectedOutletID === '') {
      outletId = 1;
    }
    

    this.stockRequestModel = new GetProductStockHistoryRequest();
    this.stockRequestModel.ProductID = productId;
    this.stockRequestModel.ProductVariantID = variantId;
    this.stockRequestModel.OutletID = outletId;
    this.stockRequestModel.DepartmentID = departmentId;
    this.stockRequestModel.CategoryID = CategoryId;
    this.stockRequestModel.SubCategoryID = subCategoryId;
    this.stockRequestModel.ClassificationID = classificationID;
    this.stockRequestModel.IsAllProduct = isAllProducts;
    this.stockRequestModel.FromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
    this.stockRequestModel.ToDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
    this.stockRequestModel.PageNo = 0;
    this.stockRequestModel.PageSize = 25;
    this.stockRequestModel.IsGetAll = false;
    this.stockRequestModel.Search = '';

    dateId = Number(dateId);
    if (dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(dateId);
      this.stockRequestModel.IsGetAll = daterequest.IsGetAll;
      this.stockRequestModel.ToDate = this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss');
      this.stockRequestModel.FromDate = this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss');
    }
    else {
      this.stockRequestModel.IsGetAll = false;
      this.stockRequestModel.ToDate = this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss');
      this.stockRequestModel.FromDate = this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss');
    }
    const filterRM = {
      PageNo: 0,
      PageSize: 25,
      Product: ''
    };
    this.GetAllStockDataWithLazyLoadinFunction(filterRM);
  }

  GetAllStockDataWithLazyLoadinFunction(filterRM) {
    if (this.counter==1)
    {
      this.counter++;
      return;
    }
    this.stockRequestModel.PageNo = filterRM.PageNo;
    this.stockRequestModel.PageSize = filterRM.PageSize;
    this.stockRequestModel.Search = filterRM.Product;
    if(isNaN(this.stockRequestModel.OutletID))
    {
      this.stockRequestModel.OutletID=1;
    }
    if (this.stockRequestModel.ClassificationID === -1 && this.stockRequestModel.DepartmentID === -1 &&
      this.stockRequestModel.CategoryID === -1 && this.stockRequestModel.SubCategoryID === -1) {
      const param = {
        ProductID: this.stockRequestModel.ProductID,
        ProductVariantID: this.stockRequestModel.ProductVariantID,
        OutletID: this.stockRequestModel.OutletID,
        DepartmentID: this.stockRequestModel.DepartmentID,
        CategoryID: this.stockRequestModel.CategoryID,
        ClassificationID: this.stockRequestModel.ClassificationID,
        IsAllProduct: this.stockRequestModel.IsAllProduct,
        FromDate: this.stockRequestModel.FromDate,
        ToDate: this.stockRequestModel.ToDate,
        SubCategoryID: 0,
        PageNo: this.stockRequestModel.PageNo,
        PageSize: this.stockRequestModel.PageSize,
        IsGetAll: this.stockRequestModel.IsGetAll,
        Search: this.stockRequestModel.Search,
      };
      this.apiService.GetAllProductStockPurchaseWiseTotalCount(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          this.totalRecords = response.TotalRowCount;
        }
        else {
          this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
          // console.log('internal server error ! not getting api data');
        }
      });

      this.apiService.GetAllProductStockOverallPurchaseWise(param).pipe(untilDestroyed(this)).subscribe((response1: any) => {
        if (response1.ResponseCode === 0) {
          this.AllStockList = response1.AllStockList;
        }
        else {
          this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
          // console.log('internal server error ! not getting api data');
        }
      });

    }
    else {
      const params = {
        ProductID: this.stockRequestModel.ProductID,
        ProductVariantID: this.stockRequestModel.ProductVariantID,
        OutletID: this.stockRequestModel.OutletID,
        DepartmentID: this.stockRequestModel.DepartmentID,
        CategoryID: this.stockRequestModel.CategoryID,
        ClassificationID: this.stockRequestModel.ClassificationID,
        IsAllProduct: this.stockRequestModel.IsAllProduct,
        FromDate: this.stockRequestModel.FromDate,
        ToDate: this.stockRequestModel.ToDate,
        SubCategoryID: this.stockRequestModel.SubCategoryID,
        PageNo: this.stockRequestModel.PageNo,
        PageSize: this.stockRequestModel.PageSize,
        IsGetAll: this.stockRequestModel.IsGetAll,
        Search: this.stockRequestModel.Search,
      };
      
      this.apiService.GetStockReportByCategoryFilters(params).pipe(untilDestroyed(this)).subscribe((response2: any) => {
        
        if (response2.ResponseCode === 0) {
          this.AllStockList = response2.AllStockList;
          this.totalRecords = response2.AllStockList.length;
        }
        else {
          this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
          // console.log('internal server error ! not getting api data');
        }
      });

    }
  }
  AddToWishlist(ProductVariantID: number, Product: string) {
    this.selectedVariantIDforWishlist = ProductVariantID;
    this.selectedProductNameforWishlist = Product;
    this.isAddToWishlist = true;
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    // console.log(this.fromDate);

  }
  CloseDialog(newValue: any) {
    this.isAddToWishlist = false;
    this.selectedVariantIDforWishlist = 0;
    this.selectedProductNameforWishlist = '';
    // console.log(newValue.IsDone);
  }
  Reset() {
    // this.GetAllStockListByFilter(-1,-1,-1,-1,0,0,Number(this.selectedOutletID),this.selectedSearchByDateID);
    this.GetAllStock();
  }

  search(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (const item of this.ProductDropdown) {
      const product = item;

      if (product.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(product);
      }
    }
    this.filteredProduct = filtered;
  }
}
