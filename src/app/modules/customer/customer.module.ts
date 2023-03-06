import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer.routing.module';
import { CustomerIndexComponent } from './customer-index/customer-index.component';
import { CustomerPaymentsComponent } from './customer-payments/customer-payments.component';
import { ReportbyaddressComponent } from './reportbyaddress/reportbyaddress.component';
import { DatepickerpopupComponent } from 'src/app/EntryComponents/datepickerpopup/datepickerpopup.component';
import { CustomerLedgerComponent } from './customer-ledger/customer-ledger.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CustomerBalancePaymentComponent } from './customer-balancePayment/customer-balancePayment.component';
import { CustomerDirectPaymentComponent } from './customer-directPayment/customer-directPayment.component';
import { CustomerClearDirectPaymentComponent } from './customer-clearDirectPayment/customer-clearDirectPayment.component';
import { CustomerOpenInvoicesComponent } from './customer-openInvoices/customer-openInvoices.component';
import { CustomerProductDiscountComponent } from './customer-productdiscount/customer-productdiscount.component';
import { CustomerBlacklistedComponent } from './customer-blacklisted/customer-blacklisted.component';
import { CustomerPaymentDetailComponent } from './customer-payment-details/customer-payment-details.component';
import { CustomerPaymentNewComponent } from './customer-payment-new/customer-payment-new.component';


import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';


@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [
    CustomerIndexComponent,
    CustomerPaymentsComponent,
    ReportbyaddressComponent,
    //  DatepickerpopupComponent,
    CustomerLedgerComponent,
    AddCustomerComponent,
    CustomerBalancePaymentComponent,
    CustomerDirectPaymentComponent,
    CustomerClearDirectPaymentComponent,
    CustomerOpenInvoicesComponent,
    CustomerBlacklistedComponent,
    CustomerPaymentNewComponent,
    CustomerPaymentDetailComponent,
    CustomerProductDiscountComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CustomerRoutingModule,
    NgSelectModule,
    NgxPermissionsModule.forChild(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateModule,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),

  ]
})
export class CustomerModule { }
