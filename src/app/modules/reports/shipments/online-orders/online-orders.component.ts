import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { datefilter } from 'src/app/Helper/datefilter';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';


import { Columns } from 'src/app/shared/Model/columns.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model';

import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { SalesPermissionEnum } from 'src/app/shared/constant/sales-permission';
import { StorageService } from 'src/app/shared/services/storage.service';

declare let require: any;
const FileSaver = require('file-saver');

@Component({
  selector: 'app-online-orders',
  templateUrl: './online-orders.component.html',
  styleUrls: ['./online-orders.component.scss'],
  providers: [DatePipe, ConfirmationService]



})
export class OnlineOrdersComponent implements OnInit, OnDestroy {

  AllOrderList: any[] = [];
  selectedOrder;
  SalesPermissionEnum: SalesPermissionEnum;
  SearchByDateDropdown: SelectItem[];
  selectedSearchByDateID = '';
  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 25;
  // last = 25;
  totalRecords = 0;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  items: MenuItem[];

  dateId = 6;
  filterModel = {
    PageNo: 0,
    PageSize: 25,
    Product: '',
  };

  rowGroup: RowGroup = {
    property: 'SaleDate',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  genericMenuItems: GenericMenuItems[] = [
    { label: 'View Order', icon: 'fas fa-info', dependedProperty: 'SaleID' },
    { label: 'PDF invoice', icon: 'fas fa-print', dependedProperty: 'InvoiceUrl' },
    { label: 'Packing Slip', icon: 'fas fa-download', dependedProperty: 'SlipUrl' },
  ];
  columns: Columns[] = [
    { field: 'SaleID', header: 'Invoice Nr. ', sorting: 'SaleID', placeholder: '', translateCol: 'SSGENERIC.INVOICENR' , type: TableColumnEnum.REDIRECTION_COLUMN},
    { field: 'ShopOrderID', header: 'Order ID.', sorting: 'ShopOrderID', placeholder: '', translateCol: 'SSGENERIC.ORDERID' },
    { field: 'CustomerName', header: 'Customer', sorting: 'CustomerName', placeholder: '', translateCol: 'SSGENERIC.CUSTOMER' },
    { field: 'DeliveryStatus', header: 'Status', sorting: 'DeliveryStatus', placeholder: '', translateCol: 'SSGENERIC.STATUS' },
    {
      field: 'TotalOrderAmount', header: 'Total', sorting: 'TotalOrderAmount', placeholder: '', permission:SalesPermissionEnum.TotalAmountColumn,
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.TOTAL'
    },
    { field: 'SaleDate', header: 'Date Added', sorting: 'SaleDate', placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DATEADD' },
    //  {
    //    field: 'DeliveryDate', header: 'Date Modified', sorting: 'DeliveryDate', placeholder: '',
    //    type: TableColumnEnum.DATE_FORMAT,  translateCol: 'SSGENERIC.DATEMOD'
    //  },

  ];

  globalFilterFields = ['SaleID', 'ShopOrderID', 'CustomerName', 'DeliveryStatus', 'TotalOrderAmount', 'SaleDate', 'DeliveryDate'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  usermodel: any;


  constructor(
    private apiService: vaplongapi, private datepipe: DatePipe, public router: Router,
    private notificationService: NotificationService,private storageService: StorageService) {
      this.usermodel = this.storageService.getItem('UserModel');
      this.storageService.setItem('OnlineSaleDetailRoute', this.router.url);

      const obj = {
        Action: 'View',
        Description: `View Online Orders`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then(x => { }); 
  }

  ngOnInit(): void {
    this.GetSearchByDateDropDownList();
    //this.GetAllOnlineOrderByFilter(this.selectedSearchByDateID);

  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    if (event.forLabel === 'View Order') {
      this.Details(event.selectedRowData);
    }
    else if (event.forLabel === 'PDF invoice') {
      this.PrintPDF(event.selectedRowData.InvoiceUrl);
    }
    else if (event.forLabel === 'Packing Slip') {
      this.PrintPackingSlip(event.selectedRowData.SlipUrl);
    }
  }
  Details(event) {
    this.router.navigate(['/sale/online-order-detail/' + event.SaleID]);
  }
  PrintPDF(fileURL) {
    const fileName = 'invoiceslip.pdf';
    FileSaver.saveAs(fileURL, fileName);

  }
  PrintPackingSlip(fileURL) {
    const fileName = 'pakingslip.pdf';
    FileSaver.saveAs(fileURL, fileName);

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
  SearchByDate(event: any) {

    if (event.value === '7') {
      this.isCustomDate = true;
    }
    else {
      this.dateId = Number(this.selectedSearchByDateID);
      this.GetAllOrderDataWithLazyLoadinFunction(this.filterModel);
      //this.GetAllOnlineOrderByFilter(this.selectedSearchByDateID);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    //this.GetAllOnlineOrderByFilter(7);
    this.dateId = 7;
    this.GetAllOrderDataWithLazyLoadinFunction(this.filterModel);

  }
  
  GetAllOrderDataWithLazyLoadinFunction(filterRM) {

    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.IsReceived = true;
    filterRequestModel.Product = filterRM.Product;

    if (this.dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(this.dateId);
      filterRequestModel.IsGetAll = daterequest.IsGetAll;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss'));
      filterRequestModel.FromDate = new Date(this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss'));
    }
    else {
      filterRequestModel.IsGetAll = false;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss'));
      filterRequestModel.FromDate = new Date(this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss'));
    }
    this.apiService.GetOnlineCustomerDetailTotalCount(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.totalRecords = response.TotalRowCount;
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.responseText);
      }
    },
    );
    this.apiService.GetOnlineCustomerDetail(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        this.AllOrderList = response1.OnlineCustomerDetails;
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response1.responseText);
      }
    },
    );
  }
  GetAllOnlineOrderByFilter(dateId) {

    const request = new FilterRequestModel();
    request.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    request.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    request.PageNo = 0,
    request.PageSize = 10000;
    
    dateId=Number(dateId);
    if (dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(dateId);
      request.IsGetAll = daterequest.IsGetAll;
      request.ToDate = new Date(this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss'));
      request.FromDate = new Date(this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss'));
    }
    else {
      request.IsGetAll = false;
      request.ToDate = new Date(this.toDate);
      request.FromDate = new Date(this.fromDate);
    }


    this.apiService.GetOnlineCustomerDetail(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.AllOrderList = response.OnlineCustomerDetails;
        this.totalRecords = response.OnlineCustomerDetails.length;
      } else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
      }
    });

  }
}
