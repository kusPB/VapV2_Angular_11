import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { UpdateStatus } from 'src/app/Helper/models/UpdateStatus';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';


import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { SupplierOpenInvoicesModel } from 'src/app/Helper/models/SupplierOpenInvoicesModel';
import { StorageService } from 'src/app/shared/services/storage.service';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { isNullOrUndefined } from 'util';
import { IImageModel } from 'src/app/Helper/models/ImageModel';
import { environment } from 'src/environments/environment';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { debugOutputAstAsTypeScript } from '@angular/compiler';
import { randomNumber } from 'src/app/Helper/randomNumber';

@Component({
  selector: 'app-supplier-payment-new',
  templateUrl: './supplier-payment-new.component.html',
  styleUrls: ['./supplier-payment-new.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class SupplierPaymentNewComponent implements OnInit, OnDestroy {
  AllSupplierLedgerlist: any[] = [];

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
  fromDate = this.datepipe.transform(new Date(), 'dd/MM/YYYY   HH:MM ');
  toDate = this.datepipe.transform(new Date(), 'dd/MM/YYYY   HH:MM ');

  usermodel: UserModel;
  updateStatusModel: UpdateStatus;

  txtSupplier = '';
  txtPreviousBalance = '0.00';
  txtCurrentBalance: any = '0.00';
  filterRequestModel: FilterRequestModel;
  routeID: any;
  routeName: any;

  EnteredBalance: number;
  Remarks = '';

  AttachDocumentPopDisplay = false;
  txtOldClearableAmount = 0;
  txtTotalInvoiceAmount = 0;
  txtTotalPaidAmount = 0;

  password = '';
  displayPasswordPopup = false;
  CashRegisterHistoryID = 0;
  // supplier intials
  displaySupplierDialog = false;
  AllSuppliersList: any[] = [];
  SupplierDropDown: any[] = [];
  filteredSupplier: any[];
  selectedSupplier;
  SupplierOpenInvoicesList: SupplierOpenInvoicesModel[] = [];
  SupplierPurchaseList: SupplierOpenInvoicesModel[] = [];
  // ends here

  // calculation letiables starts
  supplierSales: SupplierOpenInvoicesModel[] = [];
  AllSupplierOpenInvoices: SupplierOpenInvoicesModel[] = [];
  txtTotalReturnInvoiceAmount = 0;
  // calculation letiables ends
  uploadedFiles: any[] = [];
  rowGroup: RowGroup = {
    property: 'DueDate',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  rowGroup1: RowGroup = {
    property: 'CreatedAt',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  
  genericMenuItems: GenericMenuItems[] = [

  ];
  columns: Columns[] = [
    { field: 'CreatedAt', header: 'Date', sorting: 'CreatedAt', placeholder: '', type: TableColumnEnum.DATE_FORMAT },
    // { field: 'Remarks', header: 'Remarks', sorting: 'Remarks', placeholder: '' },
    { field: 'dDebit', header: 'Amount', sorting: 'dDebit', placeholder: '', type: TableColumnEnum.BALANCE_COLUMN },
    //{ field: 'Attachment', header: 'Attachment', sorting: 'Attachment', placeholder: '', type: TableColumnEnum.ATTACHMENT },
  ];

  openSupplier: Columns[] = [
    { field: 'SuppierInvoiceNo', header: 'SuppierInvoiceNo', sorting: 'SuppierInvoiceNo', placeholder: '', type: TableColumnEnum.REDIRECTION_COLUMN },
    { field: 'DueDate', header: 'Date', sorting: 'DueDate', placeholder: '', type: TableColumnEnum.DATE_FORMAT },
    { field: 'dTotalAmount', header: 'Purchase Amount', sorting: 'dTotalAmount', placeholder: '', type: TableColumnEnum.BALANCE_COLUMN },
    // { field: 'Attachment', header: 'Attachment', sorting: 'Attachment', placeholder: '', type: TableColumnEnum.ATTACHMENT },
  ];
 
  globalFilterFields = ['CreatedAt', 'dDebit', 'Remarks'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  txtSupplierAddress: any;
  dataFunc: any = customSearchFn;
  base64textString: IImageModel = {
    Base64String: '',
    Extention: ''
  };


  isCaptchaDisplayed = false;
  isCapchaValidated = false;
  firstNumber=0;
  secondNumber=0;
  ActionType=1;


  constructor(
    private apiService: vaplongapi, private datepipe: DatePipe, private route: ActivatedRoute,
    private router: Router, private readonly notificationService: NotificationService, private storageService: StorageService) {

  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    this.storageService.setItem('PurchaseDetailRoute', this.router.url);
    this.CashRegisterHistoryID = this.storageService.getItem('CashRegisterHistoryID');
    this.GetSuppliersDropDownLists();

  }

  ngOnDestroy(): void { }
  emitAction(event) {

  }
  onUpload(event) {
    const file = event.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();

    reader.readAsDataURL(file);
    const self = this;
    // tslint:disable-next-line: only-arrow-functions
    reader.onload = function (e) {
      self.base64textString = {
        Base64String: reader.result.toString(),
        Extention: file.name.split('.')[file.name.split('.').length - 1]
      };
    };
  }
  getAllSupplierLedgerList(ID) {
    this.filterRequestModel = new FilterRequestModel();
    this.filterRequestModel.PageNo = 0;
    this.filterRequestModel.PageSize = 100000;
    this.filterRequestModel.ID = Number(ID);
    this.filterRequestModel.IsGetAll = true;
    this.filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    this.filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));

    this.apiService.GetSupplierLeadgerByFilter(this.filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {

        this.AllSupplierLedgerlist = response.AllTransactionList.filter(x => x.dDebit !== 0);
        if (this.AllSupplierLedgerlist.length > 0) {
          this.txtTotalPaidAmount = this.AllSupplierLedgerlist.reduce((sum, current) => sum + current.dDebit, 0);
        }
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }

  CloseThis() {
    this.router.navigate(['/supplier/supplier-payments']);
  }

  // supplier selection section and Data Fetecting ---------

  onSelectSupplierDataBinding(event: any) {

    this.storageService.setItem('SupplierPaymentNewRedirectValues', event);
    const supplier = this.AllSuppliersList.find(x => x.SupplierID === event.value);
    this.txtCurrentBalance = supplier.CurrentBalance;
    this.txtSupplier = supplier.sCompanyName;
    this.txtSupplierAddress = supplier.Address;
    this.getAllSupplierLedgerList(event.value);
    this.GetSupplierPurchases(event.value);
    this.GetSupplierPaymentsForClearance(event.value);
  }
  GetSupplierPaymentsForClearance(supplierID: any) {
    const Params = { ID: supplierID };
    this.apiService.GetSupplierOpenInvoices(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {

        response.AllSupplierOpenInvoices.forEach(element => {
          element.purchaseAmount = 0;
        });
        this.SupplierOpenInvoicesList = response.AllSupplierOpenInvoices;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }
  GetSupplierPurchases(SupplierID: any) {
    const Params = { ID: SupplierID };
    this.apiService.GetSupplierAllPurchases(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        
        response.AllSupplierOpenInvoices.forEach(element => {
          element.dTotalAmount -= element.dRemainingAmount;
          element.purchaseAmount = 0;
        });
        this.SupplierPurchaseList = response.AllSupplierOpenInvoices;
        this.txtOldClearableAmount = response.dOpeningBalance == null ? 0 : response.dOpeningBalance;
        if (this.SupplierPurchaseList.length > 0) {
          this.txtTotalInvoiceAmount = this.SupplierPurchaseList.reduce((sum, current) => sum + current.dTotalAmount, 0);
          this.txtTotalReturnInvoiceAmount = this.SupplierPurchaseList.reduce((sum, current) => sum + current.dRemainingAmount, 0);
        }
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }

  searchSupplier(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.SupplierDropDown.length; i++) {
      const orderBy = this.SupplierDropDown[i];
      if (orderBy.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(orderBy);
      }
    }

    this.filteredSupplier = filtered;

  }

  OpenSupplierDialog() {
    this.displaySupplierDialog = true;
  }

  GetSuppliersDropDownLists() {
    this.apiService.GetAllSupplier().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        response.AllSupplierList = response.AllSupplierList.filter(x => x.IsActiveForSupplier === true);
        for (let i = 0; i < response.AllSupplierList.length; i++) {
          this.SupplierDropDown.push({
            value: response.AllSupplierList[i].SupplierID,
            label: response.AllSupplierList[i].sCompanyName,
          });

        }
        if (this.SupplierDropDown.length > 0) {
          this.filteredSupplier = this.SupplierDropDown;
        }

        this.AllSuppliersList = response.AllSupplierList;
        this.totalRecords = response.AllSupplierList.length;
        let Redirection = this.storageService.getItem('SupplierPaymentNewRedirect') ;
        if (Redirection) {
          this.storageService.removeItem('SupplierPaymentNewRedirect');
          let filtervalues = this.storageService.getItem('SupplierPaymentNewRedirectValues');
          let supplierValues = this.AllSuppliersList.filter(x => x.SupplierID == filtervalues.value)[0];
           this.selectedSupplier =  {
            value: supplierValues.SupplierID,
            label: supplierValues.sCompanyName
          }
          this.onSelectSupplierDataBinding(this.selectedSupplier);
        }
      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
  }

  // emit event of order by popup
  SelectRowSupplier(supplier: any) {
    this.displaySupplierDialog = false;
    this.selectedSupplier = { value: supplier.SupplierID, label: supplier.FirstName + ' ' + supplier.LastName };
    this.storageService.setItem('SupplierPaymentNewRedirectValues', this.selectedSupplier);
    this.onSelectSupplierDataBinding(this.selectedSupplier);
  }

  // supplier selection section ends -----------------------------
  AttachfileFunction() {
    this.AttachDocumentPopDisplay = true;
  }
  UpdatePaymentMain() { }
  


  ValidateCaptcha(newValue: any) {
    this.isCaptchaDisplayed = false;
    // console.log(newValue.IsDone);
    this.isCapchaValidated = newValue.IsDone;
    if(this.isCapchaValidated)
    {
	if(this.ActionType==1)
      this.AddPaymentMain();
    }
  }

  close() {
    this.isCaptchaDisplayed = false;
    this.isCapchaValidated =  false;
  }

  openCaptcha(){
    this.firstNumber = randomNumber.generate(1);
    this.secondNumber = randomNumber.generate(1);
    this.isCaptchaDisplayed = true;

  }



  AddPaymentMain() {

    
 if(!this.isCapchaValidated)
 {
   this.openCaptcha();
this.ActionType =1;
   return;
}

    const paymentList: any[] = [];
    let paymentModel: any;
    this.SupplierOpenInvoicesList.filter(x => x.purchaseAmount !== 0).forEach(item => {
      paymentModel =
      {
        dPaidAmount: item.purchaseAmount,
        PurchasePaymentID: item.PurchasePaymentID
      };
      paymentList.push(paymentModel);
    });

    if (paymentList.length == 0)
    {
      this.notificationService.notify(NotificationEnum.INFO, 'Info', "No Payment added as no purchase is availible for clearance");
      return;
    }
    let totalClearable = paymentList.reduce((sum, current) => sum + current.dPaidAmount, 0);
    if (totalClearable <= 0)
    {
      this.notificationService.notify(NotificationEnum.INFO, 'Info', "No Payment added as no clearable amount is availible");
      return;
    }

    const Params = {
      SupplierID: Number(this.selectedSupplier.value),
      PaymentModeID: 1,
      // CashRegisterHistoryID: this.CashRegisterHistoryID,
      CreatedByUserID: this.usermodel.ID,
      AllUpdatePurchasePaymentList: paymentList,
      Remarks: this.Remarks,
    }
    this.apiService.AddSupplierPayment(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'success', 'Payments added successfully');

        this.getAllSupplierLedgerList(this.selectedSupplier.value);
        this.GetSupplierPurchases(this.selectedSupplier.value);
        this.GetSupplierPaymentsForClearance(this.selectedSupplier.value);
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }
  async validatePassword(Type: any) {
    // if (this.usermodel.ID === 1)//Check Password
    // {
      let params = {
        Password: this.password
      }
      const response = await this.apiService.CheckReceivedPaymentPassword(params).toPromise();
      if (response.ResponseCode != 0) {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', "Wrong password entered to add payment.");
        return false;
      }
      else {
        return true;
      }
    // }
    // else {
    //   let params = {
    //     VerificationCode: this.password,
    //     Type: Type,
    //     UserID: this.usermodel.ID,
    //     Amount: this.EnteredBalance,
    //     UsedFor: (this.selectedSupplier.value != 0) ? this.selectedSupplier.value : 0
    //   }

    //   const response = await this.apiService.CheckValidationCode(params).toPromise();
    //   if (response.ResponseCode != 0) {
    //     this.notificationService.notify(NotificationEnum.ERROR, 'Error', "Wrong password entered to add payment.");
    //     return false;
    //   }
    //   else {
    //     return true;
    //   }


    // }
  }
  RedirectToPurchaseDetail(event) {
    this.storageService.setItem('SupplierPaymentNewRedirect', true);
    this.router.navigate([`/purchase/details/${event.PurchaseID}`]);
  }
  calculatePayment() {
    this.calculateSupplierPayments(this.EnteredBalance);
  }
  calculateSupplierPayments(totalAmountAdded: number) {
    this.AllSupplierOpenInvoices = [];
    this.supplierSales = [];
    if ((totalAmountAdded >= 0) || (totalAmountAdded <= 0)) {

      // this.SupplierOpenInvoicesList.forEach(val => this.AllSupplierOpenInvoices.push(Object.assign({}, val)));
      this.SupplierOpenInvoicesList.forEach(val => {
        this.AllSupplierOpenInvoices.push(val);
      });

      let totalpurchaseamount = totalAmountAdded;
      // tslint:disable-next-line: max-line-length
      const allNegativeAmounts = this.AllSupplierOpenInvoices.filter(x => x.dRemainingAmount < 0).reduce((sum, current) => sum + current.dRemainingAmount, 0) * -1;
      totalpurchaseamount += allNegativeAmounts;

      // for positive values
      this.AllSupplierOpenInvoices.filter(x => x.dRemainingAmount > 0).forEach(item => {
        if (totalpurchaseamount === 0) { item.purchaseAmount = 0; }
        else if (totalpurchaseamount > 0) {
          const checkAmount = (totalpurchaseamount - item.dRemainingAmount);
          if (checkAmount >= 0) {
            totalpurchaseamount = checkAmount;
            item.purchaseAmount = item.dRemainingAmount;
          }
          else {
            item.purchaseAmount = totalpurchaseamount;
            totalpurchaseamount = 0;
          }
        }
        this.supplierSales.push(item);
      });

      let allPositiveAmounts = this.supplierSales.filter(x => x.purchaseAmount > 0).reduce((sum, current) =>
        sum + current.purchaseAmount, 0);
      allPositiveAmounts -= totalAmountAdded;
      let placeZeros = false;

      // for negative values
      this.AllSupplierOpenInvoices.filter(x => x.dRemainingAmount < 0).forEach(item => {
        if (!placeZeros) {
          if (allPositiveAmounts === 0) { item.purchaseAmount = 0; }
          else if (allPositiveAmounts > 0) {
            const checkAmount = (allPositiveAmounts + item.dRemainingAmount);
            if (checkAmount >= 0) {
              allPositiveAmounts = checkAmount;
              item.purchaseAmount = item.dRemainingAmount;
            }
            else {
              item.purchaseAmount = allPositiveAmounts * -1;
              placeZeros = true;
            }
          }
        }
        this.supplierSales.push(item);
      });

      if (this.supplierSales.length > 0) {
        this.SupplierOpenInvoicesList = this.supplierSales;
      }
      else {
        this.notificationService.notify(NotificationEnum.INFO, 'Info', 'All Payments are Clear');
        return;
      }

      this.SupplierOpenInvoicesList = this.supplierSales;

    }
    else {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Invalid Amount Added');
      return;
    }
  }
  

  onClear(form: any) {
    this.base64textString = { Extention: '', Base64String: '' };
    form.clear();
  }
  DisplayAttachment(event) {
    window.open(`${environment.CUSTOMER_DOCUMENT_PATH}${event}`, 'blank');
  }
}

