import { Component,OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import {  MenuItem, SelectItem, ConfirmationService  } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { UpdateStatus } from 'src/app/Helper/models/UpdateStatus';
import jsPDF from 'jspdf';
import autoTable  from  'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { Router } from '@angular/router';


import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { ExtrasPermissionEnum } from 'src/app/shared/constant/extras-permission';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-wages-index',
  templateUrl: './wages-index.component.html',
  styleUrls: ['./wages-index.component.scss'],
  providers: [DatePipe,ConfirmationService]
})
export class WagesIndexComponent implements OnInit ,OnDestroy {
  ExtrasPermission = ExtrasPermissionEnum
  AllWageslist :any[]=[];
  selectedWage;

  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 25;
  // last = 25;
  totalRecords = 0;
  items: MenuItem[];
  cols: any[];
  exportColumns: any[];
  updateStatusModel:UpdateStatus;
  usermodel:UserModel;

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt',  dependedProperty: 'ID', permission: ExtrasPermissionEnum.UpdateWage }
  ];
  columns: Columns[] = [
    
    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '',type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'ExpenseType', header: 'Expense Type', sorting: 'ExpenseType', placeholder: '' , translateCol: 'SSGENERIC.EXPENSETYPE'},
    { field: 'User', header: 'User', sorting: 'User', placeholder: '', translateCol: 'SSGENERIC.USER' },
    { field: 'dAmount', header: 'Amount', sorting: 'dAmount', placeholder: '',type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.AMOUNT'  },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },
    { field: 'CreatedAt', header: 'Date', sorting: 'CreatedAt', placeholder: '',type: TableColumnEnum.DATE_FORMAT , translateCol: 'SSGENERIC.DATE' },

  ];

  globalFilterFields = "['ExpenseType','User','dAmount','Description','CreatedAt']";
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000]
  constructor(private router: Router,private readonly notificationService: NotificationService,
    private apiService: vaplongapi,private datepipe: DatePipe,
    private confirmationService: ConfirmationService,private storageService:StorageService) {
   
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');;
    this.getAllWagesList();
   
    this.cols = [
      { field: 'ExpenseType', header: 'Expense Type' },
      { field: 'User', header: 'User' },
      { field: 'dAmount', header: 'Amount' },
      { field: 'CreatedAt', header: 'Date' },
     
  ];
  this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    this.Update(event.selectedRowData.ID);
  }
  Update(id)
  {
    this.router.navigate(['/extras/managewages',{ ID : id} ]);
  }

  getAllWagesList(){
    this.IsSpinner=true;
     
    this.apiService.GetAllExpenseWages().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode == 0) {
       
         this.AllWageslist = response.AllWagesExpenseList;
         this.totalRecords=response.AllWagesExpenseList.length;
         this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }
  
  AddWage(){
    this.router.navigate(['/extras/managewages',{ ID : 0} ]);
  }
  UpdateExpenseStatus(expense:any) // Update Expense Status Method To Communicate API
  { 
    this.IsSpinner = true;
    
    this.updateStatusModel= new UpdateStatus();
    this.updateStatusModel.ID=expense.ID;
    this.updateStatusModel.Status=expense.IsActive;
    this.updateStatusModel.UpdatedByUserID=this.usermodel.ID;
    this.apiService.UpdateExpenseWageStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Cash Register has been added successfully.');
        this.getAllWagesList();
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

  exportPdf() {

  const doc = new jsPDF()
  autoTable(doc,{
  head: this.exportColumns,
  body: this.AllWageslist},);
  doc.save('Wages.pdf');
    // import("jspdf").then(jsPDF => {
    //     import("jspdf-autotable").then(x => {
    //         const doc = new jsPDF.default('p', 'pt');
    //         doc.autoTable(this.exportColumns, this.AllInvoicelist);
    //         doc.save('products.pdf');
    //     })
    // })
}

exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.AllWageslist);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "SupplierInvoice");
    });
}

saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
}
  
}
