import { PerformaSaleModel } from 'src/app/Helper/models/PerformaSaleModel';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { datefilter } from 'src/app/Helper/datefilter';
import { UpdateStatus } from 'src/app/Helper/models/UpdateStatus';
import { DatePipe } from '@angular/common';


import { Columns } from 'src/app/shared/Model/columns.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model';

import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { OrderPermissionEnum } from 'src/app/shared/constant/order-permission';
import { StorageService } from 'src/app/shared/services/storage.service';
import { SalesPermissionEnum } from 'src/app/shared/constant/sales-permission';



@Component({
  selector: 'app-manage-incoming-order',
  templateUrl: './manage-incoming-order.component.html',
  styleUrls: ['./manage-incoming-order.component.scss'],
  providers: [DatePipe, ConfirmationService, NotificationService]

})
export class ManageIncomingOrderComponent implements OnInit, OnDestroy {

  // @ViewChild('dt') table: Table;
  totalRecords = 0;
  rows = 25;
  first = 0;
  loading = false;
  items: MenuItem[];
  usermodel: UserModel;
  OrderPermission = OrderPermissionEnum;
  SearchByDateDropdown: SelectItem[];
  selectedSearchByDateID = '';

  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');


  PerformaSaleModelList: Array<PerformaSaleModel> = [];
  selectedPerformaSaleModel: PerformaSaleModel;

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Detail', icon: 'fas fa-info', dependedProperty: 'ID' },
    { label: 'Delete', icon: 'fas fa-trash', dependedProperty: 'ID', permission:SalesPermissionEnum.DeleteExternalIncomingOrder,permissionDisplayProperty:'bShowBtn' },
    { label: 'Open to Sale', icon: 'fas fa-shopping-cart', dependedProperty: 'ID',permission:SalesPermissionEnum.AddSaleByExternalIncomingOrder,permissionDisplayProperty:'bShowDeleteBtn' },
    { label: 'View Sale Detail', icon: 'fas fa-info', dependedProperty: 'SaleID' , permissionDisplayProperty:'bShowSaleDetailBtn' },

  ];

  rowGroup: RowGroup = {
    property: 'SaleDate',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };

  columns: Columns[] = [
    { field: 'ID', header: 'Order ID', sorting: 'ID', placeholder: '' ,  translateCol: 'SSGENERIC.ORDERID'},
    { field: 'SaleDate', header: 'Order Date', sorting: 'SaleDate', placeholder: '' ,type:TableColumnEnum.DATE_FORMAT,  translateCol: 'SSGENERIC.ORDERDATE'},
    { field: 'dtDate', header: 'Delivery Date', sorting: 'dtDate', placeholder: '' , type:TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DELIVERYDATE' },
    { field: 'dTotalSaleValue', header: 'Amount', sorting: 'dTotalSaleValue', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.AMOUNT' },
    {
      field: 'Customer', header: 'Company', sorting: 'Customer', searching: true, placeholder: '',
      translateCol: 'SSGENERIC.COMPANY'
    },
    {
      field: 'IsConvertedToSale', header: 'Order Status', sorting: '',  placeholder: '', type: TableColumnEnum.CONVERTED_TO_SALE,
      translateCol: 'SSGENERIC.ORDERSTATUS'
    },
    {
      field: 'ConvertedDate', header: 'Converted Date', sorting: 'ConvertedDate',  placeholder: '',
      translateCol: 'SSGENERIC.CONVERTEDDATE',type:TableColumnEnum.DATE_FORMAT,
    },
    // {
    //   field: 'SaleID', header: 'Invoice No', sorting: 'SaleID', searching: true, placeholder: '', type: TableColumnEnum.REDIRECTION_COLUMN,
    //   translateCol: 'SSGENERIC.INVOICENO'
    // },
  ];

  globalFilterFields = ['SaleDate', 'dTotalSaleValue', 'dtDate'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];

  constructor(
    private datepipe: DatePipe, private route: ActivatedRoute,
    private readonly notificationService: NotificationService, private apiService: vaplongapi,
    private confirmationService: ConfirmationService, public router: Router, private storageService: StorageService) {
    this.totalRecords = this.route.snapshot.data.val;
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View External Incoming Orders`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {

    this.usermodel = this.storageService.getItem('UserModel');

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
    this.GetAllOrderList(this.selectedSearchByDateID);

  }

  ngOnDestroy(): void {
  }

  emitAction(event) {
    if (event.forLabel === 'Detail') {
      this.Detail(event.selectedRowData);
    }
    else if (event.forLabel === 'Delete') {
      this.Remove(event.selectedRowData.ID);
    }
    else if (event.forLabel === 'Open to Sale') {
      this.openSale(event.selectedRowData);
    }
    else if (event.forLabel === 'View Sale Detail') {
      this.SaleDetails(event.selectedRowData);
    }
  }
  SaleDetails(event) {
    this.storageService.setItem('SaleDetailRoute', this.router.url);
    this.router.navigate(['/sale/sale-detail/' + event.SaleID]);
  }
  openSale(event) {
    this.router.navigate([`/sale/add-receipt-by-order/${event.ID}`]);
  }
  onChangeDate(event: any) {
    if (event.value === '7') {
      this.isCustomDate = true;
    }
    else {
      this.GetAllOrderList(this.selectedSearchByDateID);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.GetAllOrderList(7);
    // console.log(this.fromDate);
  }

  GetAllOrderList(dateId) {

    const filterRequestModel = new FilterRequestModel();
    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = 0;
    filterRequestModel.PageSize = 10000;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.IsIncomingOrder = true;
    filterRequestModel.CustomerID = null;

    
    if (dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(Number(dateId));
      filterRequestModel.IsGetAll = daterequest.IsGetAll;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss'));
      filterRequestModel.FromDate = new Date(this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss'));
    }
    else {
      filterRequestModel.IsGetAll = false;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss'));
      filterRequestModel.FromDate = new Date(this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss'));
    }

    // if (ElementsPermission.checkPermission(178))
    // {
    //     request.CustomerID = SessionManagement.userDetails.UserModel.RelatedCustomerID;
    // }

    if (this.usermodel.RelatedCustomerID != null) {
      filterRequestModel.CustomerID = this.usermodel.RelatedCustomerID;
    }
    this.apiService.GetAllIncomingOrderList(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) { 

        this.PerformaSaleModelList = response.AllPerfomaSaleList;
        this.PerformaSaleModelList.forEach(element1 => {
          element1.bShowBtn = (element1.IsConvertedToSale!=null)?!element1.IsConvertedToSale:true;
          element1.bShowDeleteBtn = (element1.IsConvertedToSale!=null)?!element1.IsConvertedToSale:true;
          element1.bShowSaleDetailBtn = (element1.IsConvertedToSale!=null)?element1.IsConvertedToSale:false;

        });
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    });

  }
  Detail(event) {
    this.router.navigate(['/orders/incoming-order-detail/' + event.ID]);

  }

  Remove(id) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete it?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateIncomingOrderStatus(id);
      }

    });
  }
  updateIncomingOrderStatus(id) {
    const request = new UpdateStatus();
    request.ID = id;
    request.Status = false;
    request.UpdatedByUserID = this.usermodel.ID;
    this.apiService.UpdateIncomingOrderStatus(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'order has been updated successfully.');
        this.GetAllOrderList(this.selectedSearchByDateID);
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );

  }
  AddIncomingOrder() {
    this.router.navigate(['/orders/add-incoming-order']);
  }
}

