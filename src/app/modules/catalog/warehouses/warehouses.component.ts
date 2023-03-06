import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { WareHouse } from '../../../Helper/models/WareHouse';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from '../../shell/services/notification.service';
import { CatalogPermissionEnum } from 'src/app/shared/constant/catalog-permission';


@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styles: [
  ],
})
export class WarehousesComponent implements OnInit, OnDestroy {
  CatalogPermission = CatalogPermissionEnum;
  AllWareHouseList: WareHouse[] = [];
  selectedWareHouse: WareHouse;
  public wareHouse: WareHouse;
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
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID', permission: CatalogPermissionEnum.UpdateWarehouse }
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },

  ];
  globalFilterFields = "['Name','Description']";
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000]

  constructor(private apiService: vaplongapi, private notificationService: NotificationService) {

    this.wareHouse = new WareHouse();
  }

  ngOnInit(): void {
    this.GetAllWarehouseList(); //Get All Warehouse List On Page Load


  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    this.EditWarehouse(event.selectedRowData);
  }
  GetAllWarehouseList() //Get All Warehouse Method Get Data from Service 
  {
    this.IsSpinner = true;

    this.apiService.GetAllWarehouses().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        // console.log(response);
        this.AllWareHouseList = response.AllWareHouseList;
        this.totalRecords = response.AllWareHouseList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  AddWarehouse()//Open Add New Warehouse Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()//Close Add New Warehouse Section
  {
    this.IsAdd = false;

  }
  SaveUpdateWarehouseDetails() {

    if (this.wareHouse.ID > 0)  //for Update
    {
      this.UpdateWarehouse();
    }
    else {
      this.SaveWarehouse(); //for save
    }


  }
  SaveWarehouse() // Save Warehouse Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddWarehouse(this.wareHouse).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllWarehouseList();
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
  UpdateWarehouse() // Update Warehouse Method To Communicate API
  {
    this.apiService.UpdateWarehouse(this.wareHouse).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllWarehouseList();
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

  EditWarehouse(wareHouse: WareHouse) {
    this.wareHouse = wareHouse;
    this.IsAdd = true;
  }
  UpdateWarehouseStatus(wareHouse: any) // Update Warehouse Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = wareHouse.ID;
    this.updateStatusModel.Status = wareHouse.IsActive;
    this.updateStatusModel.UpdatedByUserID = wareHouse.CreatedByUserID;
    this.apiService.UpdateWarehouseStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllWarehouseList();
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
    this.wareHouse = new WareHouse();
  }

}
