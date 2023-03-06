import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { UpdateStatus } from '../../../../Helper/models/UpdateStatus';
import { ExpenseWage } from '../../../../Helper/models/ExpenseWage';
import { ExtrasPermissionEnum } from 'src/app/shared/constant/extras-permission';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';


@Component({
  selector: 'app-managewages',
  templateUrl: './managewages.component.html',
  styleUrls: ['./managewages.component.scss']
})
export class ManagewagesComponent implements OnInit, OnDestroy {
  ExtrasPermission = ExtrasPermissionEnum;
  expenseWage: ExpenseWage;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  selectedExpenseTypeID = '';
  selectedUserID = '';


  ExpenseTypeDropdown: SelectItem[];
  UsersDropdown: SelectItem[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // last = 25;
  totalRecords = 0;
  constructor(private apiService: vaplongapi, private notificationService: NotificationService) {
    this.expenseWage = new ExpenseWage();
  }

  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    this.GetUsersList();
    this.GetExpenseTypeList();
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
        console.log('internal serve Error', response);
      }

    }
    );
  }

  GetUsersList() {
    this.UsersDropdown = [];
    this.apiService.GetUsersForDropdown().subscribe((response: any) => {
      if (response.ResponseText === 'success') {

        this.selectedUserID = response.DropDownData[0].ID;
        for (let i = 0; i < response.DropDownData.length; i++) {
          this.UsersDropdown.push({
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

  SaveWageExpense() // Save Wage Expense Method To Communicate API
  {
    this.IsSpinner = true;
    this.expenseWage.ExpenseTypeID = Number(this.selectedExpenseTypeID);
    this.expenseWage.UserID = Number(this.selectedUserID);
    this.expenseWage.CashRegisterHistoryID = 1;
    this.apiService.AddExpenseWage(this.expenseWage).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Expense wage has been added successfully.');
        this.IsSpinner = false;



      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    },
    );
  }


}
