
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem} from 'primeng/api';
import { CashRegister } from 'src/app/Helper/models/CashRegister';
import { UpdateStatus } from 'src/app/Helper/models/UpdateStatus';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { NotificationService } from '../../shell/services/notification.service';
import { CashRegisterService } from '../cash-register.service';

import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { CashRegisterPermissionEnum } from 'src/app/shared/constant/cash-register-permission';

@Component({
  selector: 'app-cash-register-overview',
  templateUrl: './cash-register-overview.component.html',
  styles: ['./cash-register-overview.component.scss'],
})
export class CashRegisterOverviewComponent implements OnInit, OnDestroy {
  CashRegisterPermission = CashRegisterPermissionEnum
  AllCashRegisterList: CashRegister[] = [];
  // OutletList: Outlet[];
  selectedCashRegister: CashRegister;
  public cashRegister: CashRegister;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedOutletID = '';

  items: MenuItem[];
  OutletDropdown: SelectItem[];
  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  // last = 25;
  totalRecords = 0;

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID', permission: CashRegisterPermissionEnum.UpdateCashRegister }
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'IsOpened', header: 'Active Status', sorting: '', placeholder: '', type: TableColumnEnum.CASH_REGISTER, translateCol: 'SSGENERIC.ACTIVESTATUS' },
  ];

  globalFilterFields = ['Name'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000]

  constructor(
    private apiServices: vaplongapi,
    private apiService: CashRegisterService,
    private readonly notificationService: NotificationService) {
    this.cashRegister = new CashRegister();
  }

  ngOnInit(): void {
    this.GetAllCashRegisterList(); // Get All Cash Register List On Page Load
    this.GetOutletList(); // Get All Outlet List On Page Load for Dropdown
  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    this.EditCashRegister(event.selectedRowData);
  }
  GetAllCashRegisterList() // Get All Cash Register Method Get Data from Service 
  {

    this.IsSpinner = true;
    this.apiService.GetAllCashRegister().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.AllCashRegisterList = response.AllCashRegisterList;
        this.totalRecords = response.AllCashRegisterList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  GetOutletList() {
    this.OutletDropdown = [];
    this.apiServices.GetOutletForDropdown().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {

        this.selectedOutletID = response.DropDownData[0].ID;
        for (let i = 0; i < response.DropDownData.length; i++) {
          this.OutletDropdown.push({
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


  AddCashRegister()// Open Add New Cash Register Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()// Close Add New Cash Register Section
  {
    this.IsAdd = false;

  }
  SaveUpdateCashRegisterDetails() {

    if (this.cashRegister.ID > 0)  // for Update
    {
      this.UpdateCashRegister();
    }
    else {
      this.SaveCashRegister(); // for save
    }


  }
  SaveCashRegister() // Save Cash Register Method To Communicate API
  {
    this.IsSpinner = true;
    this.cashRegister.OutletID = Number(this.selectedOutletID);
    this.apiService.AddCashRegister(this.cashRegister).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Cash Register has been added successfully.');
        this.GetAllCashRegisterList();
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
  UpdateCashRegister() // Update Cash Register Method To Communicate API
  {
    this.IsSpinner = true;
    this.cashRegister.OutletID = Number(this.selectedOutletID);
    this.apiService.UpdateCashRegister(this.cashRegister).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Cash Register has been updated successfully.');
        this.GetAllCashRegisterList();
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

  EditCashRegister(cashRegister: CashRegister) {
    this.cashRegister = cashRegister;
    this.IsAdd = true;
  }
  UpdateCashRegisterStatus(cashRegister: any) // Update Cash Register Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = cashRegister.ID;
    this.updateStatusModel.Status = cashRegister.IsActive;
    this.updateStatusModel.UpdatedByUserID = cashRegister.CreatedByUserID;
    this.apiService.UpdateCashRegisterStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Cash Register status has been added successfully.');
        this.GetAllCashRegisterList();
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
    this.cashRegister = new CashRegister();
  }

}

