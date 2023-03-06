import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesRoutingModule } from './sales-routing.module';
import { OpensalereportIndexComponent } from './opensalereport-index/opensalereport-index.component';
import { PerformainvoiceIndexComponent } from './performainvoice-index/performainvoice-index.component';
import { SaleIndexComponent } from './sale-index/sale-index.component';
import { SaleInvoiceoverviewComponent } from './sale-invoiceoverview/sale-invoiceoverview.component';
import { SaleStatsComponent } from './sale-stats/sale-stats.component';
import { SalerefundreportIndexComponent } from './salerefundreport-index/salerefundreport-index.component';
import { SalereportByproductComponent } from './salereport-byproduct/salereport-byproduct.component';
import { SalereportBysubcategoryComponent } from './salereport-bysubcategory/salereport-bysubcategory.component';
import { SalereportByuserComponent } from './salereport-byuser/salereport-byuser.component';
import { AddReceiptComponent } from './add-receipt/add-receipt.component';
import { AddReceiptNewComponent } from './add-receipt-new/add-receipt-new.component';
import { AddPerformaInvoiceComponent } from './add-performa-invoice/add-performa-invoice.component'
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { UpdateReceiptNewComponent } from './update-receipt-new/update-receipt-new.component';
import { AddSaleRefundComponent } from './add-sale-refund/add-sale-refund.component';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
import { HoldSaleDetailComponent } from './hold-sale-detail/hold-sale-detail.component';
import { RefundSaleDetailComponent } from './refundsale-detail/refundsale-detail.component';
import { UpdateSaleDetailComponent } from './update-sale-detail/update-sale-detail.component';
import { OnlineOrderDetailComponent } from './online-order-detail/online-order-detail.component';
import { PerformaInvoiceDetailComponent } from './performainvoice-detail/performainvoice-detail.component';
import { VpSaleDetailComponent } from './vp-sale-detail/vp-sale-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { SaleStatsDetailComponent } from './sale-stats-detail/sale-stats-detail.component';
import { UpdateReceiptByOrderComponent } from './update-receipt-by-order/update-receipt-by-order.component';


@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [
    OpensalereportIndexComponent,
    PerformainvoiceIndexComponent,
    SaleIndexComponent,
    SaleInvoiceoverviewComponent,
    SaleStatsComponent,
    SaleStatsDetailComponent,
    SalerefundreportIndexComponent,
    SalereportByproductComponent,
    SalereportBysubcategoryComponent,
    SalereportByuserComponent,
    AddReceiptComponent,
    AddReceiptNewComponent,
    AddPerformaInvoiceComponent,
    UpdateReceiptNewComponent,
    SaleDetailComponent,
    RefundSaleDetailComponent,
    HoldSaleDetailComponent,
    AddSaleRefundComponent,
    OnlineOrderDetailComponent,
    UpdateSaleDetailComponent,
    PerformaInvoiceDetailComponent,
    VpSaleDetailComponent,
    UpdateReceiptByOrderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SalesRoutingModule,
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
export class SalesModule { }
