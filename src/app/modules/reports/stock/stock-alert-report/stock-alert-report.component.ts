import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WishlistModel } from 'src/app/Helper/models/WishlistModel';
import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { Columns } from 'src/app/shared/Model/columns.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { Table } from 'primeng/table';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { DatePipe } from '@angular/common';
import { datefilter } from 'src/app/Helper/datefilter';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { Router } from '@angular/router';
import { ReportPermissionEnum } from 'src/app/shared/constant/report-permission';
import { AddwishlistDialogComponent } from 'src/app/EntryComponents/addwishlist-dialog/addwishlist-dialog.component';

@Component({
  selector: 'app-stock-alert-report',
  templateUrl: './stock-alert-report.component.html',
  styleUrls: ['./stock-alert-report.component.scss'],
  providers: [DatePipe,ConfirmationService]

})
export class StockAlertReportComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  @ViewChild('wishList') wishList: AddwishlistDialogComponent;

  SearchByDateDropdown: SelectItem[];
  SearchByTypeDropdown: SelectItem[];
  SearchByStatusDropdown: SelectItem[];

  selectedSearchByDateID = '';
  isCustomDate = false;
  selectedID: any;
  // rowGroup: RowGroup = {
  //   property: 'Date',
  //   enableRowGroup: true,
  //   propertyType: RowGroupTypeEnum.DATE
  // };
  filterModel = {
    PageNo: 0,
    PageSize: 25,
    Product: '',
  };
  
  genericMenuItems: GenericMenuItems[] = [
    { label: 'Wishlist', icon: 'fas fa-shopping-cart', dependedProperty: 'ProductVariantID', permissionDisplayProperty:'IsAddToWhishlist' }

  ];
  columns: Columns[] = [
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '' , translateCol: 'SSGENERIC.NAME'},
    { field: 'BLabel', header: 'ModelNo', sorting: 'BLabel', placeholder: '' , translateCol: 'SSGENERIC.MODELNO'},
    { field: 'Quantity', header: 'Quantity', sorting: 'Quantity', placeholder: '', translateCol: 'SSGENERIC.QUANTITY' },
    { field: 'Date', header: 'Date', sorting: 'Date', searching: true, placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DATE'}
  ];

  globalFilterFields = ['Product', 'BLabel', 'Quantity','Date'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  IsSpinner: boolean;
  usermodel: any;
  UserDropDownList: any;
  StockAlertData: any = [];
  totalRecords: any = 0;
  fromDate: any = new Date();
  toDate: any = new Date();
  dateId: number;
  typeId: number;
  statusId: number;

  selectedVariantIDforWishlist: number;
  selectedProductNameforWishlist: string;
  isAddToWishlist = false;
  constructor(
    private apiService: vaplongapi, private notificationService: NotificationService,public router: Router,private confirmationService: ConfirmationService,
    private datepipe: DatePipe, private storageService: StorageService) {
    this.usermodel = this.storageService.getItem('UserModel');

    const obj = {
        Action: 'View',
        Description: 'View Stock Alert Report',
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }
  ngOnDestroy(): void {
  }
  SearchByDate(event: any) {
    if (event.value === 7) {
      this.isCustomDate = true;
    }
    else {
      this.dateId = Number(this.dateId);
      this.GetAllDataWithLazyLoadinFunction(this.filterModel);
    }
  }
 

  ngOnInit(): void {
    
    this.GetSearchByDateDropDownList();
  }
  emitAction(event) {
    if (event.forLabel === 'Wishlist') {
      this.AddToWishlist(event.selectedRowData.ProductVariantID, event.selectedRowData.Product);
    }

  }

  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.dateId = 7;
    this.GetAllDataWithLazyLoadinFunction(this.filterModel);
  }

  GetSearchByDateDropDownList() {

    this.SearchByDateDropdown = [];

    this.SearchByDateDropdown.push({ value: 0, label: 'Today' });
    this.SearchByDateDropdown.push({ value: 1, label: 'Yesterday' });
    this.SearchByDateDropdown.push({ value: 2, label: 'Last7Days' });
    this.SearchByDateDropdown.push({ value: 3, label: 'Last30Days' });
    this.SearchByDateDropdown.push({ value: 4, label: 'ThisMonth' });
    this.SearchByDateDropdown.push({ value: 5, label: 'LastMonth' });
    this.SearchByDateDropdown.push({ value: 7, label: 'Custom' });
    this.dateId = 0;
  }
 
  GetAllDataWithLazyLoadinFunction(filterRM) {
  
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;

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
    this.apiService.GetStockAlertReportByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        debugger;
        this.StockAlertData = response1.AllStockAlertList;
        this.totalRecords = response1.TotalCount;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    });
  }
  AddToWishlist(ProductVariantID: number, Product: string) {
    this.selectedVariantIDforWishlist = ProductVariantID;
    this.selectedProductNameforWishlist = Product;
    this.isAddToWishlist = true;
  }
  CloseDialog(newValue: any) {
    this.isAddToWishlist = false;
    this.selectedVariantIDforWishlist = 0;
    this.selectedProductNameforWishlist = '';
    this.wishList.clearData();
  }
  close() {
    this.selectedVariantIDforWishlist = -1;
    this.selectedProductNameforWishlist = '';
    this.wishList.clearData();
  }
}
