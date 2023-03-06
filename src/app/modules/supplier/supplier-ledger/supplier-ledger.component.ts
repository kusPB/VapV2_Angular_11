import { Component,OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import {  MenuItem, SelectItem, ConfirmationService  } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import jsPDF from 'jspdf';
import autoTable  from  'jspdf-autotable';
import { DatePipe } from '@angular/common';
import {UpdateStatus } from 'src/app/Helper/models/UpdateStatus';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { ActivatedRoute, Router } from '@angular/router';


import { Columns } from 'src/app/shared/Model/columns.model';

import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model';

import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { StorageService } from 'src/app/shared/services/storage.service';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';


@Component({
  selector: 'app-supplier-ledger',
  templateUrl: './supplier-ledger.component.html',
  styleUrls: ['./supplier-ledger.component.scss'],
  providers: [DatePipe,ConfirmationService]

})
export class SupplierLedgerComponent implements OnInit ,OnDestroy{

  AllSupplierlist :any[]=[];

  selectedSupplier;
  SearchByDateDropdown: SelectItem[];
  selectedSearchByDateID = '';
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
  displaySalePopup=false;

  dateForDD: any;
  isCustomDate=false;
  fromDate=this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate=this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');

  usermodel : UserModel;
  updateStatusModel : UpdateStatus;

  txtSupplier:string='';
  txtPreviousBalance:string='0.00';
  txtCurrentBalance:string='0.00';
  filterRequestModel : FilterRequestModel;
  routeID:any;
  routeName:any;

  rowGroup: RowGroup = {
    property: 'CreatedAt',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  
  genericMenuItems: GenericMenuItems[] = [
   
  ];
  columns: Columns[] = [
    { field: 'CreatedAt', header: 'Date', sorting: 'CreatedAt', placeholder: '',type: TableColumnEnum.DATE_FORMAT },
    { field: 'ExchangeRate', header: 'Exchange Currency', sorting: 'ExchangeRate', placeholder: '' },
    { field: 'CurrentExchangeRate', header: 'Current Exchange Rate', sorting: 'CurrentExchangeRate', placeholder: '' },
    { field: 'dCredit', header: 'Credit', sorting: 'dCredit', placeholder: '',type: TableColumnEnum.CURRENCY_SYMBOL },
    { field: 'dCreditFC', header: 'Credit (in EC)', sorting: 'dCreditFC', placeholder: '',type: TableColumnEnum.CURRENCY_SYMBOL },
    { field: 'dDebit', header: 'Debit', sorting: 'dDebit', placeholder: '',type: TableColumnEnum.CURRENCY_SYMBOL },
    { field: 'dDebitFC', header: 'Debit (in EC)', sorting: 'dDebitFC', placeholder: '',type: TableColumnEnum.CURRENCY_SYMBOL},
    { field: 'CurrentBalance', header: 'Current Balance', sorting: 'CurrentBalance', placeholder: '',type: TableColumnEnum.BALANCE_COLUMN },
    { field: 'CurrentBalanceFC', header: 'Current Balance (in EC)', sorting: 'CurrentBalanceFC', placeholder: '',type: TableColumnEnum.BALANCE_COLUMN },
  ];

  globalFilterFields = "['CreatedAt','ExchangeRate','CurrentExchangeRate','dCredit','dCreditFC','dDebit','dDebitFC','CurrentBalance','CurrentBalanceFC']";
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000]

  constructor(private apiService: vaplongapi, private datepipe: DatePipe,
    private route: ActivatedRoute,private router: Router,private storageService:StorageService) {
    
    this.routeID = this.route.snapshot.params.id;
    this.routeName = this.route.snapshot.params.name;
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Supplier Ledger`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');;
    this.getAllSupplierLedgerList(this.routeID,this.routeName);
  }

  ngOnDestroy(): void{}
  emitAction(event) {
   
  }
 

  getAllSupplierLedgerList(ID,Name){
    this.filterRequestModel = new FilterRequestModel();
    this.filterRequestModel.PageNo = 0;
    this.filterRequestModel.PageSize = 100000;
    this.filterRequestModel.ID = Number(ID);
    this.filterRequestModel.IsGetAll = true;
    this.filterRequestModel.FromDate =new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    this.filterRequestModel.ToDate =new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    
    this.apiService.GetSupplierLeadgerByFilter(this.filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode == 0) {
        
          this.AllSupplierlist = response.AllTransactionList;
          this.totalRecords = this.AllSupplierlist.length;
          this.txtSupplier = Name;
          this.txtPreviousBalance = response.PreviousBalance;
          this.txtCurrentBalance = response.CurrentBalance;
          this.IsSpinner = false;
  
      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }
  
  CloseThis(){
    this.router.navigate(['/supplier/supplier-payments']);
  }
  
  
  exportPdf() {

  const doc = new jsPDF()
  autoTable(doc,{
  head: this.exportColumns,
  body: this.AllSupplierlist},);
  doc.save('SupplierInvoice.pdf');
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
        const worksheet = xlsx.utils.json_to_sheet(this.AllSupplierlist);
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

