import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { datefilter } from '../../../Helper/datefilter';
import { vaplongapi } from '../../../Service/vaplongapi.service';
import { FilterRequestModel } from '../../../Helper/models/FilterRequestModel';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';

import { Router } from '@angular/router';
import { Columns } from 'src/app/shared/Model/columns.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model'; import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { StorageService } from 'src/app/shared/services/storage.service';

declare let require: any;
const FileSaver = require('file-saver');
@Component({
  selector: 'app-return-purchase-report',
  templateUrl: './return-purchase-report.component.html',
  styleUrls: ['./return-purchase-report.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class ReturnPurchaseReportComponent implements OnInit, OnDestroy {


  PurchaseTableModel: any[] = [];
  AllPurchaseReturnlist: any[] = [];
  selectedPurchase;
  selectedPurchaseReturn;
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
  totalRecords1 = 0;
  items: MenuItem[];
  cols: any[];
  exportColumns: any[];
  displayPurchasePopup = false;

  dateForDD: any;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');

  genericMenuItems: GenericMenuItems[] = [
    { label: 'View Detail', icon: 'fas fa-info', dependedProperty: 'ID' }
  ];

  rowGroup: RowGroup = {
    property: 'CreatedAt',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };

  columns: Columns[] = [
    {
      field: 'SuppierInvoiceNo', header: ' Invoice No', sorting: 'SuppierInvoiceNo',
      placeholder: '', type: TableColumnEnum.REDIRECTION_COLUMN, translateCol: 'SSGENERIC.INVOICENO'
    },
    { field: 'Supplier', header: 'Supplier', sorting: 'Supplier', placeholder: '' },
    {
      field: 'dTotalPurchaseValue', header: 'Purchase Price',
      sorting: 'dTotalPurchaseValue', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL,
      translateCol: 'SSGENERIC.PURCHASEPRICE'
    },
    {
      field: 'PurchaseDate', header: 'Purchase Date', sorting: 'PurchaseDate',
      placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.PURCHASEDATE'
    },
    {
      field: 'CreatedAt', header: 'Refund Date', sorting: 'CreatedAt',
      placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.REFUNDDATE'
    },
  ];

  globalFilterFields = ['SupplierInvoice', 'Supplier', 'InvoiceDate', 'dTotalOriginalAmount', 'dPaidAmount', 'dRemainingAmount', 'dTotalReturnedAmount'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];

  genericMenuItems1: GenericMenuItems[] = [];

  columns1: Columns[] = [
    { field: 'ID', header: 'Order No', sorting: 'ID', placeholder: '', type: TableColumnEnum.REDIRECTION_COLUMN },
    { field: 'Supplier', header: 'Supplier', sorting: 'Supplier', placeholder: '' },
    {
      field: 'dTotalPurchaseValue', header: 'Purchase Price', sorting: 'dTotalPurchaseValue', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL
    },
    {
      field: 'dTotalPaidValue', header: 'Paid Amount ', sorting: 'dTotalPaidValue', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL
    },
    { field: 'PurchaseDate', header: 'Date', sorting: 'PurchaseDate', placeholder: '' },

  ];
  globalFilterFields1 = ['ID', 'Supplier', 'dTotalPaidValue', 'dTotalPurchaseValue', 'PurchaseDate'];


  constructor(
    private apiService: vaplongapi, private datepipe: DatePipe, public router: Router,
    private notificationService: NotificationService, private storageService: StorageService) {
      this.storageService.setItem('PurchaseDetailRoute', this.router.url);
      this.storageService.setItem('ReturnPurchaseDetailRoute', this.router.url);

  }

  ngOnInit(): void {
    this.GetSearchByDateDropDownList();
    this.getAllReturnPurchaseList(0);
    this.items = [

    ];

  }
  ngOnDestroy(): void {

  }

  emitAction(event) {
    if (event.forLabel === 'View Detail') {
      this.Details(event.selectedRowData.ID);
    }
  }

  emitAction1(event) {
  }
  PurchaseDetails(event) {
    this.router.navigate([`/purchase/details/${event.ID}`]);
  }
  Details(ID) {
    this.router.navigate([`/purchase/return-details/${ID}`]);
  }

  GetSearchByDateDropDownList() {

    this.SearchByDateDropdown = [];

    this.SearchByDateDropdown.push({ value: '0', label: 'Today' });
    this.SearchByDateDropdown.push({ value: '1', label: 'Yesterday' });
    this.SearchByDateDropdown.push({ value: '2', label: 'Last7Days' });
    this.SearchByDateDropdown.push({ value: '3', label: 'Last30Days' });
    this.SearchByDateDropdown.push({ value: '4', label: 'ThisMonth' });
    this.SearchByDateDropdown.push({ value: '5', label: 'LastMonth' });
    // this.SearchByDateDropdown.push({value:'6',label: 'All'});
    this.SearchByDateDropdown.push({ value: '7', label: 'Custom' });
    this.selectedSearchByDateID = '0';

  }
  SearchByDate(event: any) {
    if (event.value === '7') {
      this.isCustomDate = true;
    }
    else {
      this.getAllReturnPurchaseList(this.selectedSearchByDateID);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.getAllReturnPurchaseList(7);
  }
  onChangeDate(event: any) {
    this.getAllReturnPurchaseList(event.value);
  }
  getAllReturnPurchaseList(dateId) {
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    // filterRequestModel.SubCategoryID=0;
    filterRequestModel.PageNo = 0;
    filterRequestModel.PageSize = 10000;
    filterRequestModel.IsGetAll = false;
    // filterRequestModel.IsReceived=true;
   
    dateId=Number(dateId);
    if (dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(dateId);
      filterRequestModel.IsGetAll = daterequest.IsGetAll;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss'));
      filterRequestModel.FromDate = new Date(this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss'));
    }
    else {
      filterRequestModel.IsGetAll = false;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss'));
      filterRequestModel.FromDate = new Date(this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss'));
    }

    this.apiService.GetAllReturnPurchaseByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.AllPurchaseReturnlist = response.AllReturnPurchaseList.sort((a, b) => a.CreatedAt > b.CreatedAt ? -1 : 1);
        this.totalRecords = response.AllReturnPurchaseList.length;
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
      }
    });
  }

  getPurchasesBySupplierInvoiceNo(event) {
    this.displayPurchasePopup = true;
    this.GetAllPurchasesBySupplierInvoiceNO(event.SuppierInvoiceNo);
  }
  GetAllPurchasesBySupplierInvoiceNO(invoiceNo) {
    this.IsSpinner = true;
    let singleproductprice = 0;

    const params = {
      SupplierInvoiceNo: invoiceNo,
    };
    this.apiService.GetAllBySupplierInvoiceNO(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        response.AllPurchaseList.forEach(element => {
          element.PurchasesDetails.forEach(element1 => {
            singleproductprice = element1.dTotalAmount.Value / element1.Quantity.Value;
            element1.OriginalQuantity = element1.Quantity;
            element1.Quantity = element1.Quantity - element1.ReturnedQuantity;
            element1.dTotalAmount = singleproductprice * element1.Quantity;
          });
          element.PurchaseDateString = element.PurchaseDate;
        });

        this.PurchaseTableModel = response.AllPurchaseList;
        this.totalRecords1 = response.AllPurchaseList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
      }
    },
    );
  }

  exportPdf() {

    const doc = new jsPDF();
    autoTable(doc, {
      head: this.exportColumns,
      body: this.AllPurchaseReturnlist
    });
    doc.save('returnPurchaseReport.pdf');
    // import('jspdf').then(jsPDF => {
    //     import('jspdf-autotable').then(x => {
    //         const doc = new jsPDF.default('p', 'pt');
    //         doc.autoTable(this.exportColumns, this.AllInvoicelist);
    //         doc.save('products.pdf');
    //     })
    // })
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.AllPurchaseReturnlist);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'SupplierInvoice');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    // tslint:disable-next-line: no-shadowed-variable
    import('file-saver').then((FileSaver) => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });

  }

}
