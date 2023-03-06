import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { BrandType } from '../../../Helper/models/BrandType';
import { Brand } from '../../../Helper/models/Brand';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';

import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from '../../shell/services/notification.service';
import { CatalogPermissionEnum } from 'src/app/shared/constant/catalog-permission';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { StorageService } from 'src/app/shared/services/storage.service';



@Component({
  selector: 'app-brand-type',
  templateUrl: './brand-type.component.html',
  styles: []
})
export class BrandTypeComponent implements OnInit, OnDestroy {
  CatalogPermission = CatalogPermissionEnum;
  @ViewChild('dt') table: Table;
  AllBrandTypeList: BrandType[] = [];
  BrandList: Brand[];
  selectedBrandType: BrandType;
  brandType: BrandType;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedBrandID = '';
  usermodel: UserModel;

  items: MenuItem[];
  BrandDropdown: SelectItem[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // last = 25;
  totalRecords = 0;


  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID', permission: CatalogPermissionEnum.UpdateBrandType }
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '' , translateCol: 'SSGENERIC.NAME'},
    { field: 'Brand', header: 'Brand', sorting: 'Brand', placeholder: '', translateCol: 'MANAGEDPRODUCT.BRAND' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '' , translateCol: 'SSGENERIC.DESCRIPTION'},

  ];
  globalFilterFields = ['Name', 'Brand', 'Description'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];

  constructor(private apiService: vaplongapi,  private storageService: StorageService,private notificationService: NotificationService) {

    this.brandType = new BrandType();
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    this.GetAllBrandTypeList();
    this.GetBrandList();
  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    this.EditBrandType(event.selectedRowData);
  }
  GetAllBrandTypeList() // Get All BrandType Method Get Data from Service
  {
    this.IsSpinner = true;
    this.apiService.GetAllBrandTypes().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllBrandTypeList = response.AllBrandTypeList;
        this.totalRecords = response.AllBrandTypeList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

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


  AddBrandType() // Open Add New Deparment Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection() // Close Add New BrandType Section
  {
    this.IsAdd = false;

  }

  SaveUpdateBrandTypeDetails() {
    if (this.brandType.ID > 0) {
      this.UpdateBrandType();
    }
    else {
      this.SaveBrandType();
    }
  }

  SaveBrandType() // Save BrandType Method To Communicate API
  {
    this.IsSpinner = true;
    this.brandType.BrandID = Number(this.selectedBrandID);
    this.brandType.CreatedByUserID = this.usermodel.ID;
    this.apiService.AddBrandType(this.brandType).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllBrandTypeList();
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

  EditBrandType(brandType: BrandType) {

    this.brandType = brandType;
    this.selectedBrandID = this.brandType.BrandID.toString();
    this.IsAdd = true;
  }

  UpdateBrandType() // Update BrandType Method To Communicate API
  {

    this.IsSpinner = true;
    this.brandType.BrandID = Number(this.selectedBrandID);
    this.brandType.CreatedByUserID = this.usermodel.ID;
    this.apiService.UpdateBrandType(this.brandType).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllBrandTypeList();
        this.IsAdd = false;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    });
  }

  UpdateBrandTypeStatus(brandType: any) // Update BrandType Status Method To Communicate API
  {
    this.IsSpinner = true;

    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = brandType.ID;
    this.updateStatusModel.Status = brandType.IsActive;
    this.updateStatusModel.UpdatedByUserID = this.usermodel.ID;
    this.apiService.UpdateBrandTypeStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllBrandTypeList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }

  ResetFields() // Reset Object
  {
    this.brandType = new BrandType();
  }

}
