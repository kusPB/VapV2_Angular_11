import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { Brand } from '../../../Helper/models/Brand';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from '../../shell/services/notification.service';


@Component({
  selector: 'app-Brands',
  templateUrl: './Brands.component.html',
  styles: [
  ],
})
export class BrandsComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  AllBrandList: Brand[] = [];
  selectedBrand: Brand;
  public Brand: Brand;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';

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
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },

  ];
  globalFilterFields = ['Name', 'Description'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];

  constructor(private apiService: vaplongapi, private notificationService: NotificationService) {

    this.Brand = new Brand();
  }

  ngOnInit(): void {
    this.GetAllBrandList(); // Get All Classification List On Page Load

  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    this.EditBrand(event.selectedRowData);
  }

  GetAllBrandList() // Get All Brand Method Get Data from Service
  {
    this.IsSpinner = true;

    this.apiService.GetAllBrands().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.AllBrandList = response.AllBrandsList;
        this.totalRecords = response.AllBrandsList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  AddBrand()// Open Add New Brand Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()// Close Add New Brand Section
  {
    this.IsAdd = false;

  }
  SaveUpdateBrandDetails() {

    if (this.Brand.ID > 0)  // for Update
    {
      this.UpdateBrand();
    }
    else {
      this.SaveBrand(); // for save
    }


  }
  SaveBrand() // Save Code Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddBrand(this.Brand).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllBrandList();
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
  UpdateBrand() // Update Brand Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.UpdateBrand(this.Brand).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllBrandList();
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

  EditBrand(Brand: Brand) {
    this.Brand = Brand;
    this.IsAdd = true;
  }

  UpdateBrandStatus(Brand: any) // Update Brand Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = Brand.ID;
    this.updateStatusModel.Status = Brand.IsActive;
    this.updateStatusModel.UpdatedByUserID = Brand.CreatedByUserID;
    this.apiService.UpdateBrandStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllBrandList();
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
    this.Brand = new Brand();
  }

}
