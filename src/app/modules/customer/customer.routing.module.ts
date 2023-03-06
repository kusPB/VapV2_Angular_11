import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerIndexComponent } from './customer-index/customer-index.component';
import { CustomerPaymentsComponent } from './customer-payments/customer-payments.component';
import { ReportbyaddressComponent } from './reportbyaddress/reportbyaddress.component';
import { CustomerLedgerComponent } from './customer-ledger/customer-ledger.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CustomerBalancePaymentComponent } from './customer-balancePayment/customer-balancePayment.component';
import { CustomerDirectPaymentComponent } from './customer-directPayment/customer-directPayment.component';
import { CustomerClearDirectPaymentComponent } from './customer-clearDirectPayment/customer-clearDirectPayment.component';
import { CustomerOpenInvoicesComponent } from './customer-openInvoices/customer-openInvoices.component';
import { CustomerProductDiscountComponent } from './customer-productdiscount/customer-productdiscount.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CustomerPermissionEnum } from 'src/app/shared/constant/customer-permission';
import { CustomerBlacklistedComponent } from './customer-blacklisted/customer-blacklisted.component';
import { CustomerPaymentNewComponent } from './customer-payment-new/customer-payment-new.component';
import { CustomerPaymentDetailComponent } from './customer-payment-details/customer-payment-details.component';


const routes: Routes = [
  { path: '', component: CustomerIndexComponent },
  {
    path: 'customer-index', component: CustomerIndexComponent,
    canActivate: [NgxPermissionsGuard],
    data: { title: 'Customers'  , permissions: { only: [CustomerPermissionEnum.CustomerListing , CustomerPermissionEnum.ClientsListing], redirectTo: '/403' }
  } 
},
{ 
  path: 'customer-blacklisted', component: CustomerBlacklistedComponent,
  canActivate: [NgxPermissionsGuard],
  data: { title: 'BlackListed Customers'  , permissions: { only: [CustomerPermissionEnum.BlackListedCustomerListing , CustomerPermissionEnum.ClientsListing], redirectTo: '/403' }
} 
},
  { 
    path: 'customer-payments', component: CustomerPaymentsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Customers Payment', permissions: { only: CustomerPermissionEnum.CustomerPayments, redirectTo: '/403' }
    }
  },
  { 
    path: 'payments-new', component: CustomerPaymentNewComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Customers Payment New', permissions: { only: CustomerPermissionEnum.CustomerPayments, redirectTo: '/403' }
    }
  },
  {
    path: 'customer-reportbyaddress', component: ReportbyaddressComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Report By Customer Address', permissions: { only: CustomerPermissionEnum.SubMenuAddressReport, redirectTo: '/403' }
    }
  },
  {
    path: 'customer-ledger/:id/:name', component: CustomerLedgerComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Customer Ledger', permissions: {
        only: [CustomerPermissionEnum.CustomerLedgers, CustomerPermissionEnum.ClientLeadger],
        redirectTo: '/403'
      }
    }
  },
  {
    path: 'addcustomer/:id', component: AddCustomerComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Add Customer', permissions: { only: CustomerPermissionEnum.AddClient, redirectTo: '/403' }
    }
  },
  {
    path: 'balance-payment', component: CustomerBalancePaymentComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Balance Payments', permissions: { only: CustomerPermissionEnum.AddBalance, redirectTo: '/403' }
    }
  },
  {
    path: 'direct-payment', component: CustomerDirectPaymentComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Direct Payments', permissions: { only: CustomerPermissionEnum.DirectPayment, redirectTo: '/403' }
    }
  },
  {
    path: 'customer-cleardirectpayment/:id', component: CustomerClearDirectPaymentComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Clear Direct Payments', permissions: { only: CustomerPermissionEnum.ClearDirectPayment, redirectTo: '/403' }
    }
  },
  {
    path: 'customer-openinvoices/:id', component: CustomerOpenInvoicesComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Open Invoices', permissions: { only: CustomerPermissionEnum.CustomerPayments, redirectTo: '/403' }
    }
  },
  {
    path: 'customer-productdiscount/:id', component: CustomerProductDiscountComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Customer Product Discounts', permissions: { only: [CustomerPermissionEnum.CustomerDiscountListing, CustomerPermissionEnum.CustomerProductDiscount], redirectTo: '/403' }
    }
  },
  {
    path: 'customer-payment-details/:id/:name', component: CustomerPaymentDetailComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Customer Payment Details', permissions: {
        only: [CustomerPermissionEnum.CustomerPaymentDetails],
        redirectTo: '/403'
      }
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
