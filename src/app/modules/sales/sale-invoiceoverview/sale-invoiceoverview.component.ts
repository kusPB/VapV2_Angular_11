import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { datefilter } from 'src/app/Helper/datefilter';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';


import { Columns } from 'src/app/shared/Model/columns.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NotificationService } from '../../shell/services/notification.service';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model';

@Component({
  selector: 'app-sale-invoiceoverview',
  templateUrl: './sale-invoiceoverview.component.html',
  styleUrls: ['./sale-invoiceoverview.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class SaleInvoiceoverviewComponent implements OnInit, OnDestroy {

  AllSalelist: any[] = [];
  OriginalSalelist: any[];
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
    { label: 'Packing List', icon: 'fas fa-print', dependedProperty: 'ID' }

  ];
  columns: Columns[] = [

    { field: 'ID', header: 'Invoice No', sorting: 'ID', placeholder: '', type: TableColumnEnum.REDIRECTION_COLUMN, translateCol: 'SSGENERIC.INVOICENO' },
    { field: 'Customer', header: 'Company', sorting: 'Customer', placeholder: '', translateCol: 'SSGENERIC.COMPANY' },
    {
      field: 'dTotalSaleValue', header: 'Invoice Amount', sorting: 'dTotalSaleValue', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.INVOICEAMOUNT'
    },
    { field: 'CreatedAt', header: 'Date', sorting: 'CreatedAt', placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DATE' },
    { field: 'Type', header: 'Payment Mode', sorting: 'Type', placeholder: '', translateCol: 'SSGENERIC.PAYMENTMODE' },

  ];

  globalFilterFields = ['ID', 'Customer', 'CreatedAt', 'Type', 'dTotalSaleValue'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  printData: any = {};
  environmentData: any;
  SaleDetails: any;
  DeliverToDetails = {
    Number: '',
    Address: ''
  };
  customerDetails = {
    Number: '',
    Address: '',
    CurrentBalance: ''
  };
  printHidden = false;
  constructor(
    private apiService: vaplongapi, private datepipe: DatePipe, public router: Router,
    private notificationService: NotificationService) {
    this.environmentData = environment;
  }

  ngOnInit(): void {
    this.GetSearchByDateDropDownList();
    this.getAllSaleList(6);

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
    if (event.forLabel === 'Packing List') {
      const req = { ID: event.selectedRowData.ID };
      this.apiService.getSaleById(req).pipe(untilDestroyed(this)).subscribe((response1: any) => {
        if (response1.ResponseCode === 0) {
          this.SaleDetails = response1.Sale;
          const saleDetails = [];
          this.SaleDetails.OrderByName = this.SaleDetails.Customer;
          this.customerDetail(this.SaleDetails.CustomerID, true);
          this.customerDetail(this.SaleDetails.DeliveredToID, false);
          // this.SaleDetails.txtSubTotal = response1.Sale.SaleDetails.reduce((sum, current) => sum + current.dTotalValue, 0)
          // this.SaleDetails.txtTotalDiscount = response1.Sale.SaleDetails.reduce((sum, current) => sum + current.dTotalDiscount, 0)
          // this.SaleDetails.txtTotal = (this.SaleDetails.txtSubTotal - this.SaleDetails.txtTotalDiscount +
          //  response1.Sale.ShippingCost).toFixed();
          let subtotal = 0;
          let totalDiscount = 0;
          let grandTotal = 0;
          this.SaleDetails.DeliveredToName = this.SaleDetails.DeliveredTo;
          this.SaleDetails.DeliveryAddress = this.SaleDetails.DeliveryAddress;
          this.DeliverToDetails.Address = this.SaleDetails.DeliveryAddress;
          const shipment = this.SaleDetails.ShippingCost;
          this.SaleDetails.newSaleDetails = [...this.SaleDetails.SaleDetails];
          this.SaleDetails.SaleDetails.forEach(item => {
            subtotal = subtotal + item.dTotalValue;
            totalDiscount = totalDiscount + item.dTotalDiscount;
          });
          grandTotal = subtotal - totalDiscount + shipment;
          const restAmount = grandTotal - this.SaleDetails.dTotalPaidValue;
          this.SaleDetails.dDiscountValue = totalDiscount;
          this.SaleDetails.subTotal = subtotal;
          this.SaleDetails.totalDiscount = totalDiscount;
          this.SaleDetails.shipment = shipment;
          this.SaleDetails.grandTotal = grandTotal;
          this.SaleDetails.restAmount = restAmount;
          // response1.PackingSlip.PackingSlipDetails = saleDetails;
          this.Print();
        }
        else {
          this.notificationService.notify(NotificationEnum.ERROR, 'Error', response1.message);
        }
      });

      // this.Prints(event.selectedRowData.ID);
    }

  }
  customerDetail(customerId, isCustomer: boolean = true) {
    const id = {
      ID: customerId,
    };
    this.apiService.GetCustomerbyID(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        if (isCustomer) {
          this.customerDetails.Number = response.CustomerModel.PhoneNo;
          this.customerDetails.Address = response.CustomerModel.Address;
          this.customerDetails.CurrentBalance = response.CustomerModel.CurrentBalance;
          this.SaleDetails.OrderByCompany = response.CustomerModel.PhoneNo;
          this.SaleDetails.InvoiceAddress = response.CustomerModel.Address;
        } else {
          this.DeliverToDetails.Number = response.CustomerModel.PhoneNo;
          // this.DeliverToDetails.Address = response.CustomerModel.Address;
          this.SaleDetails.DeliveredToCompanyName = response.CustomerModel.PhoneNo;
        }
      }
    });
  }
  Details(event) {
    this.router.navigate(['/sale/sale-detail/' + event.ID]);
  }
  // Prints(id) {

  // }
  RefreshReport() {
    this.getAllSaleList(6);
  }

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
      this.getAllSaleList(this.selectedSearchByDateID);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.getAllSaleList(7);
  }
  getAllSaleList(dateId) {
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
    if (+Type === 0) {
      filterRequestModel.PermissionLevel = 3;
    } else {
      filterRequestModel.PermissionLevel = Type;
    }

    this.apiService.GetAllSalesByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.AllSalelist = response.AllSaleList;
        this.OriginalSalelist = response.AllSaleList;
        this.totalRecords = response.AllSaleList.length;
        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
        // console.log('internal server error ! not getting api data');
      }
    });
  }
  GetSalesByCustomer(event) {

    // tslint:disable-next-line: only-arrow-functions
    this.AllSalelist = this.OriginalSalelist.filter(function (element) { return element.Customer === event.customer; });
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
  Print() {
    setTimeout(() => {
      // use this.printData variable to print data
      // this.printData

      let printContents;
      let popupWin;

      printContents = document.getElementById('printA4-sale-preview-1').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
  <html>
    <head>
      <title>Report</title>
      <style>
      //........Customized style.......
      .sty{
        'width: 67%;color: #000; float: left;text-align: left; margin: 0;font-size: 12px; font-weight: 600;padding-right: 10px;
      }
      </style>
    </head>
<body onload='window.print();self.close();'>${printContents}</body>
  </html>`);
      popupWin.document.close();
    }, 500);
  }
}
