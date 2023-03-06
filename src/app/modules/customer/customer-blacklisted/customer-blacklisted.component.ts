import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { UserModel } from '../../../Helper/models/UserModel';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';

import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from '../../shell/services/notification.service';
import { Router } from '@angular/router';
import { CustomerPermissionEnum } from 'src/app/shared/constant/customer-permission';
import * as XLSX from 'xlsx';
import { StorageService } from 'src/app/shared/services/storage.service';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { datefilter } from 'src/app/Helper/datefilter';

@Component({
  selector: 'app-customer-blacklisted',
  templateUrl: './customer-blacklisted.component.html',
  styleUrls: ['./customer-blacklisted.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class CustomerBlacklistedComponent implements OnInit, OnDestroy {
  uploadedFiles: any[] = [];
  Customers: any[] = [];
  arrayBuffer: any;
  file: File;

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

  filterModel = {
    PageNo: 0,
    PageSize: 25,
    Product: '',
  };
  
  dateForDD: any;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  dateId: number=2;
  usermodel: UserModel;
  updateStatusModel: UpdateStatus;
  AttachDocumentPopDisplay = false;

  genericMenuItems: GenericMenuItems[] = [
    // { label: 'Update', icon: 'fas fa-edit', dependedProperty: 'CustomerID', permission: CustomerPermissionEnum.UpdateClient },
    // { label: 'Discounts', icon: 'fas fa-donate', dependedProperty: 'CustomerID' },
    // { label: 'Delete', icon: 'fas fa-close', dependedProperty: 'CustomerID' },
  ];
  columns: Columns[] = [
    // { field: 'IsActiveForCustomer', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'CustomerID', header: 'ID', sorting: 'CustomerID', placeholder: '', translateCol: 'SSGENERIC.ID' },
    { field: 'sCompanyName', header: 'Company', sorting: 'sCompanyName', placeholder: '' , translateCol: 'SSGENERIC.COMPANY'},
    // tslint:disable-next-line: max-line-length
    { field: 'FirstName', secondfield: 'LastName', header: 'Customer', sorting: 'FirstName', placeholder: '', type: TableColumnEnum.COMBINED_COLUMN , translateCol: 'SSGENERIC.CUSTOMER'},
    // tslint:disable-next-line: max-line-length
    { field: 'Address', secondfield: 'City', header: 'Address', sorting: 'FirstName', placeholder: '', type: TableColumnEnum.COMBINED_COLUMN , translateCol: 'SSGENERIC.ADDRESS'},
    { field: 'EmailAddress', header: 'Email', sorting: 'EmailAddress', placeholder: '', translateCol: 'SSGENERIC.EMAIL' },
    // tslint:disable-next-line: max-line-length
    { field: 'CurrentBalance', header: 'Current Balance', sorting: 'CurrentBalance', placeholder: '', type: TableColumnEnum.BALANCE_COLUMN, translateCol: 'SSGENERIC.CURRENTB' },
  ];


  globalFilterFields = ['sCompanyName', 'FirstName', 'LastName', 'Address', 'City', 'CurrentBalance'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];


  constructor(
    private apiService: vaplongapi, private notificationService: NotificationService,
    private datepipe: DatePipe, private confirmationService: ConfirmationService,
    private router: Router, private storageService: StorageService) {
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    this.GetSearchByDateDropDownList();
    this.getAllCustomerList(this.filterModel);

    this.cols = [
      { field: 'CustomerID', header: 'ID' },
      { field: 'sCompanyName', header: 'Company' },
      { field: 'FirstName', header: 'Customer' },
      { field: 'Address', header: 'Address' },
      { field: 'EmailAddress', header: 'Email' },
      { field: 'CurrentBalance', header: 'Current Balance' },
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }
  ngOnDestroy(): void { }
  emitAction(event) {
    if (event.forLabel === 'Update') {
      this.Update(event.selectedRowData.CustomerID);
    }
    else if (event.forLabel === 'Discounts') {
      this.viewDiscounts(event.selectedRowData.CustomerID);
    }
    else if (event.forLabel === 'Delete') {
      this.Delete(event.selectedRowData);
    }
  }
  SearchByDate(event: any) {
    if (event.value === 7) {
      this.isCustomDate = true;
    }
    else {
      this.dateId = Number(this.dateId);
      this.getAllCustomerList(this.filterModel);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.dateId = 7;
    this.getAllCustomerList(this.filterModel);
  }

  Update(id) {
    this.router.navigate(['/customer/addcustomer', id]);
  }
  viewDiscounts(id) {
    this.router.navigate(['/customer/customer-productdiscount', id]);

  }
  Delete(customer) {
    this.confirmationService.confirm({
      message: 'Are you sure, you want to delete customer: ' + customer.FirstName + ' ' + customer.LastName + ' from system?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.DeleteCustomer(customer.CustomerID);
      }

    });
  }

  DeleteCustomer(id) {
    const param = { ID: id };
    this.apiService.DeleteCustomer(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
    });
  }

  GetSearchByDateDropDownList() {

    this.SearchByDateDropdown = [];

    this.SearchByDateDropdown.push({ value: 2, label: 'Last7Days' });
    this.SearchByDateDropdown.push({ value: 3, label: 'Last30Days' });
    this.SearchByDateDropdown.push({ value: 4, label: 'ThisMonth' });
    this.SearchByDateDropdown.push({ value: 5, label: 'LastMonth' });
    this.SearchByDateDropdown.push({ value: 7, label: 'Custom' });
    this.dateId = 2;
  }
  getAllCustomerList(filterRM) {
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;

    if (this.dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(this.dateId);
      filterRequestModel.IsGetAll = daterequest.IsGetAll;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss'));
      filterRequestModel.FromDate = new Date(this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss'));
    }
    else {
      filterRequestModel.IsGetAll = false;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss'));
      filterRequestModel.FromDate = new Date(this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss'));
    }

    this.apiService.GetAllBlacklisted(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.AllCustomerlist = response.AllCustomerList;
        this.totalRecords = response.AllCustomerList.length;
        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    });
  }

  AddCustomer() {
    this.router.navigate(['/customer/addcustomer', 0]);
  }
  AddMultipleCustomer() {
    this.AttachDocumentPopDisplay = true;
  }
  myUploader(event) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
    // event.files == files to upload
    this.file = event.files[0];
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      for (const item of arraylist) {
        const model = {
          ID: 0,
          FirstName: item['First Name'],
          LastName: item['Last Name'],
          EmailAddress: item['Email'],
          PhoneNo: item['PhoneNo'],
          Mobile: item['Mobile'],
          sFax: item['Fax'],
          sCompanyName: item['sCompanyName'],
          Website: item['Website'],
          dCreditLimit: Number(item['Credit Limit']),
          dOpeningBalance: Number(item['Opening Balance']),
          ShippingMethodID: Number(item['Shipping MethodID']),
          ClientSourceID: Number(item['Client SourceID']),
          DiscountGroupID: Number(item['Discount GroupID']),
          sRemarks: item['Remarks'] ? undefined : '',
          PostalCode: item['Postal Code'] ? undefined : '',
          Address: item['Street Address'],
          VATNumber: item['VATNumber'],
          sTaxNo: item['Tax Number'],
          sSalesTax: item['SalesTax'],
          BankAccountNo: item['Bank Account Number'],
          BICCode: item['BIC Code'],
          BankAccountDescription: item['BankAccount Description'],
          CityID: Number(item['CityID']),
          DeliveryPersonID: Number(item['DeliveryPersonID'] ? undefined : 0),
        };
        if (model.ShippingMethodID === 0) {
          model.ShippingMethodID = null;
        }
        if (model.ClientSourceID === 0) {
          model.ClientSourceID = null;
        }
        if (model.DiscountGroupID === 0) {
          model.DiscountGroupID = null;
        }
        if (model.CityID === 0) {
          model.CityID = null;
        }
        if (model.DeliveryPersonID === 0) {
          model.DeliveryPersonID = null;
        }
        this.Customers.push(model);

      }
      const param = { Customers: this.Customers };
      this.apiService.AddMultipleCustomer(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          this.AttachDocumentPopDisplay = false;
          this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
          this.getAllCustomerList(this.filterModel);
        }
        else {
          this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
        }
      });
    };
  }
  UpdateCustomerStatus(customer: any) // Update Cash Register Status Method To Communicate API
  {
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = customer.CustomerID;
    this.updateStatusModel.Status = customer.IsActiveForCustomer;
    this.updateStatusModel.UpdatedByUserID = this.usermodel.ID;
    this.apiService.UpdateCustomerStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.getAllCustomerList(this.filterModel);
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    });
  }
  exportPdf() {

    const doc = new jsPDF();
    autoTable(doc, {
      head: this.exportColumns,
      body: this.AllCustomerlist
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
      const worksheet = xlsx.utils.json_to_sheet(this.AllCustomerlist);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'SupplierInvoice');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      const EXCELTYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCELEXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCELTYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCELEXTENSION);
    });
  }

}

