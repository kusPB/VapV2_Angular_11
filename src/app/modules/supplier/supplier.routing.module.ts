import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierIndexComponent } from './supplier-index/supplier-index.component';
import { SupplierPaymentsComponent } from './supplier-payments/supplier-payments.component';
import { SupplierLedgerComponent } from './supplier-ledger/supplier-ledger.component';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { SupplierOpenInvoicesComponent } from './supplier-openInvoices/supplier-openInvoices.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SupplierPermissionEnum } from 'src/app/shared/constant/supplier-permission';
import { SupplierPaymentNewComponent } from './supplier-payment-new/supplier-payment-new.component';


const routes: Routes = [
  { 
    path: '', component: SupplierIndexComponent },
  { 
    path: 'supplier-index', component: SupplierIndexComponent,
    canActivate: [NgxPermissionsGuard],
    data: { title: 'Suppliers'  , permissions: { only: SupplierPermissionEnum.SupplierListing, redirectTo: '/403' }
    } 
  },
  { 
    path: 'supplier-payments', component: SupplierPaymentsComponent,
    canActivate: [NgxPermissionsGuard],
    data: { title: 'Suppliers Payment'  , permissions: { only: SupplierPermissionEnum.SupplierPayments, redirectTo: '/403' }
    } 
  },
  { 
    path: 'payments-new', component: SupplierPaymentNewComponent,
    canActivate: [NgxPermissionsGuard],
    data: { title: 'Suppliers Payment'  , permissions: { only: SupplierPermissionEnum.SupplierPayments, redirectTo: '/403' }
    } 
  },
  { 
    path: 'supplier-ledger/:id/:name', component: SupplierLedgerComponent,
    canActivate: [NgxPermissionsGuard],
    data: { title: 'Supplier Ledger'  , permissions: { only: SupplierPermissionEnum.SubMenuSupplierAccounts, redirectTo: '/403' }
    } 
    },
  { 
    path: 'add-supplier/:id', component: AddSupplierComponent,
    canActivate: [NgxPermissionsGuard],
    data: { title: 'Add Supplier' , permissions: { only: SupplierPermissionEnum.AddClient, redirectTo: '/403' } 
    } 
  },
  { 
    path: 'supplier-openinvoices/:id', component: SupplierOpenInvoicesComponent,
    canActivate: [NgxPermissionsGuard],
    data: { title: 'Open Invoices' , permissions: { only: SupplierPermissionEnum.SubMenuInvoicePayments, redirectTo: '/403' } 
    } 
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
