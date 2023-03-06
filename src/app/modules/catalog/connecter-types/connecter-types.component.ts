import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { ConnecterType } from '../../../Helper/models/ConnecterType';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from '../../shell/services/notification.service';


@Component({
  selector: 'app-connecter-types',
  templateUrl: './connecter-types.component.html',
  styles: [
  ],
})
export class ConnecterTypesComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  AllConnecterTypeList: ConnecterType[] = [];
  selectedConnecterType: ConnecterType;
  public ConnecterType: ConnecterType;
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

    this.ConnecterType = new ConnecterType();
  }

  ngOnInit(): void {
    this.GetAllConnecterTypeList(); // Get All Classification List On Page Load

  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    this.EditConnecterType(event.selectedRowData);
  }

  GetAllConnecterTypeList() // Get All ConnecterType Method Get Data from Service
  {
    this.IsSpinner = true;

    this.apiService.GetAllConnecterTypes().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.AllConnecterTypeList = response.AllConnecterTypesList;
        this.totalRecords = response.AllConnecterTypesList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  AddConnecterType()// Open Add New ConnecterType Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()// Close Add New ConnecterType Section
  {
    this.IsAdd = false;

  }
  SaveUpdateConnecterTypeDetails() {

    if (this.ConnecterType.ID > 0)  // for Update
    {
      this.UpdateConnecterType();
    }
    else {
      this.SaveConnecterType(); // for save
    }
  }
  SaveConnecterType() // Save Code Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddConnecterType(this.ConnecterType).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllConnecterTypeList();
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
  UpdateConnecterType() // Update ConnecterType Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.UpdateConnecterType(this.ConnecterType).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllConnecterTypeList();
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

  EditConnecterType(ConnecterType: ConnecterType) {
    this.ConnecterType = ConnecterType;
    this.IsAdd = true;
  }

  UpdateConnecterTypeStatus(ConnecterType: any) // Update ConnecterType Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = ConnecterType.ID;
    this.updateStatusModel.Status = ConnecterType.IsActive;
    this.updateStatusModel.UpdatedByUserID = ConnecterType.CreatedByUserID;
    this.apiService.UpdateConnecterTypeStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllConnecterTypeList();
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
    this.ConnecterType = new ConnecterType();
  }

}
