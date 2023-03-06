import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { vaplongapi } from '../../../Service/vaplongapi.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { UserModel } from '../../../Helper/models/UserModel';

import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationService } from '../../shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierPermissionEnum } from 'src/app/shared/constant/supplier-permission';
import * as XLSX from 'xlsx';
import { SupplierModel } from 'src/app/Helper/models/SupplierModel';
import { StorageService } from 'src/app/shared/services/storage.service';


@Component({
  selector: 'app-supplier-index',
  templateUrl: './supplier-index.component.html',
  styleUrls: ['./supplier-index.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class SupplierIndexComponent implements OnInit, OnDestroy {
  uploadedFiles: any[] = [];
  Suppliers: any[] = [];
  arrayBuffer: any;
  file: File;

  AttachDocumentPopDisplay = false;
  AllSupplierlist: any[] = [];
  SupplierPermission = SupplierPermissionEnum;
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
  displaySalePopup = false;

  dateForDD: any;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');

  usermodel: UserModel;
  updateStatusModel: UpdateStatus;

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-edit', dependedProperty: 'SupplierID' },
    { label: 'Delete', icon: 'fas fa-close', dependedProperty: 'SupplierID' },


  ];
  columns: Columns[] = [
    { field: 'IsActiveForSupplier', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'sCompanyName', header: 'Company', sorting: 'sCompanyName', placeholder: '', translateCol: 'SSGENERIC.COMPANY' },
    // tslint:disable-next-line: max-line-length
    { field: 'FirstName', secondfield: 'LastName', header: 'Contact Name', sorting: 'FirstName', placeholder: '', type: TableColumnEnum.COMBINED_COLUMN, translateCol: 'SSGENERIC.CONTACTNAME' },
    { field: 'PhoneNo', header: 'Phone', sorting: 'PhoneNo', placeholder: '' , translateCol: 'SSGENERIC.PHONE'},
    { field: 'EmailAddress', header: 'Email', sorting: 'EmailAddress', placeholder: '' , translateCol: 'SSGENERIC.EMAIL'},
  ];

  globalFilterFields = ['sCompanyName', 'FirstName', 'LastName', 'EmailAddress', 'PhoneNo'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];


  constructor(
    private apiService: vaplongapi, private datepipe: DatePipe, private router: Router,private confirmationService: ConfirmationService,
    private notificationService: NotificationService, private storageService: StorageService) {
      this.usermodel = this.storageService.getItem('UserModel');
      const obj = {
        Action: 'View',
        Description: `View Suppliers`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    this.getAllSupplierList();

    this.cols = [
      { field: 'SupplierID', header: 'ID' },
      { field: 'sCompanyName', header: 'Company' },
      { field: 'FirstName', header: 'Supplier' },
      { field: 'EmailAddress', header: 'Email' },
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  ngOnDestroy(): void { }
  emitAction(event) {
    if (event.forLabel === 'Update') {
      this.Update(event.selectedRowData.SupplierID);
    }
    else if (event.forLabel === 'Delete') {
      this.Delete(event.selectedRowData);
    }
  }
  Delete(supplier) {
    this.confirmationService.confirm({
      message: 'Are you sure, you want to delete supplier: ' + supplier.FirstName + ' ' + supplier.LastName + ' from system?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.DeleteSupplier(supplier.SupplierID);
      }

    });
  }

  DeleteSupplier(id) {
    const param = {
      ID: id,
      RequestedUserID: this.usermodel.ID,
    };
    this.apiService.DeleteSupplier(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.getAllSupplierList();
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
    });
  }
  Update(id) {
    this.router.navigate(['/supplier/add-supplier', id]);
  }

  getAllSupplierList() {

    this.apiService.GetAllSupplier().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {

        if (this.usermodel.OutletID === 11) {
          const list = response.AllSupplierList.filter(x => x.CityID === 13);
          this.AllSupplierlist = list;
          this.totalRecords = list.length;
        }
        else {
          this.AllSupplierlist = response.AllSupplierList;
          this.totalRecords = response.AllSupplierList.length;
        }

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }

  AddSupplier() {
    this.router.navigate(['/supplier/add-supplier', 0]);

  }
  AddMultipleSupplier() {
    this.AttachDocumentPopDisplay = true;
  }
  myUploader(event) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    // event.files === files to upload
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
          CreatedByUserIDForSupplier:this.usermodel.ID,
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

        this.Suppliers.push(model);

      }
      const param = { Suppliers: this.Suppliers };
      this.apiService.AddMultipleSupplier(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          this.AttachDocumentPopDisplay = false;
          this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
          this.getAllSupplierList();
        }
        else {
          this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);

        }
      },
      );
    };
  }
  UpdateSupplierStatus(supplier: any) // Update Cash Register Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = supplier.SupplierID;
    this.updateStatusModel.Status = supplier.IsActiveForSupplier;
    this.updateStatusModel.UpdatedByUserID = this.usermodel.ID;
    this.apiService.UpdateSupplierStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.getAllSupplierList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    });
  }
  exportPdf() {

    const doc = new jsPDF();
    autoTable(doc, {
      head: this.exportColumns,
      body: this.AllSupplierlist
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
      const worksheet = xlsx.utils.json_to_sheet(this.AllSupplierlist);
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



