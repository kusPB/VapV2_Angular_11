import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { Level } from '../../../Helper/models/Level';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';

import { DatePipe } from '@angular/common';

import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from '../../shell/services/notification.service';
import { CatalogPermissionEnum } from 'src/app/shared/constant/catalog-permission';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { StorageService } from 'src/app/shared/services/storage.service';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';


@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  providers: [DatePipe]

})
export class LevelsComponent implements OnInit, OnDestroy {
  CatalogPermission = CatalogPermissionEnum;

  @ViewChild('dt') table: Table;
  AllLevelList: Level[] = [];
  selectedLevel: Level;
  level: Level;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  
  valCheck = '';
  prodcutSearch = '';
  selectedWarehouseID :any;
  selectedZoneID :any;
  selectedSectionID:any;

  items: MenuItem[];
  WarehouseDropdown: SelectItem[];
  ZoneDropdown: SelectItem[];
  SectionDropdown: SelectItem[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // last = 25;
  totalRecords = 0;

  filterModel = {
    PageNo: 0,
    PageSize: 25,
    Product: '',
  };

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID', permission: CatalogPermissionEnum.UpdateLevel }
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'WareHouse', header: 'WareHouse', sorting: 'WareHouse', placeholder: '', translateCol: 'SSGENERIC.WAREHOUSE' },
    { field: 'Zone', header: 'Zone', sorting: 'Zone', placeholder: '', translateCol: 'SSGENERIC.ZONE' },
    { field: 'Section', header: 'Section', sorting: 'Section', placeholder: '', translateCol: 'SSGENERIC.SECTION' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },

  ];
  globalFilterFields = ['Name', 'WareHouse', 'Zone', 'Section', 'Description'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  usermodel: UserModel;

  constructor(
    private apiService: vaplongapi, private datepipe: DatePipe,
    private storageService: StorageService, private notificationService: NotificationService) {
    this.level = new Level();
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    // this.GetAllLevelList();
    this.GetWarehouseList(0,0,0);

  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    this.EditLevel(event.selectedRowData);
  }
  GetAllLevelDataWithLazyLoadinFunction(filterRM) {

    const filterRequestModel = new FilterRequestModel();
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.Product = filterRM.Product;

    this.apiService.GetAllLevelTotalCount(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.totalRecords = response.TotalRowCount;
      }
      else {
      }
    },
    );
    this.apiService.GetAllLevelPagination(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        this.AllLevelList = response1.AllLevelList;
      }
      else {
        console.log('internal serve error ! not getting api data');
      }
    },
    );

  }
  GetAllLevelList() // Get All Level Method Get Data from Service
  {
    
    this.apiService.GetAllLevel().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllLevelList = response.AllLevelList;
        this.totalRecords = response.AllLevelList.length;
        

      }
      else {
        
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  GetWarehouseList(WareHouseId,ZoneId,SectionId) {
    this.WarehouseDropdown = [];
    this.apiService.GetWarehouseDropDownData().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        for (const item of response.DropDownData) {
          this.WarehouseDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
        if (this.WarehouseDropdown.length > 0) {
          this.selectedWarehouseID=undefined;
          if(WareHouseId!=0)
          {
            this.selectedWarehouseID = WareHouseId;
          }
          else{
            this.selectedWarehouseID = response.DropDownData[0].ID;
          }
         this.GetZoneList(this.selectedWarehouseID,ZoneId,SectionId);
        }

      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
  }

  GetZoneList(wareHouseId,ZoneId,SectionId) {
    this.ZoneDropdown = [];

    const id = {
      ID: wareHouseId
    };
    this.apiService.GetZonesByWarehouseIDForDropdown(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {

        for (const item of response.DropDownData) {
          this.ZoneDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }

        if (this.ZoneDropdown.length > 0) {
          if(ZoneId!=0)
          {
            this.selectedZoneID = ZoneId;
          }
          else{
            this.selectedZoneID = response.DropDownData[0].ID;
          }
          this.GetSecionsList(this.selectedZoneID,SectionId);
        }

      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
  }



  GetSecionsList(ZoneId,SectionId) {
    this.SectionDropdown = [];

    const id = {
      ID: ZoneId
    };
    this.apiService.GetSectionsByZoneIDForDropdown(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {

        for (const item of response.DropDownData) {
          this.SectionDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }

        if (this.SectionDropdown.length > 0) {
          if(SectionId!=0)
          {
            this.selectedSectionID = SectionId;
          }
          else{
            this.selectedSectionID = response.DropDownData[0].ID;
          }
        }

      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
  }


  AddLevel() // Open Add New Level Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection() // Close Add New Level Section
  {
    this.IsAdd = false;

  }

  SaveUpdateLevelDetails() {
    if (this.level.ID > 0) {
      this.UpdateLevel();
    }
    else {
      this.SaveLevel();
    }
  }

  SaveLevel() // Save Level Method To Communicate API
  {
    
    this.level.WareHouseID = Number(this.selectedWarehouseID);
    this.level.ZoneID = Number(this.selectedZoneID);
    this.level.SectionID = Number(this.selectedSectionID);
    this.level.CreatedByUserID = this.usermodel.ID;
    this.apiService.AddLevel(this.level).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        //this.GetAllLevelList();
        this.GetAllLevelDataWithLazyLoadinFunction(this.filterModel);     
        this.IsAdd = false;

      }
      else {
        
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }

  EditLevel(level: Level) {
    this.level = level;

    if(this.selectedWarehouseID !== this.level.WareHouseID)
    {
      this.GetWarehouseList(this.level.WareHouseID,this.level.ZoneID,this.level.SectionID);
    }
    else if(this.selectedZoneID !== this.level.ZoneID){
      this.GetZoneList(this.level.WareHouseID,this.level.ZoneID,this.level.SectionID);
    }
    else if(this.selectedSectionID !== this.level.SectionID){
      this.GetSecionsList(this.level.ZoneID,this.level.SectionID);
    }
    
    //this.selectedZoneID = this.level.ZoneID;
    //this.selectedSectionID = this.level.SectionID;
    this.IsAdd = true;
  }

  UpdateLevel() // Update Level Method To Communicate API
  {

    
    this.level.WareHouseID = Number(this.selectedWarehouseID);
    this.level.ZoneID = Number(this.selectedZoneID);
    this.level.SectionID = Number(this.selectedSectionID);
    this.level.CreatedByUserID = this.usermodel.ID;
    this.apiService.UpdateLevel(this.level).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        //this.GetAllLevelList();
        this.GetAllLevelDataWithLazyLoadinFunction(this.filterModel);

        this.IsAdd = false;
        

      }
      else {
        
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }

  UpdateLevelStatus(level: any) // Update Level Status Method To Communicate API
  {
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = level.ID;
    this.updateStatusModel.Status = level.IsActive;
    this.updateStatusModel.UpdatedByUserID = this.usermodel.ID;
    this.apiService.UpdateLevelStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        //this.GetAllLevelList();
        this.GetAllLevelDataWithLazyLoadinFunction(this.filterModel);
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }

  BindZones(event: any)// Bind zone by warehouseid
  {
    this.GetZoneList(event.value,0,0);
  }

  BindSection(event: any)// Bind Section by zoneid
  {
    this.GetSecionsList(event.value,0);
  }
  ResetFields() // Reset Object
  {
    this.level = new Level();
  }
}