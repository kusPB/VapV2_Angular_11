import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WishlistModel } from 'src/app/Helper/models/WishlistModel';
import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { NotificationService } from '../../shell/services/notification.service';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { Columns } from 'src/app/shared/Model/columns.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { Table } from 'primeng/table';
import { SelectItem } from 'primeng/api';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { DatePipe } from '@angular/common';
import { datefilter } from 'src/app/Helper/datefilter';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  providers: [DatePipe]

})
export class ActivityComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  SearchByDateDropdown: SelectItem[];
  selectedSearchByDateID = '';
  isCustomDate = false;
  selectedID: any;
  rowGroup: RowGroup = {
    property: 'PerformedAt',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  filterModel = {
    PageNo: 0,
    PageSize: 25,
    Product: '',
  };
  columns: Columns[] = [
    { field: 'Action', header: 'Action', sorting: 'Action', placeholder: '' , translateCol: 'SSGENERIC.ACTION'},
    { field: 'PerformedAt', header: 'Activity Date', sorting: 'PerformedAt', placeholder: '', type: TableColumnEnum.DATE_FORMAT , translateCol: 'SSGENERIC.ACTIVITYDATE'},
    { field: 'User', header: 'User', sorting: 'User', placeholder: '', translateCol: 'SSGENERIC.USER' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' }
  ];

  globalFilterFields = ['Action', 'PerformedAt', 'User', 'Description'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  IsSpinner: boolean;
  usermodel: any;
  UserDropDownList: any;
  allActivity: any = [];
  totalRecords: any = 0;
  fromDate: any = new Date();
  toDate: any = new Date();
  dateId: number;
  genericMenuItems: GenericMenuItems[] = [];
  constructor(
    private apiService: vaplongapi, private notificationService: NotificationService,
    private datepipe: DatePipe, private storageService: StorageService) {
      this.usermodel = this.storageService.getItem('UserModel');
      const obj = {
        Action: 'View',
        Description: `View Activity Report`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }
  ngOnDestroy(): void {
  }
  SearchByDate(event: any) {
    if (event.value === '7') {
      this.isCustomDate = true;
    }
    else {

      // this.getAllSaleList(this.selectedSearchByDateID);
      this.dateId = Number(this.dateId);
      this.GetAllDataWithLazyLoadinFunction(this.filterModel);
    }
  }
  SearchByUser(event: any) {    
      this.GetAllDataWithLazyLoadinFunction(this.filterModel);
  }
  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    this.GetSearchByDateDropDownList();
    this.GetUserDropDownList();
  }



  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;

    // this.getAllSaleList(7);
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
    this.SearchByDateDropdown.push({ value: 6, label: 'All' });
    this.SearchByDateDropdown.push({ value: 7, label: 'Custom' });
    this.dateId = 6;
  }
  GetUserDropDownList() {
    this.IsSpinner = true;
    this.apiService.GetAllUsers().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {

        this.UserDropDownList = response.AllUsersList.filter(y => y.IsActive === true).map(x => {
          return {
            value: x.ID,
            label: x.FirstName + ' ' + x.LastName,
          };
        });
      }
      else {
        this.IsSpinner = false;
        console.log('internal serve Error', response);
      }

    }
    );
  }

  GetAllDataWithLazyLoadinFunction(filterRM) {
    // this.stockRequestModel.Search = filterRM.Product;
    const Type = 1;
    // let filterRequestModel = new FilterRequestModel();
    // let filterRequestModel = new FilterRequestModel(
    //   -1, -1, -1, -1, -1, -1, -1, -1, new Date(), new Date(), 150000, 0, true, true,
    //   -1, -1, -1, false, false, false, '', '', false, false, -1, -1, false, false, '', ''
    // );
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.IsReceived = true;
    filterRequestModel.Product = filterRM.Product;
    filterRequestModel.UserID = this.selectedID ? this.selectedID.value : 0;
    
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
    this.apiService.GetAllActivity(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        this.allActivity = response1.GetAllActivityLogs;
        this.totalRecords = response1.TotalRecords;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    });
  }
}
