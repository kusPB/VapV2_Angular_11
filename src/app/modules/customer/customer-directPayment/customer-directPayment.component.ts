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
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { CustomerOpenInvoicesModel } from 'src/app/Helper/models/CustomerOpenInvoicesModel';
import { StorageService } from 'src/app/shared/services/storage.service';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { isNullOrUndefined } from 'util';
import { IImageModel } from 'src/app/Helper/models/ImageModel';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-customer-directPayment',
  templateUrl: './customer-directPayment.component.html',
  styleUrls: ['./customer-directPayment.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class CustomerDirectPaymentComponent implements OnInit, OnDestroy {
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

  dateForDD: any;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'dd/MM/YYYY   HH:MM ');
  toDate = this.datepipe.transform(new Date(), 'dd/MM/YYYY   HH:MM ');

  usermodel: UserModel;
  updateStatusModel: UpdateStatus;

  txtCustomer: string = '';
  txtPreviousBalance: string = '0.00';
  txtCurrentBalance: any = '0.00';
  filterRequestModel: FilterRequestModel;
  routeID: any;
  routeName: any;

  EnteredBalance: number;
  Remarks = '';

  AttachDocumentPopDisplay = false;
  txtOldClearableAmount = 0;
  txtNewClearableAmount = 0;
  txtTotalClearableAmount = 0;

  password = '';
  displayPasswordPopup = false;
  CashRegisterHistoryID = 0;
  //customer intials
  displayCustomerDialog = false;
  AllCustomersList: any[] = [];
  CustomerDropDown: any[] = [];
  filteredCustomer: any[];
  selectedCustomer;
  CustomerOpenInvoicesList: CustomerOpenInvoicesModel[] = [];
  //ends here

  //calculation letiables starts
  customerSales: CustomerOpenInvoicesModel[] = [];
  AllCustomerOpenInvoices: CustomerOpenInvoicesModel[] = [];

  //calculation letiables ends 
  uploadedFiles: any[] = [];

  genericMenuItems: GenericMenuItems[] = [

  ];
  columns: Columns[] = [
    { field: 'CreatedAt', header: 'Date', sorting: 'CreatedAt', placeholder: '', type: TableColumnEnum.DATE_FORMAT },
    { field: 'dCredit', header: 'Payment', sorting: 'dCredit', placeholder: '', type: TableColumnEnum.BALANCE_COLUMN },
    { field: 'Remarks', header: 'Remarks', sorting: 'Remarks', placeholder: '' },
    { field: 'Attachment', header: 'Attachment', sorting: 'Attachment', placeholder: '', type: TableColumnEnum.MULTIPLEATTACHMENT },

  ];

  globalFilterFields = "['CreatedAt','dCredit','Remarks']";
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000]
  txtCustomerAddress: any;
  dataFunc: any = customSearchFn;
  base64textString: IImageModel = {
    Base64String: '',
    Extention: ''
  };
  constructor(private apiService: vaplongapi, private datepipe: DatePipe, private route: ActivatedRoute,
    private router: Router, private readonly notificationService: NotificationService, private storageService: StorageService) {

  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');;
    this.CashRegisterHistoryID = this.storageService.getItem('CashRegisterHistoryID');
    this.GetCustomersDropDownLists();

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
  getAllCustomerLedgerList(ID) {
    this.filterRequestModel = new FilterRequestModel();
    this.filterRequestModel.PageNo = 0;
    this.filterRequestModel.PageSize = 100000;
    this.filterRequestModel.ID = Number(ID);
    this.filterRequestModel.IsGetAll = true;
    this.filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    this.filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));

    this.apiService.GetCustomerLeadgerByFilter(this.filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode == 0) {

        this.AllCustomerLedgerlist = response.AllTransactionList.filter(x => x.dCredit != 0);
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }

  CloseThis() {
    this.router.navigate(['/customer/customer-payments']);
  }

  //customer selection section and Data Fetecting ---------

  onSelectCustomerDataBinding(event: any) {
    let customer = this.AllCustomersList.find(x => x.CustomerID == event.value);
    this.txtCurrentBalance = customer.CurrentBalance;
    this.txtCustomer = customer.sCompanyName;
    this.txtCustomerAddress = customer.Address;
    this.getAllCustomerLedgerList(event.value);
    this.GetCustomerPaymentsForClearance(event.value);
  }

  GetCustomerPaymentsForClearance(customerID: any) {
    this.IsSpinner = true;
    let Params = { ID: customerID };
    this.apiService.GetCustomerOpenInvoicesForClearance(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        response.AllCustomerOpenInvoices.forEach(element => {
          element.purchaseAmount = 0;
        });
        this.CustomerOpenInvoicesList = response.AllCustomerOpenInvoices;
        this.txtOldClearableAmount = response.dOpeningBalance == null ? 0 : response.dOpeningBalance;

        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }

  searchCustomer(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.CustomerDropDown.length; i++) {
      let orderBy = this.CustomerDropDown[i];
      if (orderBy.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(orderBy);
      }
    }

    this.filteredCustomer = filtered;

  }

  OpenCustomerDialog() {
    this.displayCustomerDialog = true;
  }

  GetCustomersDropDownLists() {
    this.IsSpinner = true;
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
        response.AllCustomerList = response.AllCustomerList.filter(x => x.IsActiveForCustomer == true);
        for (let i = 0; i < response.AllCustomerList.length; i++) {
          this.CustomerDropDown.push({
            value: response.AllCustomerList[i].CustomerID,
            label: response.AllCustomerList[i].sCompanyName,
          });

        }
        if (this.CustomerDropDown.length > 0) {
          this.filteredCustomer = this.CustomerDropDown;
          this.IsSpinner = false;
        }

        this.AllCustomersList = response.AllCustomerList;
        this.totalRecords = response.AllCustomerList.length;

      }
      else {
        this.IsSpinner = false;
        console.log('internal serve Error', response);
      }

    }
    );
  }

  //emit event of order by popup
  SelectRowCustomer(customer: any) {
    this.displayCustomerDialog = false;
    this.selectedCustomer = { value: customer.CustomerID, label: customer.FirstName + " " + customer.LastName };
    this.onSelectCustomerDataBinding(this.selectedCustomer);
  }

  // customer selection section ends -----------------------------
  AttachfileFunction() {
    this.AttachDocumentPopDisplay = true;
  }
  async PasswordSubmit() {
    this.displayPasswordPopup = false;
    if (this.password === '' || isNullOrUndefined(this.password)) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', "Please specify password");
    }
    else {
      await this.UpdatePaymentMain();
    }
  }
  async UpdatePaymentMain() {
    const IsBalancePayment = false;
    if (IsBalancePayment) {
      if (this.EnteredBalance > 0) {
        this.notificationService.notify(NotificationEnum.INFO, 'Info', "Amount Should be Less than 0 Or Negative Amount Should be Entered");
        return;
      }
    }
    else {
      if (this.EnteredBalance < 1) {
        this.notificationService.notify(NotificationEnum.INFO, 'Info', "Amount Should Greater than 0 Or Positive Amount Should be Entered");
        return;
      }
    }

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

    let Type = 0;
    if (this.CashRegisterHistoryID == 0) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', "No cash register is opened yet by current User");
      return;
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
    let Params = {
      CustomerID: this.selectedCustomer.value,
      PaymentModeID: 1,
      CashRegisterHistoryID: this.CashRegisterHistoryID,
      CreatedByUserID: this.usermodel.ID,
      TotalAmount: this.EnteredBalance,
      Remarks: this.Remarks,
      Documents: this.base64textString
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
    //     UsedFor: (this.selectedCustomer.value != 0) ? this.selectedCustomer.value : 0
    //   }

    //   const response = await this.apiService.CheckValidationCode(params).toPromise();
    //   if (response.ResponseCode != 0) {
    //     this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Wrong password entered to add payment.');
    //     return false;
    //   }
    //   else {
    //     return true;
    //   }


    // }
  }
  RedirectToSaleDetail(event) {
    this.router.navigate(['/sale/sale-detail/' + event]);
  }
  calculatePayment() {

    this.txtNewClearableAmount = this.EnteredBalance;
    this.txtTotalClearableAmount = this.txtOldClearableAmount + this.EnteredBalance;

    this.calculateCustomerPayments(this.EnteredBalance, false);

  }
  calculateCustomerPayments(totalAmountAdded: number, IsBalancedPayment: boolean) {
    this.AllCustomerOpenInvoices = [];
    this.customerSales = [];
    if ((totalAmountAdded >= 0 && !IsBalancedPayment) || (totalAmountAdded <= 0 && IsBalancedPayment)) {

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

      if (this.customerSales.length > 0)
        this.CustomerOpenInvoicesList = this.customerSales;
      else {
        this.notificationService.notify(NotificationEnum.INFO, 'Info', "All Payments are Clear");
        return;
      }

      this.CustomerOpenInvoicesList = this.customerSales;

    }
    else {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', "Invalid Amount Added");
      return;
    }



  }

  UpdateRowClick(event, rowindex) {
    this.ClearCustomerOpenInvoicesAgainstDirectPayment(event.CustomerID, event.SalePaymentID, event.purchaseAmount);

  }
  ClearCustomerOpenInvoicesAgainstDirectPayment(CustomerID, SalePaymentID, TotalAmount) {

    if (this.CashRegisterHistoryID == 0) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', "No cash register is opened yet by current User");
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
      let request =
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
          this.notificationService.notify(NotificationEnum.SUCCESS, 'success', "Payments added successfully");
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
    this.base64textString = { Extention: '', Base64String: '' };
    form.clear();
  }
  DisplayAttachment(event)
  {
    window.open(`${environment.CUSTOMER_DOCUMENT_PATH}${event}`, 'blank');
  }
}

