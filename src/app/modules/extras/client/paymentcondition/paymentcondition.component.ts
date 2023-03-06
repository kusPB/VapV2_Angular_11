import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { UpdateStatus } from '../../../../Helper/models/UpdateStatus';
import { PaymentCondition } from '../../../../Helper/models/PaymentCondition';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { Columns } from 'src/app/shared/Model/columns.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ExtrasPermissionEnum } from 'src/app/shared/constant/extras-permission';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

@Component({
  selector: 'app-paymentcondition',
  templateUrl: './paymentcondition.component.html',
  styleUrls: ['./paymentcondition.component.scss']
})
export class PaymentconditionComponent implements OnInit, OnDestroy {
  ExtrasPermission = ExtrasPermissionEnum;
  @ViewChild('dt') table: Table;
  AllPaymentConditionList: PaymentCondition[] = [];
  selectedPaymentCondition: PaymentCondition;
  public paymentCondition: PaymentCondition;
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
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'Name', permission: ExtrasPermissionEnum.UpdatePaymentCondition },
    { label: 'Delete', icon: 'fas fa-trash-alt', dependedProperty: 'Name' }
  ];
  columns: Columns[] = [
    { field: 'IsActive', header: 'Status', sorting: 'IsActive', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },
  ];
  constructor(private apiService: vaplongapi, private notificationService: NotificationService) {
    this.paymentCondition = new PaymentCondition();
  }
  ngOnDestroy(): void {

  }
  ngOnInit(): void {

    this.GetAllPaymentConditionList(); // Get All Payment Condition List On Page Load

    // this.items = [
    //   { label: 'Update', icon: 'fas fa-pencil-alt', command: () => this.EditPaymentCondition(this.selectedPaymentCondition) },
    //   { label: 'Delete', icon: 'fas fa-trash-alt' },

    //  ];
  }

  GetAllPaymentConditionList() // Get All Payment Condition Method Get Data from Service 
  {
    this.IsSpinner = true;

    this.apiService.GetAllPaymentCondition().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllPaymentConditionList = response.AllPaymentConditionList;
        this.totalRecords = response.AllPaymentConditionList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }
  emitAction(event: any) {
    if (event.forLabel === 'Update') {
      this.EditPaymentCondition(event.selectedRowData);
    }
  }
  AddPaymentCondition()// Open Add New Payment Condition Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()// Close Add New Payment Condition Section
  {
    this.IsAdd = false;

  }
  SaveUpdatePaymentConditionDetails() {

    if (this.paymentCondition.ID > 0)  // for Update
    {
      this.UpdatePaymentCondition();
    }
    else {
      this.SavePaymentCondition(); // for save
    }


  }
  SavePaymentCondition() // Save Payment Condition Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddPaymentCondition(this.paymentCondition).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Payment Condition has been added successfully.');
        this.GetAllPaymentConditionList();
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
  UpdatePaymentCondition() // Update Payment Condition Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.UpdatePaymentCondition(this.paymentCondition).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Payment Condition has been updated successfully.');
        this.GetAllPaymentConditionList();
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

  EditPaymentCondition(paymentCondition: PaymentCondition) {
    this.paymentCondition = paymentCondition;
    this.IsAdd = true;
  }
  UpdatePaymentConditionStatus(paymentCondition: any) // Update Payment Condition Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = paymentCondition.ID;
    this.updateStatusModel.Status = paymentCondition.IsActive;
    this.updateStatusModel.UpdatedByUserID = paymentCondition.CreatedByUserID;
    this.apiService.UpdatePaymentConditionStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Payment Condition status has been updated successfully.');
        this.GetAllPaymentConditionList();
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
    this.paymentCondition = new PaymentCondition();
  }

}
