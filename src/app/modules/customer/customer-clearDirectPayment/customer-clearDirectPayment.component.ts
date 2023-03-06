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
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-customer-clearDirectPayment',
  templateUrl: './customer-clearDirectPayment.component.html',
  styleUrls: ['./customer-clearDirectPayment.component.scss'],
  providers: [DatePipe, ConfirmationService]

})
export class CustomerClearDirectPaymentComponent implements OnInit, OnDestroy {
  AllCustomerLedgerlist: any[] = [];

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
  disabled = true;
  dateForDD: any;
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');

  usermodel: UserModel;
  updateStatusModel: UpdateStatus;

  filterRequestModel: FilterRequestModel;
  routeID: any;
  routeName: any;

  EnteredBalance: number;
  txtAmount: number;
  Remarks = '';

  txtRemaining = 0;
  selectedPaymentModeID: any;
  PaymentModeDropdown: SelectItem[] = [];

  password = '';
  displayPasswordPopup = false;
  CashRegisterHistoryID = 0;
  // customer intials
  CustomerOpenInvoicesList: CustomerOpenInvoicesModel[] = [];
  // ends here

  // calculation variables starts
  customerSales: CustomerOpenInvoicesModel[] = [];
  AllCustomerOpenInvoices: CustomerOpenInvoicesModel[] = [];

  // calculation variables ends

  genericMenuItems: GenericMenuItems[] = [

  ];
  columns: Columns[] = [
    { field: 'sNarration', header: 'Description', sorting: 'sNarration', placeholder: '' },
    { field: 'dCredit', header: 'Credit', sorting: 'dCredit', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL },
    // tslint:disable-next-line: max-line-length
    { field: 'CurrentBalance', header: 'Current Balance', sorting: 'CurrentBalance', placeholder: '', type: TableColumnEnum.BALANCE_COLUMN },
    { field: 'CreatedAt', header: 'Date', sorting: 'CreatedAt', placeholder: '', type: TableColumnEnum.DATE_FORMAT },
  ];

  globalFilterFields = ['CreatedAt', 'dCredit', 'CurrentBalance', 'sNarration'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];

  constructor(
    private apiService: vaplongapi, private datepipe: DatePipe, private route: ActivatedRoute,
    private router: Router, private readonly notificationService: NotificationService, private storageService: StorageService) {
    this.routeID = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    this.CashRegisterHistoryID =this.storageService.getItem('CashRegisterHistoryID');
    this.GetPaymentModeDDFunction(0);
    this.getAllCustomerLedgerList(this.routeID);
    this.GetCustomerPaymentsForClearance(this.routeID);
  }

  ngOnDestroy(): void { }
  emitAction(event) {

  }

  GetPaymentModeDDFunction(id) {
    this.apiService.GetPaymentModeDropDownData().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        if (id !== 0) { this.selectedPaymentModeID = id; }
        else {
          this.selectedPaymentModeID = response.DropDownData[0].ID;
        }
        for (let i = 0; i <= response.DropDownData.length; i++) {
          this.PaymentModeDropdown.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }
      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
  }



  CloseThis() {
    this.router.navigate(['/customer/customer-payments']);
  }

  // customer selection section and Data Fetecting ---------

  GetCustomerPaymentsForClearance(customerID: any) {
    this.IsSpinner = true;
    const Params = { ID: customerID };
    this.apiService.GetCustomerOpenInvoices(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        response.AllCustomerOpenInvoices.forEach(element => {
          element.purchaseAmount = 0;
        });
        this.CustomerOpenInvoicesList = response.AllCustomerOpenInvoices;
        this.txtRemaining = response.dOpeningBalance - response.AllCustomerOpenInvoices.reduce((sum, current) =>
          sum + current.dRemainingAmount, 0);
        this.GetCustomerTotalDirectPaymentsFromAPI(customerID);
        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    });
  }
  GetCustomerTotalDirectPaymentsFromAPI(customerID: any) {
    const Params = { ID: customerID };
    this.apiService.GetCustomerTotalDirectPayments(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.EnteredBalance = response.TotalAmount;
        this.calculatePayment();
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    });
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
        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    });
  }
  // customer selection section ends -----------------------------

  PasswordSubmit() {
    this.displayPasswordPopup = false;
    // tslint:disable-next-line: deprecation
    if (this.password === '' || isNullOrUndefined(this.password)) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please specify password');
    }
    else {
      this.AddPaymentMain();
    }
  }
  AddPaymentMain() {

    if (this.password === '' || isNullOrUndefined(this.password)) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please specify password');
      this.displayPasswordPopup = true;
      return;
    }
    const Type = 3;
    if (this.CashRegisterHistoryID === 0) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'No cash register is opened yet by current User');
      return;
    }

    else {
      if (this.validatePassword(Type, 0)) { return; }
    }

    const paymentList: any[] = [];
    let paymentModel: any;
    this.CustomerOpenInvoicesList.filter(x => x.purchaseAmount !== 0).forEach(item => {
      paymentModel = {
        dPaidAmount: item.purchaseAmount,
        SalePaymentID: item.SalePaymentID
      };
      paymentList.push(paymentModel);
    });

    const Params = {
      CustomerID: Number(this.routeID),
      PaymentModeID: this.selectedPaymentModeID,
      CashRegisterHistoryID: this.CashRegisterHistoryID,
      CreatedByUserID: this.usermodel.ID,
      AllUpdateCustomerPaymentList: paymentList,
      Remarks: this.Remarks,
    };
    this.apiService.ClearCustomerPayments(Params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'success', 'Payments added successfully');
        this.IsSpinner = false;
        this.ngOnInit();
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
    });
  }

  validatePassword(type: any, amount: number): any {
    if (this.usermodel.ID === 1)// Check Password
    {
      const params = {
        Password: this.password
      };
      this.apiService.CheckReceivedPaymentPassword(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
        if (response.ResponseCode !== 0) {
          this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Wrong password entered to add payment.');
          return false;
        }
        else {
          return true;
        }
      });
    }
    else {
      const params = {
        VerificationCode: this.password,
        Type: type,
        UserID: this.usermodel.ID,
        Amount: amount,
        UsedFor: this.routeID,
      };

      this.apiService.CheckValidationCode(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
        if (response.ResponseCode !== 0) {
          this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Wrong password entered to add payment.');
          return false;
        }
        else {
          return true;
        }
      });
    }
  }
  RedirectToSaleDetail(event) {
  }
  calculatePayment() {
    this.calculateCustomerPayments(this.EnteredBalance);
  }
  calculateCustomerPayments(totalAmountAdded: number) {
    this.AllCustomerOpenInvoices = [];
    this.customerSales = [];
    if ((totalAmountAdded >= 0) || (totalAmountAdded <= 0)) {
      // this.CustomerOpenInvoicesList.forEach(val => this.AllCustomerOpenInvoices.push(Object.assign({}, val)));
      this.CustomerOpenInvoicesList.forEach(val => {
        this.AllCustomerOpenInvoices.push(val);
      });

      let totalpurchaseamount = totalAmountAdded;
      const allNegativeAmounts = this.AllCustomerOpenInvoices.filter(x =>
        x.dRemainingAmount < 0).reduce((sum, current) => sum + current.dRemainingAmount, 0) * -1;
      totalpurchaseamount += allNegativeAmounts;

      // for positive values
      this.AllCustomerOpenInvoices.filter(x => x.dRemainingAmount > 0).forEach(item => {
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
        this.customerSales.push(item);
      });

      let allPositiveAmounts = this.customerSales.filter(x =>
        x.purchaseAmount > 0).reduce((sum, current) => sum + current.purchaseAmount, 0);
      allPositiveAmounts -= totalAmountAdded;
      let placeZeros = false;

      // for negative values
      this.AllCustomerOpenInvoices.filter(x => x.dRemainingAmount < 0).forEach(item => {
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

    }
    else {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Invalid Amount Added');
      return;
    }
  }
  onChangeFieldAmount(event, rowindex) {

    let totalAmount = 0;
    let payments;
    const paymentsList: any[] = [];

    this.CustomerOpenInvoicesList.forEach(item => {
      payments = { purchaseAmount: item.purchaseAmount };
      paymentsList.push(payments);
    });
    totalAmount = this.CustomerOpenInvoicesList.reduce((sum, current) => sum + current.purchaseAmount, 0);
    this.EnteredBalance = totalAmount;
    this.txtAmount = totalAmount;
    this.calculateCustomerPaymentsByField(paymentsList);

  }
  calculateCustomerPaymentsByField(paymentsList: any[]) {
    const customerPayments = paymentsList;
    this.customerSales = [];
    this.customerSales = this.CustomerOpenInvoicesList;
    let count = 0;
    this.customerSales.filter(x => x.dRemainingAmount > 0).forEach(item => {
      while (customerPayments[count].purchaseAmount < 0) {
        count++;
      }
      if (item.dRemainingAmount >= customerPayments[count].purchaseAmount) {
        item.purchaseAmount = customerPayments[count].purchaseAmount;
      } else {
        item.purchaseAmount = item.dRemainingAmount;
      }
      count++;
    });
    count = 0;
    this.customerSales.filter(x => x.dRemainingAmount < 0).forEach(item => {
      while (customerPayments[count].purchaseAmount > 0) {
        count++;
      }

      if (item.dRemainingAmount >= customerPayments[count].purchaseAmount) {
        item.purchaseAmount = customerPayments[count].purchaseAmount;
      } else {
        item.purchaseAmount = item.dRemainingAmount;
      }
      count++;
    });
    this.CustomerOpenInvoicesList = this.customerSales;
  }

}

