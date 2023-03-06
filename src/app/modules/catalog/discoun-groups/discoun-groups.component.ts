import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';

import { Router } from '@angular/router';
import { DiscountGroup } from '../../../Helper/models/DiscountGroup';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';

import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationService } from '../../shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { CatalogPermissionEnum } from 'src/app/shared/constant/catalog-permission';

@Component({
  selector: 'app-discoun-groups',
  templateUrl: './discoun-groups.component.html',
  styleUrls: ['./discoun-groups.component.scss'],
})
export class DiscounGroupsComponent implements OnInit, OnDestroy {

  CatalogPermission = CatalogPermissionEnum;
  AllDiscountGroupList: DiscountGroup[] = [];
  selectedDiscountGroup: DiscountGroup;
  public discountGroup: DiscountGroup;
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
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID', permission: CatalogPermissionEnum.UpdateDiscountGroup },
    { label: 'Product Discount', icon: 'fas fa-percent', dependedProperty: 'ID', permission: CatalogPermissionEnum.UpdateProductDiscounts }
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },
  ];

  globalFilterFields = "['Name','Description']";
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000]


  constructor(private apiService: vaplongapi, private notificationService: NotificationService, private router: Router) {

    this.discountGroup = new DiscountGroup();
  }

  ngOnInit(): void {
    this.GetAllDiscountGroupList(); //Get All Discount Group List On Page Load

  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    if (event.forLabel == 'Update') {
      this.EditDiscountGroup(event.selectedRowData);
    }
    else if (event.forLabel == 'Product Discount') {
      this.AddProductDiscount(event.selectedRowData);
    }

  }
  GetAllDiscountGroupList() //Get All Discount Groups Method Get Data from Service 
  {
    this.IsSpinner = true;

    this.apiService.GetAllDiscountGroups().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        // console.log(response);
        this.AllDiscountGroupList = response.AllDiscountGroupList;
        this.totalRecords = response.AllDiscountGroupList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  AddDiscountGroup()//Open Add New Discount Group Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()//Close Add New Discount Group Section
  {
    this.IsAdd = false;

  }
  SaveUpdateDiscountGroupDetails() {

    if (this.discountGroup.ID > 0)  //for Update
    {
      this.UpdateDiscountGroup();
    }
    else {
      this.SaveDiscountGroup(); //for save
    }


  }
  SaveDiscountGroup() // Save Discount Group Lable Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddDiscountGroup(this.discountGroup).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllDiscountGroupList();
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
  UpdateDiscountGroup() // Update Discount Group Method To Communicate API
  {
    this.apiService.UpdateDiscountGroup(this.discountGroup).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllDiscountGroupList();
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

  EditDiscountGroup(discountGroup: DiscountGroup) {
    this.discountGroup = discountGroup;
    this.IsAdd = true;
  }

  UpdateDiscountGroupStatus(discountGroup: any) // Update Discount Group Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = discountGroup.ID;
    this.updateStatusModel.Status = discountGroup.IsActive;
    this.updateStatusModel.UpdatedByUserID = discountGroup.CreatedByUserID;
    this.apiService.UpdateDiscountGroupStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllDiscountGroupList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);

      }
    },
    );
  }

  AddProductDiscount(discountGroup: DiscountGroup) {
    this.router.navigate(['/catalog/product-discount', discountGroup.ID]);
  }
  ResetFields() // Reset Object
  {
    this.discountGroup = new DiscountGroup();
  }

}
