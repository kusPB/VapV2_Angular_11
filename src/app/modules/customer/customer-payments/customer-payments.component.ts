import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { vaplongapi } from '../../../Service/vaplongapi.service';
import { ActivatedRoute, Router } from '@angular/router';


import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { CustomerPermissionEnum } from 'src/app/shared/constant/customer-permission';
import { StorageService } from 'src/app/shared/services/storage.service';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';


@Component({
  selector: 'app-customer-payments',
  templateUrl: './customer-payments.component.html',
  styleUrls: ['./customer-payments.component.scss'],
  providers: [DatePipe, ConfirmationService]
})
export class CustomerPaymentsComponent implements OnInit, OnDestroy {

  @ViewChild('dt') table: Table;
  AllCustomerlist: any[] = [];
  CustomerPermission = CustomerPermissionEnum;
  selectedCustomer;
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
  displaySalePopup = false;

  dateForDD: any;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');


  genericMenuItems: GenericMenuItems[] = [
    // { label: 'Payments', icon: 'fas fa-money', dependedProperty: 'CustomerID', permission: CustomerPermissionEnum.CustomerPayments },
    { label: 'Leadger', icon: 'fas fa-money', dependedProperty: 'CustomerID', permission: CustomerPermissionEnum.ClientLeadger },
    { label: 'Payment Details', icon: 'fas fa-money', dependedProperty: 'CustomerID', permission: CustomerPermissionEnum.CustomerPaymentDetails },

    // {
      // label: 'Clear Direct Payments', icon: 'fas fa-cutlery', dependedProperty: 'CustomerID',
      // permission: CustomerPermissionEnum.ClearDirectPayment
    // },

  ];
  columns: Columns[] = [
    { field: 'sCompanyName', header: 'Company', sorting: 'sCompanyName', placeholder: '',  translateCol: 'SSGENERIC.COMPANY' },
    {
      field: 'FirstName', secondfield: 'LastName', header: 'Customer', sorting: 'FirstName', placeholder: '',
      type: TableColumnEnum.COMBINED_COLUMN, translateCol: 'SSGENERIC.CUSTOMER'
    },
    {
      field: 'CurrentBalance', header: 'Current Balance', sorting: 'CurrentBalance', placeholder: '',
      type: TableColumnEnum.BALANCE_COLUMN, translateCol: 'SSGENERIC.CURRENTB'
    },
  ];

  globalFilterFields = ['sCompanyName', 'FirstName', 'LastName', 'CurrentBalance'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  usermodel: any;


  constructor(private apiService: vaplongapi, private storageService: StorageService,private datepipe: DatePipe, private router: Router) {
    this.usermodel = this.storageService.getItem('UserModel');
      const obj = {
        Action: 'View',
        Description: `View Customer Accounts`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then(x => { }); 
  }

  ngOnInit(): void {
    this.getAllCustomerList();

    this.cols = [
      { field: 'sCompanyName', header: 'Company' },
      { field: 'FirstName', header: 'Customer' },

      { field: 'CurrentBalance', header: 'Current Balance' },
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }
  ngOnDestroy(): void { }
  emitAction(event) {
    if (event.forLabel === 'Payments') {
      this.OpenCustomerPayments(event.selectedRowData.CustomerID);
    }
    else if (event.forLabel === 'Leadger') {
      this.ViewLedger(event.selectedRowData);
    }
    else if (event.forLabel === 'Clear Direct Payments') {
      this.ClearCustomerDirectPayments(event.selectedRowData.CustomerID);
    }
    else if (event.forLabel === 'Payment Details') {
      this.ViewCustomerPayment(event.selectedRowData);
    }
  }

  OpenCustomerPayments(id) {
    this.router.navigate(['/customer/customer-openinvoices', id]);
  }
  ClearCustomerDirectPayments(id) {
    this.router.navigate(['/customer/customer-cleardirectpayment', id]);
  }
  ViewLedger(customer) {
    this.router.navigate(['/customer/customer-ledger', customer.CustomerID, customer.sCompanyName]);
  }
  ViewCustomerPayment(customer) {
    this.router.navigate(['/customer/customer-payment-details', customer.CustomerID, customer.sCompanyName]);
  }

  getAllCustomerList() {
    const filterRequestModel = new FilterRequestModel();
    if(this.usermodel.IsReseller){
      filterRequestModel.IsReseller = true;
      filterRequestModel.ResellerID = this.usermodel.ID;
    }
    else
    {
      filterRequestModel.IsReseller = false;
      filterRequestModel.ResellerID = 0;
    }
    
    this.apiService.GetAllbyFilter(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode == 0) {

        this.AllCustomerlist = response.AllCustomerList;
        this.totalRecords = response.AllCustomerList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }

  DirectPayments() {
    this.router.navigate(['/customer/direct-payment']);
  }
  AddBalance() {
    this.router.navigate(['/customer/balance-payment']);
  }
  AddPaymentNew() {
    this.router.navigate(['/customer/payments-new']);
  }
  exportPdf() {

    const doc = new jsPDF()
    autoTable(doc, {
      head: this.exportColumns,
      body: this.AllCustomerlist
    });
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
      const worksheet = xlsx.utils.json_to_sheet(this.AllCustomerlist);
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

