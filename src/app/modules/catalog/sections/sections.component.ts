import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { Section } from '../../../Helper/models/Section';
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
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styles: []
})
export class SectionsComponent implements OnInit, OnDestroy {
  CatalogPermission = CatalogPermissionEnum;
  AllSectionList: Section[] = [];
  selectedSection: Section;
  section: Section;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedWarehouseID = '';
  selectedZoneID = '';

  items: MenuItem[];
  WarehouseDropdown: SelectItem[];
  ZoneDropdown: SelectItem[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // last = 25;
  totalRecords = 0;

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID', permission: CatalogPermissionEnum.UpdateSection }
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME'},
    { field: 'WareHouse', header: 'WareHouse', sorting: 'WareHouse', placeholder: '' , translateCol: 'SSGENERIC.WAREHOUSE'},
    { field: 'Zone', header: 'Zone', sorting: 'Zone', placeholder: '', translateCol: 'SSGENERIC.ZONE' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '' , translateCol: 'SSGENERIC.DESCRIPTION'},

  ];
  globalFilterFields = ['Name', 'WareHouse', 'Zone', 'Description'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];

  constructor(private apiService: vaplongapi, private notificationService: NotificationService) {

    this.section = new Section();
  }

  ngOnInit(): void {
    this.GetAllSectionList();
    this.GetWarehouseList();

  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    this.EditSection(event.selectedRowData);
  }

  GetAllSectionList() // Get All Section Method Get Data from Service
  {
    this.IsSpinner = true;
    this.apiService.GetAllSections().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllSectionList = response.AllSectionList;
        this.totalRecords = response.AllSectionList.length;
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
          this.GetZoneList(this.selectedWarehouseID);
        }

      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
  }

  GetZoneList(wareHouseId) {
    this.ZoneDropdown = [];

    const id = {
      ID: wareHouseId
    };
    this.apiService.GetZonesByWarehouseIDForDropdown(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {

        for (let i = 0; i < response.DropDownData.length; i++) {
          this.ZoneDropdown.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }

        if (this.ZoneDropdown.length > 0) {
          this.selectedZoneID = response.DropDownData[0].ID;
        }

      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
  }

  AddSection()// Open Add New Section Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()// Close Add New Section Section
  {
    this.IsAdd = false;

  }

  SaveUpdateSectionDetails() {
    if (this.section.ID > 0) {
      this.UpdateSection();
    }
    else {
      this.SaveSection();
    }
  }

  SaveSection() // Save Section Method To Communicate API
  {
    this.IsSpinner = true;
    this.section.WareHouseID = Number(this.selectedWarehouseID);
    this.section.ZoneID = Number(this.selectedZoneID);
    this.apiService.AddSection(this.section).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllSectionList();
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

  EditSection(section: Section) {

    this.section = section;
    this.selectedWarehouseID = this.section.WareHouseID.toString();
    this.selectedZoneID = this.section.ZoneID.toString();
    this.IsAdd = true;
  }

  UpdateSection() // Update Section Method To Communicate API
  {

    this.IsSpinner = true;
    this.section.WareHouseID = Number(this.selectedWarehouseID);
    this.section.ZoneID = Number(this.selectedZoneID);
    this.apiService.UpdateSection(this.section).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllSectionList();
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

  UpdateSectionStatus(zone: any) // Update Section Status Method To Communicate API
  {
    this.IsSpinner = true;

    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = zone.ID;
    this.updateStatusModel.Status = zone.IsActive;
    this.updateStatusModel.UpdatedByUserID = zone.CreatedByUserID;
    this.apiService.UpdateSectionStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllSectionList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }

  BindZones(event: any)// Bind zone by warehouseid
  {
    this.GetZoneList(event.value);
  }

  ResetFields() // Reset Object
  {
    this.section = new Section();
  }

}
