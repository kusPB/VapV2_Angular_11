import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { Zone } from '../../../Helper/models/Zone';
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
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styles: []
})
export class ZonesComponent implements OnInit, OnDestroy {
  CatalogPermission = CatalogPermissionEnum;
  @ViewChild('dt') table: Table;
  AllZoneList: Zone[] = [];
  selectedZone: Zone;
  zone: Zone;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedWarehouseID = '';

  items: MenuItem[];
  WarehouseDropdown: SelectItem[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // last = 25;
  totalRecords = 0;


  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID', permission: CatalogPermissionEnum.UpdateZone }
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'WareHouse', header: 'WareHouse', sorting: 'WareHouse', placeholder: '' , translateCol: 'SSGENERIC.WAREHOUSE'},
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },

  ];
  globalFilterFields = "['Name','WareHouse','Description']";
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000]

  constructor(private apiService: vaplongapi, private notificationService: NotificationService) {
    this.zone = new Zone();
  }

  ngOnInit(): void {
    this.GetAllZoneList();
    this.GetWarehouseList();

  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    this.EditZone(event.selectedRowData);
  }
  GetAllZoneList() //Get All Zone Method Get Data from Service 
  {
    this.IsSpinner = true;
    this.apiService.GetAllZones().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {

        this.AllZoneList = response.AllZoneList;
        this.totalRecords = response.AllZoneList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  GetWarehouseList() {
    this.WarehouseDropdown = [];
    this.apiService.GetWarehouseDropDownData().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {

        for (let i = 0; i < response.DropDownData.length; i++) {
          this.WarehouseDropdown.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }
        if (this.WarehouseDropdown.length > 0) {
          this.selectedWarehouseID = response.DropDownData[0].ID;

        }

      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
  }


  AddZone()//Open Add New Zone Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()//Close Add New Zone Section
  {
    this.IsAdd = false;

  }

  SaveUpdateZoneDetails() {
    if (this.zone.ID > 0) {
      this.UpdateZone();
    }
    else {
      this.SaveZone();
    }
  }

  SaveZone() // Save Zone Method To Communicate API
  {
    this.IsSpinner = true;
    this.zone.WareHouseID = Number(this.selectedWarehouseID);
    this.apiService.AddZone(this.zone).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllZoneList();
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

  EditZone(zone: Zone) {

    this.zone = zone;
    this.selectedWarehouseID = this.zone.WareHouseID.toString();
    this.IsAdd = true;
  }

  UpdateZone() // Update Zone Method To Communicate API
  {

    this.IsSpinner = true;
    this.zone.WareHouseID = Number(this.selectedWarehouseID);
    this.apiService.UpdateZone(this.zone).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllZoneList();
        this.IsAdd = false;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }

  UpdateZoneStatus(zone: any) // Update Zone Status Method To Communicate API
  {
    this.IsSpinner = true;

    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = zone.ID;
    this.updateStatusModel.Status = zone.IsActive;
    this.updateStatusModel.UpdatedByUserID = zone.CreatedByUserID;
    this.apiService.UpdateZoneStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllZoneList();
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
    this.zone = new Zone();
  }


}
