import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { WishlistModel } from 'src/app/Helper/models/WishlistModel';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';


import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { isNullOrUndefined } from 'util';
import { DatePipe } from '@angular/common';
import { datefilter } from 'src/app/Helper/datefilter';


@Component({
  selector: 'app-customer-life-line-report',
  templateUrl: './customer-life-line-report.component.html',
  styleUrls: ['./customer-life-line-report.component.scss'],
  providers: [DatePipe]
})

export class CustomerLifeLineReportComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  AllInternalOrderList: WishlistModel[] = [];
  selectedInternalOrder: WishlistModel;
  public internalOrder: WishlistModel;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedProductID = '';
  Products: any[];
  filteredCustomer: any[];
  selectedProduct: any;
  Quantity;
  Remarks;
  items: MenuItem[];
  ProductDropdown: SelectItem[];
  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 25;
  // last = 25;
  totalRecords = 0;
  openInvoicesTotalRecords = 0;
  saleTotalRecords = 0;
  filterModel = {
    PageNo: 0,
    PageSize: 25,
    Product: '',
  };
  usermodel: UserModel;
  displayDialog = false;
  DialogRemarks = '';

  customerColumns: Columns[] = [
    // { field: 'IsActiveForCustomer', header: 'Status', sorting: '', placeholder: '',type: TableColumnEnum.TOGGLE_BUTTON },
    { field: 'CustomerID', header: 'ID', sorting: 'CustomerID', placeholder: '', translateCol: 'SSGENERIC.ID' },
    { field: 'sCompanyName', header: 'Company', sorting: 'sCompanyName', placeholder: '', translateCol: 'SSGENERIC.COMPANY' },
    {
      field: 'FirstName', secondfield: 'LastName', header: 'Customer', sorting: 'FirstName', placeholder: '',
      type: TableColumnEnum.COMBINED_COLUMN, translateCol: 'SSGENERIC.CUSTOMER'
    },
    {
      field: 'Address', secondfield: 'City', header: 'Address', sorting: 'FirstName', placeholder: '',
      type: TableColumnEnum.COMBINED_COLUMN, translateCol: 'SSGENERIC.ADDRESS'
    },
    { field: 'EmailAddress', header: 'Email', sorting: 'EmailAddress', placeholder: '', translateCol: 'SSGENERIC.EMAIL' },
    {
      field: 'CurrentBalance', header: 'Current Balance', sorting: 'CurrentBalance', placeholder: '',
      type: TableColumnEnum.BALANCE_COLUMN, translateCol: 'SSGENERIC.CURRENTB'
    },
  ];

  globalFilterFields = ['sCompanyName', 'FirstName', 'LastName', 'Address', 'City', 'CurrentBalance'];
  
  rowGroup: RowGroup = {
    property: 'dtDate',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  saleColumn: Columns[] = [
    {
      field: 'SaleInvoiceNo', header: 'Invoice No', sorting: 'SaleInvoiceNo', placeholder: '',
      type: TableColumnEnum.REDIRECTION_COLUMN, translateCol: 'SSGENERIC.INVOICENO'
    },
    {
      field: 'dtDate', header: 'Date', sorting: 'dtDate', placeholder: '', type: TableColumnEnum.DATE_FORMAT,
      translateCol: 'SSGENERIC.DATE'
    },
    {
      field: 'dTotalSaleValue', header: 'Invoice Amount', sorting: 'dTotalSaleValue', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.INVOICEAMOUNT'
    },
    {
      field: 'dTotalPaidValue', header: 'Paid Amount', sorting: 'dTotalPaidValue', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.PAIDAMOUNT'
    },
  ];
  saleGlobalFilterFields = ['SaleInvoiceNo', 'dtDate', 'dTotalSaleValue', 'dTotalPaidValue'];

  topProductColumn: Columns[] = [
    { field: 'SKU', header: 'SKU', sorting: 'SKU', placeholder: '', translateCol: 'SSGENERIC.SKU' },
    { field: 'Product', header: 'Name', sorting: 'Product', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Quantity', header: 'Quantity', sorting: 'Quantity', placeholder: '', translateCol: 'SSGENERIC.QUANTITY' },
  ];
  topProductGlobalFilterFields = ['SKU', 'Product', 'Quantity'];
  rowGroup1: RowGroup = {
    property: 'DueDate',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  openPaymentColumn: Columns[] = [
    // type: TableColumnEnum.REDIRECTION_COLUMN,
    {
      field: 'CustomerInvoiceNo', header: 'Invoice No', sorting: 'CustomerInvoiceNo', placeholder: '',
      translateCol: 'SSGENERIC.INVOICENO'
    },
    { field: 'DueDate', header: 'Due Date', sorting: 'DueDate', placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DUEDATE' },
    { field: 'dTotalAmount', header: 'Total', sorting: 'dTotalAmount', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.TOTAL' },
    { field: 'dPaidAmount', header: 'Paid', sorting: 'dPaidAmount', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.PAID' },
    {
      field: 'dRemainingAmount', header: 'Remaining', sorting: 'dRemainingAmount', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.REMAINING'
    },
  ];
  openPaymentGlobalFilterFields = ['CustomerInvoiceNo', 'DueDate', 'dTotalAmount', 'dPaidAmount', 'dRemainingAmount'];

  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000]

  rowGroup2: RowGroup = {
    property: 'PerformedAt',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  activityColumns: Columns[] = [
    { field: 'Action', header: 'Action', sorting: 'Action', placeholder: '' , translateCol: 'SSGENERIC.ACTION'},
    { field: 'PerformedAt', header: 'Activity Date', sorting: 'PerformedAt', placeholder: '', type: TableColumnEnum.DATE_FORMAT , translateCol: 'SSGENERIC.ACTIVITYDATE'},
    { field: 'User', header: 'User', sorting: 'User', placeholder: '', translateCol: 'SSGENERIC.USER' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' }
  ];
  activityGlobalFilterFields = ['Action', 'PerformedAt', 'User', 'Description'];
  allActivity: any=[];
  activityTotalRecords: any = 0;

  dataFunc: any = customSearchFn;
  ProductData: any = [];
  displayCustomerDialog = false;
  productHistory: any = {};
  Purchases: any = [];
  Sales: any = [];
  customerDropdown: any[];
  AllCustomersList: any[] = [];
  selectedCustomer: { value: any; label: any; };
  lifeLineCustomer: any = {};
  orderCount: any;
  bestOrder: any;
  openPayments: any[] = [];
  TopProducts: any[] = [];
  lastOrderOn: any;
  selectedShippingMethod: any = {};
  isFirstTime = true;
  genericMenuItems: GenericMenuItems[] = [];

  constructor(private apiService: vaplongapi, public router: Router,private datepipe: DatePipe, private storageService: StorageService) {
          this.storageService.setItem('SaleDetailRoute', this.router.url);
          this.usermodel = this.storageService.getItem('UserModel');
          const obj = {
            Action: 'View',
            Description: `View Customer Lifeline Report`,
            PerformedAt: new Date().toISOString(),
            UserID: this.usermodel.ID
        }
        this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {

    this.usermodel = this.storageService.getItem('UserModel');;
    this.GetCustomersDropDownLists(); // Get All ProductVariant List On Page Load for Dropdown
  }

  GetCustomerDetailHistoryReport() {
    const obj = {
      ID: this.selectedCustomer.value
    }
    this.apiService.GetCustomerDetailHistoryReportDetailsOnly(obj).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.lifeLineCustomer = response.Customer;
        this.orderCount = response.OrderCount;
        this.bestOrder = response.BestOrder;
        this.lastOrderOn = response.LastOrderOn;
        //this.openPayments = response.AllCustomerOpenInvoices;
        //this.Sales = response.Sales;
        this.TopProducts = response.TopProducts;
        
        this.GetshippingMethodByID(this.lifeLineCustomer.ShippingMethodID);
      }

    });
  }

  GetAllOpenInvoicesDataWithLazyLoadinFunction(filterRM) {
    if (this.isFirstTime) { return; }
    const filterRequestModel = new FilterRequestModel();  
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.ID = this.selectedCustomer.value;
    this.storageService.setItem('SingleCustomerLifeLineOpenInvoicesValues', filterRequestModel);

    this.apiService.GetCustomerDetailHistoryReportOpenInvoicesOnly(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
         this.openPayments = response1.AllCustomerOpenInvoices;
        this.openInvoicesTotalRecords = response1.OrderCount;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    });
  }

  GetAllSaleDataWithLazyLoadinFunction(filterRM) {

    if (this.isFirstTime) { return; }
    const filterRequestModel = new FilterRequestModel();  
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.ID = this.selectedCustomer.value;
    this.storageService.setItem('SingleCustomerLifeLineSaleValues', filterRequestModel);

    this.apiService.GetCustomerDetailHistoryReportSalesOnly(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
         this.Sales = response1.Sales;
        this.saleTotalRecords = response1.OrderCount;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    });
  }

  GetshippingMethodByID(id) {
    if (isNullOrUndefined(id)) { return;}
    const obj = {
      ID: id
    };
    this.apiService.GetshippingMethodByID(obj).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.selectedShippingMethod = response.ShippingMethodModel;
      }
    });
  }
 

  getSalesByInvoiceNo(event) {
    this.storageService.setItem('SingleCustomerLifeLineRedirect', true);
    this.router.navigate([`/sale/sale-detail/${event.ID}`]);
  }
  ngOnDestroy(): void {

  }

  GetCustomersDropDownLists() {
    this.customerDropdown = [];
    this.apiService.GetAllCustomer().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        for (const item of response.AllCustomerList) {
          this.customerDropdown.push({
            value: item.CustomerID,
            label: item.sCompanyName,
          });
        }
       
        this.filteredCustomer = this.customerDropdown;
        this.AllCustomersList = response.AllCustomerList;
        this.totalRecords = response.AllCustomerList.length;

        let Redirection = this.storageService.getItem('SingleCustomerLifeLineRedirect') ;
        if (Redirection) {
          this.storageService.removeItem('SingleCustomerLifeLineRedirect');
          this.isFirstTime = false;

          let filtervalues = this.storageService.getItem('SingleCustomerLifeLineOpenInvoicesValues');

          let customerValues = this.filteredCustomer.filter(x => x.value == filtervalues.ID)[0];
          this.selectedCustomer =  {
           value: customerValues.value,
           label: customerValues.label          
         }

          this.GetCustomerDetailHistoryReport();
          this.filterModel.PageNo = filtervalues.PageNo;
          this.filterModel.PageSize = filtervalues.PageSize;
          this.GetAllOpenInvoicesDataWithLazyLoadinFunction(this.filterModel);

          
          let filtervalues1 = this.storageService.getItem('SingleCustomerLifeLineSaleValues');
          this.filterModel.PageNo = filtervalues1.PageNo;
          this.filterModel.PageSize = filtervalues1.PageSize;
          this.GetAllSaleDataWithLazyLoadinFunction(this.filterModel);
          
        }

      } else {
        console.log('internal serve Error', response);
      }
    });
  }
 GetAllActivityDataWithLazyLoadinFunction(filterRM) {
    if (this.isFirstTime) { return; }
    const filterRequestModel = new FilterRequestModel();
    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = true;
    filterRequestModel.IsReceived = true;
    filterRequestModel.Type = 2;
    filterRequestModel.ID = this.selectedCustomer.value
    filterRequestModel.Product = filterRM.Product;
    filterRequestModel.UserID = 0;
    
    this.apiService.GetAllActivityByFilterForLifeLineReports(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        this.allActivity = response1.GetAllActivityLogs;
        this.activityTotalRecords = response1.TotalRecords;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    });
  }

  OpenOrderByDialog() {
    this.displayCustomerDialog = true;
  }
  selectValue(newValue: any) {
    if (newValue != null) {
      this.selectedCustomer = {
        value: newValue.value ? newValue.value : newValue.CustomerID,
        label: newValue.label ? newValue.label : newValue.sCompanyName,
      };
      this.GetCustomerDetailHistoryReport();
      
    this.isFirstTime = false;
    this.GetAllOpenInvoicesDataWithLazyLoadinFunction(this.filterModel);
    this.GetAllSaleDataWithLazyLoadinFunction(this.filterModel);
    this.GetAllActivityDataWithLazyLoadinFunction(this.filterModel);
      this.displayCustomerDialog = false;

    }
  }
}

