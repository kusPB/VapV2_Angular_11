import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { UpdateStatus } from '../../../../Helper/models/UpdateStatus';
import { ExpenseType } from '../../../../Helper/models/ExpenseType';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { Columns } from 'src/app/shared/Model/columns.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ExtrasPermissionEnum } from 'src/app/shared/constant/extras-permission';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';

@Component({
  selector: 'app-expensetypeoverview',
  templateUrl: './expensetypeoverview.component.html',
  styleUrls: ['./expensetypeoverview.component.scss']
})
export class ExpensetypeoverviewComponent implements OnInit {

  ExtrasPermission = ExtrasPermissionEnum
  @ViewChild('dt') table: Table;
  AllExpenseTypeList: ExpenseType[] =[];
  selectedExpenseType: ExpenseType;
  public expenseType :ExpenseType;
  updateStatusModel:UpdateStatus;
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
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'Name', permission: ExtrasPermissionEnum.UpdateExpenseType },
  ];
  columns: Columns[] = [
    { field: 'IsActive', header: 'Status', sorting: 'IsActive', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON , translateCol: 'SSGENERIC.STATUS'},
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },

  ];
  constructor(private apiService: vaplongapi, private notificationService: NotificationService) {
    this.expenseType = new ExpenseType();
   }

  ngOnInit(): void {
    this.GetAllExpenseTypeList(); //Get All Expense Type List On Page Load
    
    this.items = [
      { label: 'Update', icon: 'fas fa-pencil-alt', command: () => this.EditExpenseType(this.selectedExpenseType) },
      
     ];
  }
  emitAction(event: any) {
    if (event.forLabel == 'Update') {
      this.EditExpenseType(event.selectedRowData)
    } 
  }
  GetAllExpenseTypeList() //Get All Expense Type Method Get Data from Service 
  {
    
    this.IsSpinner=true;
    this.apiService.GetAllExpenseType().subscribe((response: any) => {
      if (response.ResponseText === 'success') {
         this.AllExpenseTypeList = response.AllExpenseTypeList;
         this.totalRecords=response.AllExpenseTypeList.length;
         this.IsSpinner = false;
  
      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );
  
  }

  AddExpenseType()//Open Add New Expense Type Section
  {
    this.ResetFields();
    this.IsAdd=true;
  }
  CloseAddSection()//Close Add New Expense Type Section
  {
    this.IsAdd=false;
    
  }
  SaveUpdateExpenseTypeDetails()
  {

   if(this.expenseType.ID > 0)  //for Update
   {
     this.UpdateExpenseType();
   }
   else
   {
     this.SaveExpenseType(); //for save
   }


  }
  SaveExpenseType() // Save Expense Type Method To Communicate API
  {
    this.IsSpinner=true;
    this.apiService.AddExpenseType(this.expenseType).subscribe((response: any) => {
      
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Expense Type has been added successfully.');
        this.GetAllExpenseTypeList();
        this.IsSpinner = false;
         this.IsAdd=false;
  
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    },
    );
  }
  UpdateExpenseType() // Update Expense Type Method To Communicate API
  {
    this.IsSpinner=true;
    this.apiService.UpdateExpenseType(this.expenseType).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Expense Type has been updated successfully.');
        this.GetAllExpenseTypeList();
        this.IsSpinner = false;
         this.IsAdd=false;
  
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    },
    );
  }

  EditExpenseType(expenseType:ExpenseType) {
    this.expenseType=expenseType;
    this.IsAdd=true;
  }
  UpdateExpenseTypeStatus(expenseType:any) // Update Expense Type Status Method To Communicate API
  { 
    this.IsSpinner = true;
    this.updateStatusModel= new UpdateStatus();
    this.updateStatusModel.ID=expenseType.ID;
    this.updateStatusModel.Status=expenseType.IsActive;
    this.updateStatusModel.UpdatedByUserID=expenseType.CreatedByUserID;
    this.apiService.UpdateExpenseTypeStatus(this.updateStatusModel).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Expense Type status has been updated successfully.');
        this.GetAllExpenseTypeList();
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
    this.expenseType= new ExpenseType(); 
  }

}
