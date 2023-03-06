import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { datefilter } from 'src/app/Helper/datefilter';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { Columns } from 'src/app/shared/Model/columns.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { StorageService } from 'src/app/shared/services/storage.service';


@Component({
  selector: 'app-salerefundreport-index',
  templateUrl: './salerefundreport-index.component.html',
  styleUrls: ['./salerefundreport-index.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class SalerefundreportIndexComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  AllSalelist: any[] = [];
  AllSalelistOriginal: any[] = [];

  printingData: any;
  printingData1: any;

  selectedSale;
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
  Type = 1;

  selectedFilter = 1;

  dateForDD: any;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');

  rowGroup: RowGroup = {
    property: 'CreatedAt',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Details', icon: 'fas fa-info', dependedProperty: 'ID' }
  ];
  columns: Columns[] = [
    { field: 'ID', header: 'Return Invoice No', sorting: 'ID', placeholder: '', type: TableColumnEnum.REDIRECTION_COLUMN, translateCol: 'SSGENERIC.RETURN' },
    {
      field: 'OriginalSaleID', header: 'Original Invoice No', sorting: 'OriginalSaleID', placeholder: '',
      type: TableColumnEnum.REDIRECTION_COLUMN_2, translateCol: 'SSGENERIC.ORIGINAL'
    },
    { field: 'Customer', header: 'Company', sorting: 'Customer', placeholder: '', translateCol: 'SSGENERIC.COMPANY' },
    {
      field: 'dTotalSaleValue', header: 'Sale Price', sorting: 'dTotalSaleValue', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.SALEPRICE'
    },
    {
      field: 'SaleDate', header: 'Sale Date', sorting: 'SaleDate', placeholder: '',
      type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.SALEDATE'
    },
    {
      field: 'CreatedAt', header: 'Refund Date', sorting: 'CreatedAt', placeholder: '',
      type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.REFUNDDATE'
    },
    {
      field: 'OrderType', header: 'Order From', sorting: 'CreatedAt', placeholder: ''
      , translateCol: 'SSGENERIC.ORDERFROM'
    },

  ];

  globalFilterFields = ['ID', 'Customer', 'OriginalSaleID', 'SaleDate', 'CreatedAt', 'dTotalSaleValue'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  usermodel: any;


  constructor(
    private apiService: vaplongapi,private storageService: StorageService, public router: Router, private datepipe: DatePipe, private notificationService: NotificationService) {
      this.usermodel = this.storageService.getItem('UserModel');
      this.storageService.setItem('ReturnSaleDetailRoute', this.router.url);
      const obj = {
        Action: 'View',
        Description: `View Refunded Orders`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {
    this.GetSearchByDateDropDownList();
    this.getAllReturnSaleList(6);

    this.cols = [
      { field: 'CreatedAt', header: 'Date' },
      { field: 'dTotalSaleValue', header: 'Sale Amount' },
      { field: 'Customer', header: 'Company' },

    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    if (event.forLabel === 'Details') {
      this.Details(event.selectedRowData);
    }

  }

  Details(event) {
    // this.PrintingReturnSaleFuntion(event.ID);
    this.router.navigate(['/sale/refundsale-detail/' + event.ID]);

  }
  //   PrintingReturnSaleFuntion(id) {
  //
  //     let req = { ID: id }
  //     this.apiService.GetReturnSaleByID(req).subscribe((response1: any) => {
  //       if (response1.ResponseCode === 0) {

  //         this.printingData1 = response1.ReturnSale;
  //         let saleDetails = [];
  //         this.printingData1.txtSubTotal = response1.ReturnSale.ReturnSaleDetails.reduce((sum, current) => sum + current.dTotalValue, 0)
  //         this.printingData1.txtTotalDiscount = response1.ReturnSale.ReturnSaleDetails.reduce((sum, current) =>
  // sum + current.dTotalDiscount, 0)
  //         this.printingData1.txtTotal = (this.printingData1.txtSubTotal - this.printingData1.txtTotalDiscount ).toFixed();

  //         this.Print1();
  //       }
  //       else {
  //         this.notificationService.notify(NotificationEnum.ERROR, 'Error', response1.message);
  //       }
  //     });
  //   }
  //   Print1() {
  //     setTimeout(() => {


  //       let printContents, popupWin;

  //       printContents = document.getElementById('printA4-sale-refund').innerHTML;
  //       popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  //       popupWin.document.open();
  //       popupWin.document.write(`
  //   <html>
  //     <head>
  //       <title>Report</title>
  //       <style>
  //       //........Customized style.......
  //       .sty{
  //         'width: 67%;color: #000; float: left;text-align: left; margin: 0;font-size: 12px; font-weight: 600;padding-right: 10px;
  //       }
  //       </style>
  //     </head>
  // <body onload='window.print();self.close();'>${printContents}</body>
  //   </html>`);
  //       popupWin.document.close();
  //     }, 500);
  //   }
  OriginalInvoiceID(event) {
    // this.PrintingInvoiceFuntion(event.OriginalSaleID);
    this.router.navigate(['/sale/sale-detail/' + event.OriginalSaleID]);
  }
  //   PrintingInvoiceFuntion(id) {
  //
  //     let req = { ID: id }
  //     this.apiService.GetPackingSlipByID(req).subscribe((response1: any) => {
  //       if (response1.ResponseCode === 0) {
  //         this.printingData = response1.PackingSlip;
  //         let saleDetails = [];
  //         this.printingData.txtSubTotal = response1.PackingSlip.PackingSlipDetails.reduce((sum, current) => sum + current.dTotalValue, 0)
  //         this.printingData.txtTotalDiscount = response1.PackingSlip.PackingSlipDetails.reduce((sum, current) =>
  // sum + current.dTotalDiscount, 0)
  //         this.printingData.txtTotal = (this.printingData.txtSubTotal - this.printingData.txtTotalDiscount +
  // response1.PackingSlip.ShippingCost).toFixed();

  //         response1.PackingSlip.PackingSlipDetails.forEach(item => {
  //           let locs = item.Location.split(',');
  //           if (locs > 1) {
  //             let i = 0;
  //             locs.forEach(item1 => {
  //               if (i === 0) {
  //                 let row = {
  //                   ProductVariantID: item.ProductVariantID,
  //                   ArticalNumber: item.ArticalNumber,
  //                   ProductName: item.ProductName,
  //                   Location: item1.trim(),
  //                   Quantity: item.Quantity,
  //                   dTotalDiscount: item.dTotalDiscount,
  //                   dTotalUnitValue: item.dTotalUnitValue,
  //                   dTotalValue: (item.dTotalValue - item.dTotalDiscount).toFixed(2)
  //                 }
  //                 saleDetails.push(row);
  //               }
  //               else {
  //                 let row1 = {
  //                   ProductVariantID: '-',
  //                   ArticalNumber: '-',
  //                   ProductName: '-',
  //                   Location: item1.trim(),
  //                   Quantity: '-',
  //                   dTotalDiscount: '-',
  //                   dTotalUnitValue: '-',
  //                   dTotalValue: '-',
  //                 }
  //                 saleDetails.push(row1);
  //               }
  //               i++;
  //             });
  //           }
  //           else {

  //             let row2 = {
  //               ProductVariantID: item.ProductVariantID,
  //               ArticalNumber: item.ArticalNumber,
  //               ProductName: item.ProductName,
  //               Location: item.Location.trim(),
  //               Quantity: item.Quantity,
  //               dTotalDiscount: item.dTotalDiscount,
  //               dTotalUnitValue: item.dTotalUnitValue,
  //               dTotalValue: (item.dTotalValue - item.dTotalDiscount).toFixed(2)
  //             }
  //             saleDetails.push(row2);
  //           }
  //         });

  //         response1.PackingSlip.PackingSlipDetails = saleDetails;
  //         this.Print();
  //       }
  //       else {
  //         this.notificationService.notify(NotificationEnum.ERROR, 'Error', response1.message);
  //       }
  //     });
  //   }
  //   Print() {
  //     setTimeout(() => {


  //       let printContents, popupWin;

  //       printContents = document.getElementById('printA4-sale-invoice').innerHTML;
  //       popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  //       popupWin.document.open();
  //       popupWin.document.write(`
  //   <html>
  //     <head>
  //       <title>Report</title>
  //       <style>
  //       //........Customized style.......
  //       .sty{
  //         'width: 67%;color: #000; float: left;text-align: left; margin: 0;font-size: 12px; font-weight: 600;padding-right: 10px;
  //       }
  //       </style>
  //     </head>
  // <body onload='window.print();self.close();'>${printContents}</body>
  //   </html>`);
  //       popupWin.document.close();
  //     }, 500);
  //   }
  GetSearchByDateDropDownList() {

    this.SearchByDateDropdown = [];

    this.SearchByDateDropdown.push({ value: '0', label: 'Today' });
    this.SearchByDateDropdown.push({ value: '1', label: 'Yesterday' });
    this.SearchByDateDropdown.push({ value: '2', label: 'Last7Days' });
    this.SearchByDateDropdown.push({ value: '3', label: 'Last30Days' });
    this.SearchByDateDropdown.push({ value: '4', label: 'ThisMonth' });
    this.SearchByDateDropdown.push({ value: '5', label: 'LastMonth' });
    this.SearchByDateDropdown.push({ value: '6', label: 'All' });
    this.SearchByDateDropdown.push({ value: '7', label: 'Custom' });
    this.selectedSearchByDateID = '6';

  }
  onChangeDate(event: any) {
    if (event.value === '7') {
      this.isCustomDate = true;
    }
    else {
      this.getAllReturnSaleList(this.selectedSearchByDateID);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.getAllReturnSaleList(7);
    // console.log(this.fromDate);
  }


  getAllReturnSaleList(dateId) {
    this.IsSpinner = true;
    const Type = 1;
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = 0;
    filterRequestModel.PageSize = 10000;
    filterRequestModel.IsGetAll = false;

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
    const singleproductprice = 0;
    this.apiService.GetAllReturnSaleByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.AllSalelist = response.AllReturnSaleList;
        this.AllSalelistOriginal = response.AllReturnSaleList;

        this.totalRecords = response.AllReturnSaleList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }
  filterReport() {
   
    if (Number(this.selectedFilter) === 1) {
      this.Type = 1;
      this.AllSalelist = this.AllSalelistOriginal;
    }
    else if (Number(this.selectedFilter) === 2) {
      this.Type = 2;
      this.AllSalelist = this.AllSalelistOriginal.filter(x => x.IsOnlineOrder === true);
    }
    else {
      this.Type = 3;
      this.AllSalelist = this.AllSalelistOriginal.filter(x => x.IsOnlineOrder === false);
    }
  }


  exportPdf() {

    const doc = new jsPDF();
    autoTable(doc, {
      head: this.exportColumns,
      body: this.AllSalelist
    });
    doc.save('SupplierInvoice.pdf');
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
      const worksheet = xlsx.utils.json_to_sheet(this.AllSalelist);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'SupplierInvoice');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

}
