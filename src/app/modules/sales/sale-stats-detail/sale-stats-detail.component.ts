import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';


import { Columns } from 'src/app/shared/Model/columns.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { StorageService } from 'src/app/shared/services/storage.service';
import { DatePipe } from '@angular/common';
import { datefilter } from 'src/app/Helper/datefilter';
import { WishlistModel } from 'src/app/Helper/models/WishlistModel';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';


@Component({
  selector: 'app-sale-stats-detail',
  templateUrl: './sale-stats-detail.component.html',
  styleUrls: ['./sale-stats-detail.component.scss'],
  providers: [DatePipe],

})
export class SaleStatsDetailComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  AllSaleStatList: WishlistModel[]=[];
  selectedSaleStat: WishlistModel;
  public SaleStat: WishlistModel;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedProductID = '';
  Quantity;
  Remarks;
  selectedFilter = 1;
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
  Type = 1;
  usermodel: UserModel;
  displayDialog = false;
  DialogRemarks = '';
  dateId = 0;
  isCustomDate = false;

  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  SearchByDateDropdown: SelectItem[];
  selectedSearchByDateID = '';
  genericMenuItems: GenericMenuItems[] = [
   
  ];

  rowGroup: RowGroup = {
    property: 'SaleDate',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.STRING
  };
  columns: Columns[] = [
    { field: 'SaleDate', header: 'Date', sorting: 'SaleDate', placeholder: '', translateCol: 'SSGENERIC.DATE',type: TableColumnEnum.DATE_ONLY },
    { field: 'TotalSaleIncludedTax', header: 'Sales(Inc Tax)', sorting: 'TotalSaleIncludedTax', placeholder: '', translateCol: 'SALESTATS.SALES(INC.TAX)' ,type: TableColumnEnum.CURRENCY_SYMBOL},
    { field: 'TotalSaleExcludedTax', header: 'Sales(Ex Tax)', sorting: 'TotalSaleExcludedTax', placeholder: '' , translateCol: 'SALESTATS.SALES(EX.TAX)',type: TableColumnEnum.CURRENCY_SYMBOL},
    { field: 'TotalRefunds', header: 'Refunds', sorting: 'TotalRefunds', placeholder: '', translateCol: 'SALESTATS.REFUND',type: TableColumnEnum.CURRENCY_SYMBOL },
    { field: 'COGS_Refund', header: 'Refunds(COGS)', sorting: 'COGS_Refund', placeholder: '', translateCol: 'SALESTATS.REFUND(COGS)',type: TableColumnEnum.CURRENCY_SYMBOL },
    { field: 'TotalTax_Sale', header: 'Sales(Tax)', sorting: 'TotalTax_Sale', placeholder: '' , translateCol: 'SALESTATS.SALES(TAX)',type: TableColumnEnum.CURRENCY_SYMBOL},
    { field: 'TotalTax_Refund', header: 'Refund', sorting: 'TotalTax_Refund', placeholder: '',  translateCol: 'SALESTATS.REFUND(TAX)',type: TableColumnEnum.CURRENCY_SYMBOL },
    { field: 'COGS', header: 'COGS', sorting: 'COGS', placeholder: '',  translateCol: 'SALESTATS.COGS',type: TableColumnEnum.CURRENCY_SYMBOL },
    { field: 'GrossProfit', header: 'GrossProfit', sorting: 'GrossProfit', placeholder: '',  translateCol: 'SALESTATS.GROSSPROFIT',type: TableColumnEnum.CURRENCY_SYMBOL },

  ];

  globalFilterFields = ['SaleDate', 'TotalSaleIncludedTax','COGS', 'GrossProfit','TotalSaleExcludedTax', 'TotalRefunds', 'COGS_Refund', 'TotalTax_Sale', 'TotalTax_Refund'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];


  constructor(private apiService: vaplongapi, private storageService: StorageService,private datepipe: DatePipe) {
    this.usermodel = this.storageService.getItem('UserModel');

    const obj = {
      Action: 'View',
      Description: `View Sale Stats Report`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {
    this.GetSearchByDateDropDownList();
    this.GetAllSaleStatsReport(this.dateId,this.Type); // Get All Internal Order List On Page Load
  }
  ngOnDestroy(): void {

  }
  
  GetSearchByDateDropDownList() {

    this.SearchByDateDropdown = [];

    this.SearchByDateDropdown.push({ value: '0', label: 'Today' });
    this.SearchByDateDropdown.push({ value: '1', label: 'Yesterday' });
    this.SearchByDateDropdown.push({ value: '2', label: 'Last7Days' });
    this.SearchByDateDropdown.push({ value: '3', label: 'Last30Days' });
    this.SearchByDateDropdown.push({ value: '4', label: 'ThisMonth' });
    this.SearchByDateDropdown.push({ value: '5', label: 'LastMonth' });
    this.SearchByDateDropdown.push({ value: '7', label: 'Custom' });
    this.selectedSearchByDateID = '0';

  }
  SearchByDate(event: any) {
    if (event.value === '7') {
      this.isCustomDate = true;
    }
    else {
      this.dateId = Number(this.selectedSearchByDateID);
      this.GetAllSaleStatsReport(this.selectedSearchByDateID,this.Type);
    }
  }
 
  onChangeDate(event: any) {
    if (event.value === '7') {
      this.isCustomDate = true;
    }
    else {
      this.dateId = Number(event.value);
    this.GetAllSaleStatsReport(event.value,this.Type);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.dateId = 7;
    this.GetAllSaleStatsReport(7,this.Type);
  }
  GetAllSaleStatsReport(dateId,Type) // Get All Internal Method Get Data from Service
  {
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.PageNo = 0;
    filterRequestModel.PageSize = 1000000;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.PermissionLevel = 1;
    filterRequestModel.Type = Type;
   
    dateId=Number(dateId);
    if (dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(dateId);
      filterRequestModel.IsGetAll = daterequest.IsGetAll;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss'));
      filterRequestModel.FromDate = new Date(this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss'));
    }
    else {
      
      filterRequestModel.IsGetAll = false;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss'));
      filterRequestModel.FromDate = new Date(this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss'));
    }
    
    this.apiService.GetSaleDashboardReportNewByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      
      if (response.ResponseCode === 0) {
        this.AllSaleStatList = response.SaleStats; 
        this.totalRecords = this.AllSaleStatList.length;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    });
  }
  

  filterReport() {
    if (Number(this.selectedFilter) === 1) {
      this.Type = 1;
      this.GetAllSaleStatsReport(this.dateId,this.Type);
    }
    else if (Number(this.selectedFilter) === 2) {
      this.Type = 2;
      this.GetAllSaleStatsReport(this.dateId,this.Type);
    }
    else {
      this.Type = 3;
      this.GetAllSaleStatsReport(this.dateId,this.Type);
    }
  }

  
}


