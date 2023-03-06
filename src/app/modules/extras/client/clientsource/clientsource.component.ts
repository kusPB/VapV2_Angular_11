import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { UpdateStatus } from '../../../../Helper/models/UpdateStatus';
import { ClientSource } from '../../../../Helper/models/ClientSource';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { ExtrasService } from '../../extras.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { Columns } from 'src/app/shared/Model/columns.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ExtrasPermissionEnum } from 'src/app/shared/constant/extras-permission';

@Component({
  selector: 'app-clientsource',
  templateUrl: './clientsource.component.html',
  styleUrls: ['./clientsource.component.scss']
})
export class ClientsourceComponent implements OnInit, OnDestroy {
  ExtrasPermission = ExtrasPermissionEnum;
  @ViewChild('dt') table: Table;
  AllClientSourceList: ClientSource[] = [];
  // selectedClientSource: ClientSource;
  public clientSource: ClientSource;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';

  // items: MenuItem[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // last = 25;
  // totalRecords = 0;
  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'Name', permission: ExtrasPermissionEnum.UpdateClientSource },
    { label: 'Delete', icon: 'fas fa-close', dependedProperty: 'ID' },

  ];
  columns: Columns[] = [
    { field: 'IsActive', header: 'Status', sorting: 'IsActive', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },
  ];

  constructor(private apiService: ExtrasService, private notificationService: NotificationService) {

    this.clientSource = new ClientSource();
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.GetAllClientSourceList(); // Get All Client Source List On Page Load


  }
  emitAction(event: any) {
    if (event.forLabel === 'Update') {
      this.EditClientSource(event.selectedRowData);
    }

    else if (event.forLabel === 'Delete') {
      this.Delete(event.selectedRowData.ID);
    }
  }
  Delete(Id) {
    const Param = { ID: Id };
    this.apiService.DeleteClientSource(Param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Client Source has been Deleted');
        this.GetAllClientSourceList();
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    });
  }

  GetAllClientSourceList() // Get All Client Source Method Get Data from Service
  {
    this.IsSpinner = true;

    this.apiService.GetAllClientSource().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllClientSourceList = response.AllClientSourcesList;
        //  this.totalRecords=response.AllClientSourcesList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  AddClientSource()// Open Add New Client Source Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()// Close Add New Classification Section
  {
    this.IsAdd = false;

  }
  SaveUpdateClientSourceDetails() {

    if (this.clientSource.ID > 0)  // for Update
    {
      this.UpdateClientSource();
    }
    else {
      this.SaveClientSource(); // for save
    }


  }
  SaveClientSource() // Save Client Source Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddClientSource(this.clientSource).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Client Source has been added successfully.');
        this.GetAllClientSourceList();
        this.IsSpinner = false;
        this.IsAdd = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    });
  }
  UpdateClientSource() // Update Client Source Method To Communicate API
  {
    this.apiService.UpdateClientSource(this.clientSource).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Client Source has been updated successfully.');
        this.GetAllClientSourceList();
        this.IsSpinner = false;
        this.IsAdd = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    },
    );
  }

  EditClientSource(clientSource: ClientSource) {
    this.clientSource = clientSource;
    this.IsAdd = true;
  }
  UpdateClientSourceStatus(clientSource: any) // Update Client Source Status Method To Communicate API
  {

    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = clientSource.ID;
    this.updateStatusModel.Status = clientSource.IsActive;
    this.updateStatusModel.UpdatedByUserID = clientSource.CreatedByUserID;
    this.apiService.UpdateClientSourceStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Client Source status has been updated successfully.');
        this.GetAllClientSourceList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }

  ResetFields() // Reset Object
  {
    this.clientSource = new ClientSource();
  }
}
