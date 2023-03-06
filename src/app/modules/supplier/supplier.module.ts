
import { SupplierRoutingModule } from './supplier.routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierIndexComponent } from './supplier-index/supplier-index.component';
import { SupplierPaymentsComponent } from './supplier-payments/supplier-payments.component';
import { SupplierPaymentNewComponent } from '././supplier-payment-new/supplier-payment-new.component';

import { SupplierLedgerComponent } from './supplier-ledger/supplier-ledger.component';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { SupplierOpenInvoicesComponent } from './supplier-openInvoices/supplier-openInvoices.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
    // tslint:disable-next-line: max-line-length
    declarations: [
      SupplierIndexComponent,
      SupplierPaymentsComponent,
      SupplierLedgerComponent,
      SupplierPaymentNewComponent,
      AddSupplierComponent,
      SupplierOpenInvoicesComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        SupplierRoutingModule,
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
export class SupplierModule { }
