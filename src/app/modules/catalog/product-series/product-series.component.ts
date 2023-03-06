import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { Series } from '../../../Helper/models/Series';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from '../../shell/services/notification.service';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { StorageService } from 'src/app/shared/services/storage.service';


@Component({
  selector: 'app-product-series',
  templateUrl: './product-series.component.html',
  styles: [
  ],
})
export class ProductSeriesComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  AllSeriesList: Series[] = [];
  selectedSeries: Series;
  public series: Series;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];
  usermodel: UserModel;

  valCheck = '';
  ProductSearch = '';
  BrandDropdown: SelectItem[];
  selectedBrandID = '';

  items: MenuItem[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // last = 25;
  totalRecords = 0;


  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID' }
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Brand', header: 'Brand', sorting: 'Brand', placeholder: '', translateCol: 'MANAGEDPRODUCT.BRAND' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },

  ];
  globalFilterFields = ['Name','Brand', 'Description'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];

  constructor(private apiService: vaplongapi, private storageService: StorageService, private notificationService: NotificationService) {

    this.series = new Series();
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    this.GetAllSeriesList(); // Get All Classification List On Page Load
    this.GetBrandList();

  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    this.EditSeries(event.selectedRowData);
  }
  GetBrandList() {
    this.BrandDropdown = [];
    this.apiService.GetDropDownDataBrand().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.selectedBrandID = response.DropDownData[0].ID;
        for (let i = 0; i < response.DropDownData.length; i++) {
          this.BrandDropdown.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }
      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
  }
  GetAllSeriesList() // Get All Series Method Get Data from Service
  {
    this.IsSpinner = true;

    this.apiService.GetAllSeries().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.AllSeriesList = response.AllProductSeriesList;
        this.totalRecords = response.AllProductSeriesList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  AddSeries()// Open Add New Series Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()// Close Add New Series Section
  {
    this.IsAdd = false;

  }
  SaveUpdateSeriesDetails() {

    if (this.series.ID > 0)  // for Update
    {
      this.UpdateSeries();
    }
    else {
      this.SaveSeries(); // for save
    }


  }
  SaveSeries() // Save Code Method To Communicate API
  {
    this.IsSpinner = true;  
    this.series.BrandID = Number(this.selectedBrandID);
    this.series.CreatedByUserID = this.usermodel.ID;
    this.apiService.AddSeries(this.series).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllSeriesList();
        this.IsSpinner = false;
        this.IsAdd = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);

      }
    },
    );
  }
  UpdateSeries() // Update Series Method To Communicate API
  {
    this.IsSpinner = true;
    this.series.BrandID = Number(this.selectedBrandID);
    this.series.CreatedByUserID = this.usermodel.ID;
    this.apiService.UpdateSeries(this.series).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllSeriesList();
        this.IsSpinner = false;
        this.IsAdd = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);

      }
    },
    );
  }

  EditSeries(series: Series) {
    this.series = series;
    this.selectedBrandID = this.series.BrandID.toString();
    this.IsAdd = true;
  }

  UpdateSeriesStatus(series: any) // Update Series Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = series.ID;
    this.updateStatusModel.Status = series.IsActive;
    this.updateStatusModel.UpdatedByUserID = series.CreatedByUserID;
    this.apiService.UpdateSeriesStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllSeriesList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }

  ResetFields() // Reset Object
  {
    this.series = new Series();
  }

}
