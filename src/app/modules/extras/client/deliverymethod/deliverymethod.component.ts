import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { UpdateStatus } from '../../../../Helper/models/UpdateStatus';
import { DeliveryMethod } from '../../../../Helper/models/DeliveryMethod';
import { ExtrasService } from '../../extras.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { Columns } from 'src/app/shared/Model/columns.model';
import { ExtrasPermissionEnum } from 'src/app/shared/constant/extras-permission';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';


@Component({
  selector: 'app-deliverymethod',
  templateUrl: './deliverymethod.component.html',
  styleUrls: ['./deliverymethod.component.scss']
})
export class DeliverymethodComponent implements OnInit, OnDestroy {
  ExtrasPermission = ExtrasPermissionEnum;
  @ViewChild('dt') table: Table;
  AllDeliveryMethodList: DeliveryMethod[] = [];
  selectedDeliveryMethod: DeliveryMethod;
  public deliveryMethod: DeliveryMethod;
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
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'Name', permission: ExtrasPermissionEnum.UpdateShippingMethod }
  ];
  columns: Columns[] = [
    { field: 'IsActive', header: 'Status', sorting: 'IsActive', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Cost', header: 'Delivery Cost', sorting: 'Cost', placeholder: '', type:TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.DELIVERYCOST' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },
  ];
  constructor(private apiService: ExtrasService, private notificationService: NotificationService) {
    this.deliveryMethod = new DeliveryMethod();
  }
  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    this.GetAllDeliveryMethodList(); // Get All Delivery Method List On Page Load

    this.items = [
      { label: 'Update', icon: 'fas fa-pencil-alt', command: () => this.EditDeliveryMethod(this.selectedDeliveryMethod) },

    ];
  }
  emitAction(event: any) {

    this.EditDeliveryMethod(event.selectedRowData);
  }
  GetAllDeliveryMethodList() // Get All Delivery Method Get Data from Service
  {
    this.IsSpinner = true;

    this.apiService.GetAllDeliveryMethod().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllDeliveryMethodList = response.AllShippingMethodsList;
        this.totalRecords = response.AllShippingMethodsList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  AddDeliveryMethod()// Open Add New Delivery Method Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()// Close Add New Delivery Method Section
  {
    this.IsAdd = false;

  }
  SaveUpdateDeliveryMethodDetails() {

    if (this.deliveryMethod.ID > 0)  // for Update
    {
      this.UpdateDeliveryMethod();
    }
    else {
      this.SaveDeliveryMethod(); // for save
    }


  }
  SaveDeliveryMethod() // Save Delivery Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddDeliveryMethod(this.deliveryMethod).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Delivery Method has been added successfully.');
        this.GetAllDeliveryMethodList();
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
  UpdateDeliveryMethod() // Update Delivery Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.UpdateDeliveryMethod(this.deliveryMethod).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Delivery Method has been updated successfully.');
        this.GetAllDeliveryMethodList();
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

  EditDeliveryMethod(deliveryMethod: DeliveryMethod) {

    this.deliveryMethod = deliveryMethod;
    this.IsAdd = true;
  }
  UpdateDeliveryMethodStatus(deliveryMethod: any) // Update Delivery Method Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = deliveryMethod.ID;
    this.updateStatusModel.Status = deliveryMethod.IsActive;
    this.updateStatusModel.UpdatedByUserID = deliveryMethod.CreatedByUserID;
    this.apiService.UpdateDeliveryMethodStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Delivery Method status has been updated successfully.');
        this.GetAllDeliveryMethodList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);

      }
    },
    );
  }

  ResetFields() // Reset Object
  {
    this.deliveryMethod = new DeliveryMethod();
  }


}
