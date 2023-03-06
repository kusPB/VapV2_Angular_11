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

import { NotificationService } from 'src/app/modules/shell/services/notification.service';

import { Columns } from 'src/app/shared/Model/columns.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { SalesPermissionEnum } from 'src/app/shared/constant/sales-permission';
import { StorageService } from 'src/app/shared/services/storage.service';


@Component({
  selector: 'app-sale-index',
  templateUrl: './sale-index.component.html',
  styleUrls: ['./sale-index.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class SaleIndexComponent implements OnInit, OnDestroy {
  AllSalelist: any[] = [];
  salesPermission = SalesPermissionEnum;
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
  allCols: any[];
  exportColumns: any[];
  displaySalePopup = false;
  TotalQuantity = 0;
  selectedColumns: string[];
  dateId = 6;
  filterModel = {
    PageNo: 0,    
    PageSize: 25,
    Product: '',
  };
  // rowGroup: RowGroup = {
  //   property: 'CreatedAt',
  //   enableRowGroup: true,
  //   propertyType: RowGroupTypeEnum.DATE
  // };
  dateForDD: any;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  SaleDetails: any;
  printingData: any;
  printingData1: any;
  customerDetails = {
    Number: '',
    Address: '',
    CurrentBalance: ''
  };
  DeliverToDetails = {
    Number: '',
    Address: ''
  };
  genericMenuItems: GenericMenuItems[] = [
    { label: 'View Detail', icon: 'fas fa-info', dependedProperty: 'ID' },
    { label: 'Update', icon: 'fas fa-edit', dependedProperty: 'ID', permission: SalesPermissionEnum.AddSale, permissionDisplayProperty: 'showUpdate' },
    { label: 'Refund', icon: 'fas fa-undo', dependedProperty: 'ID', permission: SalesPermissionEnum.AddSale, permissionDisplayProperty: 'showRefund' }

  ];

  rowGroup: RowGroup = {
    property: 'CreatedAt',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };

  columns: Columns[] = [

    {
      field: 'ID', header: 'Invoice No', sorting: 'ID', searching: true, placeholder: '', type: TableColumnEnum.REDIRECTION_COLUMN,
      translateCol: 'SSGENERIC.INVOICENO'
    },
    {
      field: 'Customer', header: 'Company', sorting: 'Customer', searching: true, placeholder: '',
      translateCol: 'SSGENERIC.COMPANY'
    },
    {
      field: 'SaleDate', header: 'Date', sorting: 'SaleDate', searching: true, placeholder: '',
      type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DATE'
    },
    {
      field: 'dTotalSaleValue', header: 'Invoice Amount', sorting: 'dTotalSaleValue', searching: true,
      placeholder: '', permission: SalesPermissionEnum.AmountAndPaymentColumninSaleOverview,
      type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.INVOICEAMOUNT'
    },
    {
      field: 'dTotalPaidValue', header: 'Paid Amount', sorting: 'dTotalPaidValue', searching: true,
      placeholder: '',permission: SalesPermissionEnum.AmountAndPaymentColumninSaleOverview, type: TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.PAIDAMOUNT'
    },
    { field: 'Outlet', header: 'Outlet', sorting: 'Outlet', searching: true, placeholder: '', translateCol: 'SSGENERIC.OUTLET' },
    { field: 'UserName', header: 'User Name', sorting: 'UserName', searching: true, placeholder: '', translateCol: 'SSGENERIC.USERNAME' },
    {
      field: 'IsOnlineOrder', header: 'Order From', sorting: 'IsOnlineOrder', searching: true, placeholder: '', 
      type: TableColumnEnum.ORDER_TYPE, translateCol: 'SSGENERIC.ORDERFROM'
    },
    {
      field: 'IsPrinted', header: 'Print Status', sorting: '',  placeholder: '', type: TableColumnEnum.PRINT_STATUS,
      translateCol: 'SSGENERIC.PRINTSTATUS'
    },
    {
      field: 'ID', header: 'Printing', sorting: '',  placeholder: '', type: TableColumnEnum.SALEPRINTING_BUTTON,
      translateCol: 'SSGENERIC.PRINTING'
    },
   
  ];

  globalFilterFields = ['ID', 'Customer', 'UserName', 'Outlet', 'Suppier', 'CreatedAt', 'dTotalPaidValue', 'dTotalSaleValue'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  users: any = [];
  usermodel: any;

  constructor(
    private apiService: vaplongapi, private datepipe: DatePipe,
    private notificationService: NotificationService, public router: Router,private storageService: StorageService) {
      this.storageService.setItem('AddReceiptNewRoute', this.router.url);
      this.storageService.setItem('SaleDetailRoute', this.router.url);
      this.usermodel = this.storageService.getItem('UserModel');

      const obj = {
        Action: 'View',
        Description: `View Sale Invoices`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then(x => { });

  }

  async ngOnInit() {
    const res: any = await this.apiService.GetAllUsers().toPromise();
    if (res.ResponseCode === 0) {
      this.users = res.AllUsersList;
    }
    this.GetSearchByDateDropDownList();
  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    if (event.forLabel === 'View Detail') {
      this.Details(event.selectedRowData);
    }
    else if (event.forLabel === 'Update') {
      this.Update(event.selectedRowData);
    }
    else if (event.forLabel === 'Refund') {
      this.Refund(event.selectedRowData);
    }
  }
  Details(event) {
    this.router.navigate(['/sale/sale-detail/' + event.ID]);
    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree(['/sale/sale-detail/' + event.ID])
    // );
  
    // window.open(url, '_blank');
  }
  Refund(event) {
    this.router.navigate(['/sale/add-sale-refund/' + event.ID]);
  }
  Update(event) {
    this.router.navigate(['/sale/update-sale-detail/' + event.ID]);
  }
  PrintSalePackingList(event) {
    this.GetPackingListDataFunction(event.ID);
  }
  PrintSalePackingSlip(event){
    this.GetPackingSlipDataFunction(event.ID)
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

      // this.getAllSaleList(this.selectedSearchByDateID);
      this.dateId = Number(this.selectedSearchByDateID);
      this.GetAllSaleDataWithLazyLoadinFunction(this.filterModel);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;

    // this.getAllSaleList(7);
    this.dateId = 7;
    this.GetAllSaleDataWithLazyLoadinFunction(this.filterModel);
  }

  GetAllSaleDataWithLazyLoadinFunction(filterRM) {
    // this.stockRequestModel.Search = filterRM.Product;
    const Type = 1;
    // const filterRequestModel = new FilterRequestModel();
    // const filterRequestModel = new FilterRequestModel(
    //   -1, -1, -1, -1, -1, -1, -1, -1, new Date(), new Date(), 150000, 0, true, true,
    //   -1, -1, -1, false, false, false, '', '', false, false, -1, -1, false, false, '', ''
    // );
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.IsReceived = true;
    filterRequestModel.IsIncomingOrder = false; // this set false for showing only system orders not online orders

    filterRequestModel.Product = filterRM.Product;

    if (+Type === 0) {
      filterRequestModel.PermissionLevel = 3;
    } else {
      filterRequestModel.PermissionLevel = Type;
    }

    if (this.dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(this.dateId);
      filterRequestModel.IsGetAll = daterequest.IsGetAll;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss'));
      filterRequestModel.FromDate = new Date(this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss'));
    }
    else {
      filterRequestModel.IsGetAll = false;
      // filterRequestModel.ToDate = new Date(this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss'));
      // filterRequestModel.FromDate = new Date(this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss'));
      filterRequestModel.ToDate = new Date(this.datepipe.transform(this.toDate,'yyyy-MM-ddTHH:mm:ss' ));
      filterRequestModel.FromDate = new Date(this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss'));
      //let time = new Date().getTime();
      //filterRequestModel.ToDate.setTime(time);
      //filterRequestModel.FromDate.setTime(time);
    }
    
    if(this.usermodel.IsReseller){
      filterRequestModel.IsReseller = true;
      filterRequestModel.ResellerID = this.usermodel.ID;
    }
    else
    {
      filterRequestModel.IsReseller = false;
      filterRequestModel.ResellerID = 0;
    }
    
    this.apiService.GetAllSalesByFiltersTotalCount(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        
        this.totalRecords = response.TotalRowCount;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    },
    );
    this.apiService.GetAllSalesByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        
        response1.AllSaleList.forEach(element => {
          element.showUpdate = (element.dTotalPaidValue > 0 || element.ReturnedTyped === 2) ? false : true;
          element.showRefund = element.ReturnedTyped === 1 ? false : true;
          const user = this.users.find(x => x.ID === element.CreatedByUserID);
          element.UserName = !user ? 'N/A' : `${user.FirstName} ${user.LastName}`;
        });
        //this.AllSalelist = response1.AllSaleList.filter(x => x.IsOnlineOrder === false);
        this.AllSalelist = response1.AllSaleList;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    },
    );



  }

  OpenAllNotPrinted(filterRM) {
    const Type = 1;
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = 0;
    filterRequestModel.PageSize = 25;
    filterRequestModel.IsGetAll = true;
    filterRequestModel.IsReceived = true;
    filterRequestModel.IsIncomingOrder = false; // this set false for showing only system orders not online orders

    filterRequestModel.Product = "";

    if (+Type === 0) {
      filterRequestModel.PermissionLevel = 3;
    } else {
      filterRequestModel.PermissionLevel = Type;
    }

    if(this.usermodel.IsReseller){
      filterRequestModel.IsReseller = true;
      filterRequestModel.ResellerID = this.usermodel.ID;
    }
    else
    {
      filterRequestModel.IsReseller = false;
      filterRequestModel.ResellerID = 0;
    }

    this.apiService.GetAllIDsForPrinting(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {  
        response1.AllSaleList.forEach(element => {
          const url = this.router.serializeUrl(
              this.router.createUrlTree(['/sale/sale-detail/' + element.ID])
            );  
            window.open(url, '_blank');
        }); 
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }
  // getAllSaleList(dateId){
  //   this.IsSpinner=true;
  //   const Type =1;
  //   const filterRequestModel = new FilterRequestModel();

  //     filterRequestModel.FromDate=new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
  //     filterRequestModel.ToDate=new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
  //     filterRequestModel.SubCategoryID=0;
  //     filterRequestModel.PageNo= 0;
  //     filterRequestModel.PageSize=10000;
  //     filterRequestModel.IsGetAll=false;
  //     filterRequestModel.IsReceived=true;

  //     if (Type === 0)
  //     filterRequestModel.PermissionLevel = 3;
  //     else
  //     filterRequestModel.PermissionLevel = Type;

  //     if (dateId !== 7)
  //     {
  //         const daterequest = datefilter.GetDateRangeByDropdown(dateId);
  //         filterRequestModel.IsGetAll = daterequest.IsGetAll;
  //         filterRequestModel.ToDate = new Date(this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss'));
  //         filterRequestModel.FromDate = new Date(this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss'));
  //     }
  //     else
  //     {
  //       filterRequestModel.IsGetAll = false;
  //       filterRequestModel.ToDate =new Date(this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss'));
  //       filterRequestModel.FromDate = new Date(this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss'));
  //     }
  //   this.apiService.GetAllSalesByFilters(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
  //     if (response.ResponseCode === 0) {
  //       response.AllSaleList.forEach(element => {
  //         element.SaleDetails.forEach(element1 => {
  //         element1.OriginalQuantity = element1.Quantity;
  //         element1.Quantity = element1.Quantity - element1.ReturnedQuantity;
  //         element1.dTotalAmount = element1.dTotalUnitValue * element1.Quantity;

  //        });
  //      });
  //        this.AllSalelist = response.AllSaleList.filter(x=>x.IsOnlineOrder===false);
  //        this.totalRecords=response.AllSaleList.length;
  //        this.IsSpinner = false;

  //     }
  //     else {
  //       this.IsSpinner = false;
  //       console.log('internal server error ! not getting api data');
  //     }
  //   },
  //   );
  // }

  PrintingInvoiceFuntion(id) {
    const req = { ID: id };
    this.apiService.GetPackingSlipByID(req).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        this.printingData1 = response1.PackingSlip;
        const saleDetails = [];
        this.printingData1.txtSubTotal = response1.PackingSlip.PackingSlipDetails.reduce((sum, current) => sum + current.dTotalValue, 0);
        this.printingData1.txtTotalDiscount = response1.PackingSlip.PackingSlipDetails.reduce((sum, current) =>
          sum + current.dTotalDiscount, 0);
        this.printingData1.txtTotal = (this.printingData1.txtSubTotal - this.printingData1.txtTotalDiscount +
          response1.PackingSlip.ShippingCost).toFixed();

        response1.PackingSlip.PackingSlipDetails.forEach(item => {
          const locs = item.Location.split(',');
          if (locs > 1) {
            let i = 0;
            locs.forEach(item1 => {
              if (i === 0) {
                const row = {
                  ProductVariantID: item.ProductVariantID,
                  ArticalNumber: item.ArticalNumber,
                  ProductName: item.ProductName,
                  Location: item1.trim(),
                  Quantity: item.Quantity,
                  dTotalDiscount: item.dTotalDiscount,
                  dTotalUnitValue: item.dTotalUnitValue,
                  dTotalValue: (item.dTotalValue - item.dTotalDiscount).toFixed(2)
                };
                saleDetails.push(row);
              }
              else {
                const row1 = {
                  ProductVariantID: '-',
                  ArticalNumber: '-',
                  ProductName: '-',
                  Location: item1.trim(),
                  Quantity: '-',
                  dTotalDiscount: '-',
                  dTotalUnitValue: '-',
                  dTotalValue: '-',
                };
                saleDetails.push(row1);
              }
              i++;
            });
          }
          else {

            const row2 = {
              ProductVariantID: item.ProductVariantID,
              ArticalNumber: item.ArticalNumber,
              ProductName: item.ProductName,
              Location: item.Location.trim(),
              Quantity: item.Quantity,
              dTotalDiscount: item.dTotalDiscount,
              dTotalUnitValue: item.dTotalUnitValue,
              dTotalValue: (item.dTotalValue - item.dTotalDiscount).toFixed(2)
            };
            saleDetails.push(row2);
          }
        });

        response1.PackingSlip.PackingSlipDetails = saleDetails;
        this.Print();
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response1.message);
      }
    });
  }
  Print() {
    setTimeout(() => {


      let printContents;
      let popupWin;

      printContents = document.getElementById('printA4-sale-invoice').innerHTML;
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

  
  AddSaleOrderNew() {
    this.router.navigate(['/sale/add-receipt-new']);
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

  GetPackingListDataFunction(id) {
    const req = { ID: id };
    this.apiService.getSaleById(req).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        this.SaleDetails = response1.Sale;
        const saleDetails = [];
        //this.IsPrinted = this.SaleDetails.IsPrinted;
        this.SaleDetails.OrderByName = this.SaleDetails.Customer;
        this.customerDetail(this.SaleDetails.CustomerID, true);
        this.customerDetail(this.SaleDetails.DeliveredToID, false);
        
        let subtotal = 0;
        let totalDiscount = 0;
        let grandTotal = 0;
        this.SaleDetails.DeliveredToName = this.SaleDetails.DeliveredTo;
        
        this.SaleDetails.InvoiceAddress = this.SaleDetails.InvoiceAddress?.split("  ").join(" ").toLowerCase();
        let countryName = this.SaleDetails.InvoiceAddress?.split(",")[1];
        let fullAddress = this.SaleDetails.InvoiceAddress?.split(",")[0].replace(countryName, "");
        this.SaleDetails.InvoiceAddress = fullAddress.trim()+","+countryName;

        this.SaleDetails.DeliveryAddress = this.SaleDetails.DeliveryAddress?.split("  ").join(" ").toLowerCase();
        let countryName1 = this.SaleDetails.DeliveryAddress?.split(",")[1];
        let fullAddress1 = this.SaleDetails.DeliveryAddress?.split(",")[0].replace(countryName1, "");
        this.SaleDetails.DeliveryAddress = fullAddress1.trim()+","+countryName1;

        const shipment = Number(this.SaleDetails.ShippingCost);
        this.SaleDetails.SaleDetails.forEach(item => {
          let location ='';
          item.SaleDetailNonTrackableLocations.forEach(element => {
            location += element.Location +' '+element.Quantity+' Qty, ';
          });
          item.Location = location;
          subtotal = subtotal + Number(item.dTotalValue);
          totalDiscount = totalDiscount + Number(item.dTotalDiscount);
          item.display = false;
        });
        this.SaleDetails.newSaleDetails = [...this.SaleDetails.SaleDetails];
        grandTotal = subtotal - totalDiscount + shipment;
        const restAmount = grandTotal - Number(this.SaleDetails.dTotalPaidValue);
        this.SaleDetails.dDiscountValue = totalDiscount.toFixed(2);
        this.SaleDetails.subTotal = subtotal.toFixed(2);
        this.SaleDetails.totalDiscount = totalDiscount.toFixed(2);
        this.SaleDetails.shipment = shipment.toFixed(2);
        this.SaleDetails.grandTotal = grandTotal.toFixed(2);
        this.SaleDetails.restAmount = restAmount.toFixed(2);
        
        this.sortOn(this.SaleDetails.newSaleDetails,'Location');
        this.TotalQuantity = this.SaleDetails.newSaleDetails.reduce((accumulator, value) => { return accumulator + value.Quantity; }, 0); 
        this.PrintPackingList(id);

      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response1.message);
      }
    });
  }
  customerDetail(customerId, isCustomer: boolean = true) {
    const req = {
      ID: customerId,
    };
    this.apiService.GetCustomerbyID(req).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        if (isCustomer) {
          this.customerDetails.Number = response.CustomerModel.PhoneNo;
          this.customerDetails.Address = response.CustomerModel.Address;
          this.customerDetails.CurrentBalance = response.CustomerModel.CurrentBalance;
          this.SaleDetails.OrderByCompany = response.CustomerModel.PhoneNo;
          //this.SaleDetails.InvoiceAddress = response.CustomerModel.Address;
        } else {
          this.DeliverToDetails.Number = response.CustomerModel.PhoneNo;
          this.DeliverToDetails.Address = response.CustomerModel.Address;
          this.SaleDetails.DeliveredToCompanyName = response.CustomerModel.PhoneNo;
        }
      }
    });
  }
  PrintPackingList(SaleId) {
    const request = {
      ID: SaleId,
      Status:true,
      UpdatedByUserID:1,
    };
    this.apiService.UpdatePrintingStatus(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        setTimeout(() => {
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

        this.GetAllSaleDataWithLazyLoadinFunction(this.filterModel);
      }
    });
   
  }

  GetPackingSlipDataFunction(id) {
    
    const req = { ID: id };
    this.apiService.GetPackingSlipByID(req).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        response1.PackingSlip.InvoiceAddress = response1.PackingSlip.InvoiceAddress?.split("  ").join(" ").toLowerCase();
        response1.PackingSlip.ShippingAddress = response1.PackingSlip.ShippingAddress?.split("  ").join(" ").toLowerCase();

        let countryName = response1.PackingSlip.InvoiceAddress?.split(",")[1];
        let fullAddress = response1.PackingSlip.InvoiceAddress?.split(",")[0].replace(countryName, "");
        response1.PackingSlip.InvoiceAddress = fullAddress.trim()+","+countryName;

        let countryName1 = response1.PackingSlip.ShippingAddress?.split(",")[1];
        let fullAddress1 = response1.PackingSlip.ShippingAddress?.split(",")[0].replace(countryName1, "");
        response1.PackingSlip.ShippingAddress = fullAddress1.trim()+","+countryName1;
        
        //this.IsPrinted = response1.PackingSlip.IsPrinted;
        const saleDetails = [];
        response1.PackingSlip.PackingSlipDetails.forEach(item => {
          const locs = item.Location.split(',');
          if (locs > 1) {
            let i = 0;
            locs.forEach(item1 => {
              if (i === 0) {
                const row = {
                  ProductVariantID: item.ProductVariantID,
                  ArticalNumber: item.ArticalNumber,
                  BLabel : item.BLabel,
                  ProductName: item.ProductName,
                  Location: item1.trim(),
                  Quantity: item.Quantity,
                  dTotalDiscount: item.dTotalDiscount,
                  dTotalUnitValue: item.dTotalUnitValue,
                  dTotalValue: (item.dTotalValue - item.dTotalDiscount).toFixed(2)
                };
                saleDetails.push(row);
              }
              else {
                const row1 = {
                  ProductVariantID: '-',
                  ArticalNumber: '-',
                  BLabel : '-',
                  ProductName: '-',
                  Location: item1.trim(),
                  Quantity: '-',
                  dTotalDiscount: '-',
                  dTotalUnitValue: '-',
                  dTotalValue: '-',
                };
                saleDetails.push(row1);
              }
              i++;
            });
          }
          else {

            const row2 = {
              ProductVariantID: item.ProductVariantID,
              ArticalNumber: item.ArticalNumber,
              ProductName: item.ProductName,
              BLabel : item.BLabel,
              Location: item.Location.trim(),
              Quantity: item.Quantity,
              dTotalDiscount: item.dTotalDiscount,
              dTotalUnitValue: item.dTotalUnitValue,
              dTotalValue: (item.dTotalValue - item.dTotalDiscount).toFixed(2)
            };
            saleDetails.push(row2);
          }
        });

        this.sortOn(saleDetails,'Location');
        response1.PackingSlip.PackingSlipDetails = saleDetails;   
        this.TotalQuantity = response1.PackingSlip.PackingSlipDetails.reduce((accumulator, value) => { return accumulator + value.Quantity; }, 0); 

        this.printingData = response1.PackingSlip;
        this.PrintPackingSlip(id);
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response1.message);
      }
    });
  }

  PrintPackingSlip(SaleId) {
    const request = {
      ID: SaleId,
      Status:true,
      UpdatedByUserID:1,
    };
    this.apiService.UpdatePrintingStatus(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        setTimeout(() => {
          let printContents;
          let popupWin;
    
          printContents = document.getElementById('printA4-sale-packing-1').innerHTML;
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
        this.GetAllSaleDataWithLazyLoadinFunction(this.filterModel);
      }
    });
   
  }
  sortOn (arr, prop) {
    arr.sort (
        function (a, b) {
            if (a[prop] < b[prop]){
                return -1;
            } else if (a[prop] > b[prop]){
                return 1;
            } else {
                return 0;   
            }
        }
    );
}
}
