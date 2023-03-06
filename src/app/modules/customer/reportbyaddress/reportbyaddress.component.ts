import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';

import { DatePipe } from '@angular/common';
import { vaplongapi } from '../../../Service/vaplongapi.service';
import { FilterRequestModel } from '../../../Helper/models/FilterRequestModel';
import { datefilter } from '../../../Helper/datefilter';

import { Columns } from 'src/app/shared/Model/columns.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-reportbyaddress',
  templateUrl: './reportbyaddress.component.html',
  styleUrls: ['./reportbyaddress.component.scss'],
  providers: [DatePipe]
})
export class ReportbyaddressComponent implements OnInit, OnDestroy {

  AllCustomerList: any[] = [];
  selectedCustomer: any;
  AllOriginalCustomerList: any[] = [];

  SearchByDateDropdown: SelectItem[];
  CustomerDropdown: SelectItem[];
  AddressDropdown: SelectItem[];
  report: any[];
  listData: any[];
  selectedSearchByDateID = '';
  selectedCustomerID = '';
  selectedAddressID = '';

  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 25;
  // last = 25;
  totalRecords = 0;
  items: MenuItem[];

  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  txtPreviousBalance = 0;
  txtCurrentBalance = 0;
  txtAddress = '';

  rowGroup: RowGroup = {
    property: 'Date',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  genericMenuItems: GenericMenuItems[] = [];
  columns: Columns[] = [
    { field: 'sNarration', header: 'Description', sorting: 'sNarration', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION'},
    { field: 'TotalCredit', header: 'Credit', sorting: 'TotalCredit', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.CREDIT' },
    { field: 'TotalDebit', header: 'Debit', sorting: 'TotalDebit', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.DEBIT' },
    { field: 'Date', header: 'Date', sorting: 'Date', placeholder: '' , type: TableColumnEnum.DATE_FORMAT ,translateCol: 'SSGENERIC.DATE'},
  ];

  globalFilterFields = ['sNarration', 'TotalCredit', 'TotalDebit', 'dtDate'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  usermodel: any;

  constructor(private apiService: vaplongapi, private storageService: StorageService, private datepipe: DatePipe) {
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Customer Ledger by Address`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { }); 
  }

  ngOnInit(): void {
    this.GetCustomerDropDownList();
    this.GetSearchByDateDropDownList();

  }
  ngOnDestroy(): void { }
  emitAction(event) {
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

  GetCustomerDropDownList() {

    this.CustomerDropdown = [];
    this.apiService.GetCustomerForDropdown().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.selectedCustomerID = response.DropDownData[0].ID;
        for (const item of response.DropDownData) {
          this.CustomerDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
        this.getCustomerReportThroughAddress(6);
      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
  }
  onChangeCustomer(event: any) {
    this.txtAddress = '';
    this.getCustomerReportThroughAddress(this.selectedSearchByDateID);
  }
  onChangeDate(event: any) {
    this.getCustomerReportThroughAddress(event.value);
  }
  onChangeAddress(event: any) {
    this.txtAddress = event.value;
    this.report = this.AllOriginalCustomerList.filter(x => x.Address === event.value);
    if (this.report != null) {
      this.listData = [];
      this.report.forEach(element1 => {
        this.listData.push(...element1.CustomerSaleDetails);
      });
      this.AllCustomerList =[];
      this.AllCustomerList = this.listData;
      this.totalRecords = this.listData.length;
    }

  }


  SearchByDate(event: any) {
    if (event.value === '7') {
      this.isCustomDate = true;
    }
    else {
      this.getCustomerReportThroughAddress(this.selectedSearchByDateID);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.getCustomerReportThroughAddress(7);
    // console.log(this.fromDate);
  }

  getCustomerReportThroughAddress(dateId) {
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.ID = Number(this.selectedCustomerID === '' ? this.CustomerDropdown[0].value : this.selectedCustomerID);
    filterRequestModel.IsGetAll = false;

    dateId = Number(dateId);
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
    this.apiService.GetCustomerReportByAddressFilter(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.AllOriginalCustomerList = response.CustomerSaleDetailByAddreses;

        this.txtPreviousBalance = response.PreviousBalance;
        this.txtCurrentBalance = response.CurrentBalance;

        

        if (response.CustomerSaleDetailByAddreses.length > 0) {
          this.txtAddress = response.CustomerSaleDetailByAddreses[0].Address;
          this.selectedAddressID = response.CustomerSaleDetailByAddreses[0].Address;
          this.AddressDropdown = [];

          for (const item of this.AllOriginalCustomerList) {
            this.AddressDropdown.push({
              value: item.Address,
              label: item.Address,
            });
          }
        }
        else
        {
          this.AddressDropdown = [];
          this.txtAddress = '';
          this.selectedAddressID = '';

        }

        this.listData = [];
        response.CustomerSaleDetailByAddreses.forEach(element1 => {
          this.listData.push(element1.CustomerSaleDetails);
        });
        this.AllCustomerList = [];
        if (this.listData.length > 0) {
          this.AllCustomerList = this.listData[0];
          this.totalRecords = this.listData[0].length;

        }
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    },
    );


  }


}

