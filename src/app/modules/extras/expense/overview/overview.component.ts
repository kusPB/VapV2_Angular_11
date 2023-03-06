import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { UpdateStatus } from '../../../../Helper/models/UpdateStatus';
import { Expense } from '../../../../Helper/models/Expense';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { Columns } from 'src/app/shared/Model/columns.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ExtrasPermissionEnum } from 'src/app/shared/constant/extras-permission';
import { StorageService } from 'src/app/shared/services/storage.service';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  ExtrasPermission = ExtrasPermissionEnum;
  @ViewChild('dt') table: Table;
  AllExpenseList: Expense[] = [];
  selectedExpense: Expense;
  expense: Expense;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedExpenseTypeID = '';

  items: MenuItem[];
  ExpenseTypeDropdown: SelectItem[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // last = 25;
  totalRecords = 0;
  CashRegisterHistoryID = 1;
  usermodel: UserModel;
  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ExpenseType', permission: ExtrasPermissionEnum.UpdateExpense },
  ];
  columns: Columns[] = [
    { field: 'IsActive', header: 'Status', sorting: 'IsActive', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'ExpenseType', header: 'ExpenseType', sorting: 'ExpenseType', placeholder: '', translateCol: 'SSGENERIC.EXPENSETYPE' },
    { field: 'dAmount', header: 'dAmount', sorting: 'dAmount', placeholder: '', type:TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.DAMOUNT' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },
    { field: 'ExpenseDate', header: 'ExpenseDate', sorting: 'ExpenseDate', placeholder: '', translateCol: 'SSGENERIC.EXPENSEDATE' },

  ];
  constructor(private apiService: vaplongapi, private notificationService: NotificationService, private storageService: StorageService) {

    this.expense = new Expense();
  }
  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');;
    this.CashRegisterHistoryID = Number(this.storageService.getItem('CashRegisterHistoryID'));
    this.GetAllExpenseList();
    this.GetExpenseTypeList();
    // this.items = [
    //   { label: 'Update', icon: 'fas fa-pencil-alt' , command: () => this.EditExpense(this.selectedExpense) },
    // ];
  }
  emitAction(event: any) {
    if (event.forLabel == 'Update') {
      this.EditExpense(event.selectedRowData)
    }
  }

  GetAllExpenseList() // Get All Expense Method Get Data from Service
  {
    this.apiService.GetAllExpenses().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllExpenseList = response.AllExpenseList;
        this.totalRecords = response.AllExpenseList.length;

      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server error ! not getting api data.');
      }
    },
    );

  }

  GetExpenseTypeList() {
    this.ExpenseTypeDropdown = [];
    this.apiService.GetExpenseTypesForDropdown().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {

        this.selectedExpenseTypeID = response.DropDownData[0].ID;
        for (let i = 0; i < response.DropDownData.length; i++) {
          this.ExpenseTypeDropdown.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }

      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server error');
      }

    }
    );
  }


  AddExpense()// Open Add New Expense Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()// Close Add New Expense Section
  {
    this.IsAdd = false;

  }

  SaveUpdateExpenseDetails() {
    if (this.expense.ID > 0) {
      this.UpdateExpense();
    }
    else {
      this.SaveExpense();
    }
  }

  SaveExpense() // Save Expense Method To Communicate API
  {
    
    this.expense.ExpenseTypeID = Number(this.selectedExpenseTypeID);
    this.expense.ExpenseDate = new Date();
    this.expense.CashRegisterHistoryID = this.CashRegisterHistoryID;
    // this.expense.CashRegisterHistoryID=1;
    this.expense.CreatedByUserID = this.usermodel.ID;
    this.expense.IsActive = true;
    this.apiService.AddExpense(this.expense).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Expense has been added successfully.');
        this.GetAllExpenseList();
        
        this.IsAdd = false;


      }
      else {
        
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server error ! not getting api data.');
      }
    },
    );
  }

  EditExpense(expense: Expense) {

    this.expense = expense;
    this.selectedExpenseTypeID = this.expense.ExpenseTypeID.toString();
    this.IsAdd = true;
  }

  UpdateExpense() // Update Expense Method To Communicate API
  {

    
    this.expense.ExpenseTypeID = Number(this.selectedExpenseTypeID);
    this.expense.CashRegisterHistoryID = this.CashRegisterHistoryID;
    // this.expense.CashRegisterHistoryID=1;
    this.expense.CreatedByUserID = this.usermodel.ID;
    this.expense.IsActive = true;
    this.apiService.UpdateExpense(this.expense).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Expense has been updated successfully.');
        this.GetAllExpenseList();
        this.IsAdd = false;
        

      }
      else {
        
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'nternal serve error ! not getting api data.');
      }
    },
    );
  }

  UpdateExpenseStatus(expense: any) // Update Expense Status Method To Communicate API
  {
    

    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = expense.ID;
    this.updateStatusModel.Status = expense.IsActive;
    this.updateStatusModel.UpdatedByUserID = this.usermodel.ID;
    this.apiService.UpdateExpenseStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Expense status has been updated successfully.');
        this.GetAllExpenseList();
        

      }
      else {
        
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server error ! not getting api data.');
      }
    },
    );
  }

  ResetFields() // Reset Object
  {
    this.expense = new Expense();
  }

}
