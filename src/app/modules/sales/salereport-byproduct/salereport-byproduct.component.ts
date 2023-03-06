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
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { StorageService } from 'src/app/shared/services/storage.service';


@Component({
  selector: 'app-salereport-byproduct',
  templateUrl: './salereport-byproduct.component.html',
  styleUrls: ['./salereport-byproduct.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class SalereportByproductComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  AllSalelist: any[] = [];
  ProductDropDownInfoList: any[];
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

  valCheck = '';
  ProductSearch = '';
  selectedProductID = '';
  Products: any[];
  filteredProduct: any[];
  selectedProduct: any;
  Quantity;
  Remarks;
  ProductDropdown: SelectItem[];

  dateForDD: any;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  imageBasePath;
  imgSrc = '';
  displayImage = false;


  genericMenuItems: GenericMenuItems[] = [];
  columns: Columns[] = [
    { field: 'ProductImage', header: 'Image', sorting: 'ProductImage', placeholder: '', type: TableColumnEnum.IMAGE, translateCol: 'SSGENERIC.IMAGE' },
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '', translateCol: 'SSGENERIC.PRODUCT' },
    { field: 'ModelNumber', header: 'Model Number', sorting: 'ModelNumber', placeholder: '', translateCol: 'SSGENERIC.PRODUCT' },
    { field: 'SaleQuantity', header: 'Sold Quantity', sorting: 'SaleQuantity', placeholder: '', translateCol: 'SSGENERIC.SOLDQUANTITY' },
    { field: 'TotalSale', header: 'Sale Amount', sorting: 'TotalSale', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.SALEAMOUNT' },
    { field: 'RefundQuantity', header: 'Refunded Quantity', sorting: 'RefundQuantity', placeholder: '', translateCol: 'SSGENERIC.REFUNDQUANTITY' },
    {
      field: 'TotalRefund', header: 'Refunded Amount', sorting: 'TotalRefund', placeholder: '',
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.REFUNDEDAMOUNT'
    },

  ];

  globalFilterFields = ['ModelNumber', 'Product', 'SaleQuantity', 'RefundQuantity', 'TotalRefund', 'TotalSale'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  dataFunc: any = customSearchFn;
  usermodel: any;


  constructor(private apiService: vaplongapi,  private storageService: StorageService,private datepipe: DatePipe) {

    this.imageBasePath = this.apiService.imageBasePath;
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Sale Report Product Wise`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {
    this.GetProductVariantDropDownList(); // Get All ProductVariant List On Page Load for Dropdown
    this.GetSearchByDateDropDownList();

    this.cols = [
      { field: 'Customer', header: 'Customer' },
      { field: 'dTotalSaleValue', header: 'Sale Amount' },
      { field: 'CreatedAt', header: 'Date' },
      { field: 'sRemarks', header: 'Remarks' },

    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  ngOnDestroy(): void {
  }
  emitAction(event) {

  }

  GetProductVariantDropDownList() {

    this.Products = [];
    this.apiService.GetProductDropDownDatawithVariantInfo().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.ProductDropDownInfoList = response.DropDownData;
        for (const item of response.DropDownData) {
          this.Products.push({
            value: item.ProductVariantID,
            label: item.ProducVariantName,
          });

        }
        this.filteredProduct = this.Products;
        this.selectedProduct = {
          value: response.DropDownData[0].ProductVariantID,
          label: response.DropDownData[0].ProducVariantName,
        };
        this.selectedProductID = response.DropDownData[0].ProductVariantID;
        this.getAllSaleList(0);
      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
  }

  deleteOpenSaleByID(id) {
    
    const param = { ID: id };
    this.apiService.DeleteOpenSale(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        
      }
      else {
        
        console.log('internal server error ! not getting api data');
      }
    },
    );
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
  onChangeDate(event: any) {
    if (event.value === '7') {
      this.isCustomDate = true;
    }
    else {
      this.getAllSaleList(this.selectedSearchByDateID);
    }
  }
  RefreshReport() {
    this.getAllSaleList(this.selectedSearchByDateID);
  }
  onSelectProduct(event: any) {
    this.selectedProductID = event.value;
    this.getAllSaleList(this.selectedSearchByDateID);
  }

  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.getAllSaleList(7);
    // console.log(this.fromDate);
  }
  getAllSaleList(dateId) {
    let productDetail = { ProductID: 0, ProductVariantID: 0 };
    // if(this.selectedProduct==''||this.selectedProduct==null)
    // productDetail =  this.ProductDropDownInfoList.filter(y=> y.ProductVariantID===Number(this.selectedProductID))[0];
    // else
    // productDetail =  this.ProductDropDownInfoList.filter(y=> y.ProductVariantID===Number(this.selectedProduct.value))[0];

    productDetail = this.ProductDropDownInfoList.filter(y => y.ProductVariantID === Number(this.selectedProductID))[0];

    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = 0;
    filterRequestModel.PageSize = 10000;
    filterRequestModel.IsGetAll = false;
    // filterRequestModel.IsReceived=true;
    filterRequestModel.ProductID = Number(productDetail.ProductID);
    filterRequestModel.ProductVariantID = Number(productDetail.ProductVariantID);
    dateId = Number(dateId);
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
    this.apiService.GetSaleReportOfProductByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.AllSalelist = response.SaleReportOfProductItemModelList;
        this.totalRecords = response.SaleReportOfProductItemModelList.length;
      }
      else {
        
        console.log('internal server error ! not getting api data');
      }
    },
    );
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

