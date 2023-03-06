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
import { CustomerOpenInvoicesModel } from 'src/app/Helper/models/CustomerOpenInvoicesModel';
import { StorageService } from 'src/app/shared/services/storage.service';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { isNullOrUndefined } from 'util';
import { IImageModel } from 'src/app/Helper/models/ImageModel';
import { environment } from 'src/environments/environment';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';

@Component({
  selector: 'app-customer-payment-new',
  templateUrl: './customer-payment-new.component.html',
  styleUrls: ['./customer-payment-new.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class CustomerPaymentNewComponent implements OnInit, OnDestroy {
  AllCustomerLedgerlist: any[] = [];

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
  AttachmentArr : IImageModel[]=[];

  dateForDD: any;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'dd/MM/YYYY   HH:MM ');
  toDate = this.datepipe.transform(new Date(), 'dd/MM/YYYY   HH:MM ');

  usermodel: UserModel;
  updateStatusModel: UpdateStatus;

  selectedType = 1;

  txtCustomer = '';
  txtPreviousBalance = '0.00';
  txtCurrentBalance: any = '0.00';
  filterRequestModel: FilterRequestModel;
  routeID: any;
  routeName: any;

  EnteredBalance: number;
  Remarks = '';

  displayDialog = false;
  DialogRemarks = '';

  displayNarrationDialog = false;
  DialogNarration = '';

  AttachDocumentPopDisplay = false;
  txtOldClearableAmount = 0;
  txtTotalInvoiceAmount = 0;
  txtTotalPaidAmount = 0;

  password = '';
  displayPasswordPopup = false;
  CashRegisterHistoryID = 0;
  // customer intials
  displayCustomerDialog = false;
  AllCustomersList: any[] = [];
  CustomerDropDown: any[] = [];
  filteredCustomer: any[];
  selectedCustomer;
  CustomerOpenInvoicesList: CustomerOpenInvoicesModel[] = [];
  // ends here

  // calculation letiables starts
  customerSales: CustomerOpenInvoicesModel[] = [];
  AllCustomerOpenInvoices: CustomerOpenInvoicesModel[] = [];

  // calculation letiables ends
  uploadedFiles: any[] = [];
  rowGroup: RowGroup = {
    property: 'CreatedAt',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  rowGroup1: RowGroup = {
    property: 'DueDate',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  genericMenuItems: GenericMenuItems[] = [

  ];
  columns: Columns[] = [
    { field: 'CreatedAt', header: 'Date', sorting: 'CreatedAt', placeholder: '', type: TableColumnEnum.DATE_FORMAT },
    { field: 'Remarks', header: 'Remarks', sorting: 'Remarks', placeholder: '' ,type:TableColumnEnum.REMARKS },
    { field: 'dCredit', header: 'Amount', sorting: 'dCredit', placeholder: '', type: TableColumnEnum.BALANCE_COLUMN },
    {
      field: 'IsReversed', header: 'Payment Status', sorting: '',  placeholder: '', type: TableColumnEnum.PAYMENT_STATUS,
      translateCol: 'SSGENERIC.PAYMENTSTATUS'
    },
    // { field: 'Attachment', header: 'Attachment', sorting: 'Attachment', placeholder: '', type: TableColumnEnum.ATTACHMENT },
    { field: 'Attachment', header: 'Attachment', sorting: 'Attachment', placeholder: '', type: TableColumnEnum.MULTIPLEATTACHMENT },
    { field: 'sNarration', header: 'Narration', sorting: 'sNarration', placeholder: '' ,type:TableColumnEnum.Narration },

  ];

  openCustomer: Columns[] = [
    { field: 'SaleID', header: 'OrderID', sorting: 'SaleID', placeholder: '', type: TableColumnEnum.REDIRECTION_COLUMN },
    { field: 'DueDate', header: 'Date', sorting: 'DueDate', placeholder: '', type: TableColumnEnum.DATE_FORMAT },
    { field: 'dTotalAmount', header: 'Invoice Amount', sorting: 'dTotalAmount', placeholder: '', type: TableColumnEnum.BALANCE_COLUMN },
    // { field: 'Attachment', header: 'Attachment', sorting: 'Attachment', placeholder: '', type: TableColumnEnum.MULTIPLEATTACHMENT },
    // { field: 'Attachment', header: 'Attachment', sorting: 'Attachment', placeholder: '', type: TableColumnEnum.ATTACHMENT },
  ];
  globalFilterFields = ['CreatedAt', 'dCredit', 'Remarks'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  txtCustomerAddress: any;
  dataFunc: any = customSearchFn;
  base64textString: IImageModel = {
    Base64String: '',
    Extention: ''
  };
  constructor(
    private apiService: vaplongapi, private datepipe: DatePipe, private route: ActivatedRoute,
    private router: Router, private readonly notificationService: NotificationService, private storageService: StorageService) {

  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    this.CashRegisterHistoryID = this.storageService.getItem('CashRegisterHistoryID');
    this.storageService.setItem('SaleDetailRoute', this.router.url);
    this.GetCustomersDropDownLists();

  }

  ngOnDestroy(): void { }
  emitAction(event) {

  }
  onUpload(event) {
    //const file = event.files[0];
    for(let file of event.files) {
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
      self.AttachmentArr.push(self.base64textString);
    };
  }
  }
  getAllCustomerLedgerList(ID) {
    this.filterRequestModel = new FilterRequestModel();
    this.filterRequestModel.PageNo = 0;
    this.filterRequestModel.PageSize = 100000;
    this.filterRequestModel.ID = Number(ID);
    this.filterRequestModel.IsGetAll = true;
    this.filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    this.filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));

    this.apiService.GetCustomerLeadgerByFilter(this.filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        
        this.AllCustomerLedgerlist = response.AllTransactionList.filter(x => x.dCredit !== 0);
        if (this.AllCustomerLedgerlist.length > 0) {
          this.txtTotalPaidAmount = this.AllCustomerLedgerlist.reduce((sum, current) => sum + current.dCredit, 0);
        }
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }

  CloseThis() {
    this.router.navigate(['/customer/customer-payments']);
  }

  // customer selection section and Data Fetecting ---------

  onSelectCustomerDataBinding(event: any) {
    this.storageService.setItem('CustomerPaymentNewRedirectValues', event);
    const customer = this.AllCustomersList.find(x => x.CustomerID === event.value);
    this.txtCurrentBalance = customer.CurrentBalance;
    this.txtCustomer = customer.sCompanyName;
    this.txtCustomerAddress = customer.Address;
    this.getAllCustomerLedgerList(event.value);
    this.GetCustomerPaymentsForClearance(event.value);
  }

  GetCustomerPaymentsForClearance(customerID: any) {
    const Params = { ID: customerID };
    this.apiService.GetCustomerAllOpenInvoices(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        
        response.AllCustomerOpenInvoices.forEach(element => {
          element.purchaseAmount = 0;
        });
        this.CustomerOpenInvoicesList = response.AllCustomerOpenInvoices;
        this.txtOldClearableAmount = response.dOpeningBalance == null ? 0 : response.dOpeningBalance;
        if (this.CustomerOpenInvoicesList.length > 0) {
          // this.txtTotalInvoiceAmount = this.AllCustomerLedgerlist.reduce((sum, current) => sum + current.dTotalAmount, 0);
          this.txtTotalInvoiceAmount = this.CustomerOpenInvoicesList.reduce((sum, current) => sum + current.dTotalAmount, 0);
        }
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }

  searchCustomer(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.CustomerDropDown.length; i++) {
      const orderBy = this.CustomerDropDown[i];
      if (orderBy.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(orderBy);
      }
    }

    this.filteredCustomer = filtered;

  }

  OpenCustomerDialog() {
    this.displayCustomerDialog = true;
  }

  GetCustomersDropDownLists() {
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
      if (response.ResponseCode === 0) {
        response.AllCustomerList = response.AllCustomerList.filter(x => x.IsActiveForCustomer === true);
        for (let i = 0; i < response.AllCustomerList.length; i++) {
          this.CustomerDropDown.push({
            value: response.AllCustomerList[i].CustomerID,
            label: response.AllCustomerList[i].sCompanyName,
          });

        }
        if (this.CustomerDropDown.length > 0) {
          this.filteredCustomer = this.CustomerDropDown;
        }

        this.AllCustomersList = response.AllCustomerList;
        this.totalRecords = response.AllCustomerList.length;
        let Redirection = this.storageService.getItem('CustomerPaymentNewRedirect');
        if (Redirection) {
          this.storageService.removeItem('CustomerPaymentNewRedirect');
          let filtervalues = this.storageService.getItem('CustomerPaymentNewRedirectValues');
          let customerValues = this.AllCustomersList.filter(x => x.CustomerID == filtervalues.value)[0];
           this.selectedCustomer =  {
            value: customerValues.CustomerID,
            label: customerValues.sCompanyName
          }
          this.onSelectCustomerDataBinding(this.selectedCustomer);
        }
      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
  }
  showDialog(event) {
    this.displayDialog = true;
    this.DialogRemarks = event.Remarks;
  }
  showNarrationDialog(event) {
    this.displayNarrationDialog = true;
    this.DialogNarration = event.sNarration;
  }
  // emit event of order by popup
  SelectRowCustomer(customer: any) {
    this.displayCustomerDialog = false;
    this.selectedCustomer = { value: customer.CustomerID, label: customer.FirstName + ' ' + customer.LastName };
    this.storageService.setItem('CustomerPaymentNewRedirectValues', this.selectedCustomer);
    this.onSelectCustomerDataBinding(this.selectedCustomer);
  }

  // customer selection section ends -----------------------------
  AttachfileFunction() {
    this.AttachDocumentPopDisplay = true;
  }
  async PasswordSubmit() {
    this.displayPasswordPopup = false;
    // tslint:disable-next-line: deprecation
    if (this.password === '' || isNullOrUndefined(this.password)) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please specify password');
    }
    else {
      await this.UpdatePaymentMain();
    }
  }
  async UpdatePaymentMain() {
    const IsBalancePayment = true;
    // if (IsBalancePayment) {
    //   if (this.EnteredBalance > 0) {
    // this.notificationService.notify(NotificationEnum.INFO, 'Info', "Amount Should be Less than 0 Or Negative Amount Should be Entered");
    //     return;
    //   }
    // }
    // else {
    //   if (this.EnteredBalance < 1) {
    // this.notificationService.notify(NotificationEnum.INFO, 'Info', "Amount Should Greater than 0 Or Positive Amount Should be Entered");
    //     return;
    //   }
    // }

    // tslint:disable-next-line: deprecation
    if (this.password === '' || isNullOrUndefined(this.password)) {
      // let TypeID;
      // if (IsBalancePayment) { TypeID = 4; }
      // else { TypeID = 3; }

      // let params = { Type: TypeID, UserID: this.usermodel.ID };
      // this.apiService.GetValidationCodeRequestedByWeb(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      //   if (response.ResponseCode == 0) {
      //     this.notificationService.notify(NotificationEnum.ERROR, 'Error', "we have send you a verfication code on your device.");
      //     this.displayPasswordPopup = true;
      //     this.IsSpinner = false;
      //     return;
      //   }
      //   else {
      //     this.IsSpinner = false;
      //     console.log('internal server error ! not getting api data');
      //   }
      // },
      // );
      this.displayPasswordPopup = true;
      return;
    }
    if (this.EnteredBalance < 1) {
       this.notificationService.notify(NotificationEnum.INFO, 'Info', "Amount Should Greater than 0 Or Positive Amount Should be Entered");
           return;
         }
    let Type = 0;
    if (this.CashRegisterHistoryID == 0) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', "No cash register is opened yet by current User");
      return;
    }
    if (Number(this.selectedType) === 2) {
      this.EnteredBalance = (-1 * this.EnteredBalance);
    }
    
    if (this.EnteredBalance > 0) {
      Type = 3;
    }
    else {
      Type = 4;
    }
    if (this.password == "" || this.password == null) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', "Please specify password");
      return;
    }
    else {
      const res = await this.validatePassword(Type);
      if (!res) { return; }
    }
 let IsAttachmentAttached = false;
  if(this.AttachmentArr.length==0)
  {
    IsAttachmentAttached = false;
    this.AttachmentArr.push(this.base64textString);
  }
  else
  {
    IsAttachmentAttached = true;

  }


    let Params = {
      CustomerID: this.selectedCustomer.value,
      PaymentModeID: 1,
      CashRegisterHistoryID: Number(this.CashRegisterHistoryID),
      CreatedByUserID: this.usermodel.ID,
      TotalAmount: this.EnteredBalance,
      Remarks: this.Remarks,
      IsAttachmentAttached:IsAttachmentAttached,
      //Documents: this.base64textString
      Documents : this.AttachmentArr,
      Attachment:"",
    }
    this.apiService.AddCustomerPaymentExtras(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode == 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'success', "Payments added successfully");
        this.router.navigate(['/customer/customer-payments']);

      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }

  async validatePassword(Type: any) {
    // if (this.usermodel.ID === 1)//Check Password
    // {
      let Id = 5;
      if (Number(this.selectedType) === 2) {
        Id = 6
      }
      else
      {
        Id = 5;
      }
      const params = {
        ID:Id,
        Password: this.password,
        Name:'',
        IsActive:true,
        UpdatedByUserID:this.usermodel.ID,
      };
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
    //     UsedFor: (this.selectedCustomer.value != 0) ? this.selectedCustomer.value : 0
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
  RedirectToSaleDetail(event) {
    this.storageService.setItem('CustomerPaymentNewRedirect', true);
    this.router.navigate(['/sale/sale-detail/' + event.SaleID]);
  }
  calculatePayment() {

    // this.txtNewClearableAmount = this.EnteredBalance;
    // this.txtTotalClearableAmount = this.txtOldClearableAmount + this.EnteredBalance;

    this.calculateCustomerPayments(this.EnteredBalance, true);

  }
  calculateCustomerPayments(totalAmountAdded: number, IsBalancedPayment: boolean) {
    this.AllCustomerOpenInvoices = [];
    this.customerSales = [];
    // if ((totalAmountAdded >= 0 && !IsBalancedPayment) || (totalAmountAdded <= 0 && IsBalancedPayment)) {

    //this.CustomerOpenInvoicesList.forEach(val => this.AllCustomerOpenInvoices.push(Object.assign({}, val)));
    this.CustomerOpenInvoicesList.forEach(val => {
      this.AllCustomerOpenInvoices.push(val);
    });

    let totalpurchaseamount = totalAmountAdded;
    let allNegativeAmounts = this.AllCustomerOpenInvoices.filter(x => x.dRemainingAmount < 0).reduce((sum, current) => sum + current.dRemainingAmount, 0) * -1;
    totalpurchaseamount += allNegativeAmounts;

    //for positive values
    this.AllCustomerOpenInvoices.filter(x => x.dRemainingAmount > 0).forEach(item => {
      if (totalpurchaseamount == 0) { item.purchaseAmount = 0; }
      else if (totalpurchaseamount > 0) {
        let checkAmount = (totalpurchaseamount - item.dRemainingAmount);
        if (checkAmount >= 0) {
          totalpurchaseamount = checkAmount;
          item.purchaseAmount = item.dRemainingAmount;
        }
        else {
          item.purchaseAmount = totalpurchaseamount;
          totalpurchaseamount = 0;
        }
      }
      this.customerSales.push(item);
    });

    let allPositiveAmounts = this.customerSales.filter(x => x.purchaseAmount > 0).reduce((sum, current) => sum + current.purchaseAmount, 0);
    allPositiveAmounts -= totalAmountAdded;
    let placeZeros = false;

    //for negative values
    this.AllCustomerOpenInvoices.filter(x => x.dRemainingAmount < 0).forEach(item => {
      if (!placeZeros) {
        if (allPositiveAmounts == 0) { item.purchaseAmount = 0; }
        else if (allPositiveAmounts > 0) {
          let checkAmount = (allPositiveAmounts + item.dRemainingAmount);
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
      this.customerSales.push(item);
    });

    if (this.customerSales.length > 0) {
      this.CustomerOpenInvoicesList = this.customerSales;
    }
    else {
      this.notificationService.notify(NotificationEnum.INFO, 'Info', 'All Payments are Clear');
      return;
    }

    this.CustomerOpenInvoicesList = this.customerSales;

    // }
    // else {
    //   this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Invalid Amount Added');
    //   return;
    // }
  }

  UpdateRowClick(event, rowindex) {
    this.ClearCustomerOpenInvoicesAgainstDirectPayment(event.CustomerID, event.SalePaymentID, event.purchaseAmount);

  }
  ClearCustomerOpenInvoicesAgainstDirectPayment(CustomerID, SalePaymentID, TotalAmount) {

    if (this.CashRegisterHistoryID === 0) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'No cash register is opened yet by current User');
      return;
    }

    if (TotalAmount > 0) {
      let paymentList: any[] = [];
      let item =
      {
        dPaidAmount: TotalAmount,
        SalePaymentID: SalePaymentID
      };
      paymentList.push(item);
      const request =
      {
        CustomerID: CustomerID,
        PaymentModeID: 1,
        AllUpdateCustomerPaymentList: paymentList,
        CashRegisterHistoryID: this.CashRegisterHistoryID,
        CreatedByUserID: this.usermodel.ID,
      };

      this.apiService.UpdateCustomerPaymentInvoices(request).pipe(untilDestroyed(this)).subscribe((response: any) => {

        if (response.ResponseCode === 0) {
          this.GetCustomerPaymentsForClearance(CustomerID);
          this.notificationService.notify(NotificationEnum.SUCCESS, 'success', 'Payments added successfully');
        }
        else {
          this.IsSpinner = false;
          this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
          console.log('internal server error ! not getting api data');
        }
      },
      );
    }
  }
  onClear(form: any) {
    this.AttachmentArr = [];
    this.base64textString = { Extention: '', Base64String: '' };
    form.clear();
  }
  DisplayAttachment(event) {
    window.open(`${environment.CUSTOMER_DOCUMENT_PATH}${event}`, 'blank');
  }
}

