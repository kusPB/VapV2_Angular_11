import { PurchaseRoutingModule } from './purchase.routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderReportComponent } from './purchase-order-report/purchase-order-report.component';
import { AddPurchaseComponent } from './add-purchase/add-purchase.component';
import { ReturnPurchaseReportComponent } from './return-purchase-report/return-purchase-report.component';
import { AddBackOrderComponent } from './add-back-order/add-back-order.component';
import { BackOrderReportComponent } from './back-order-report/back-order-report.component';
import { AddRefundComponent } from './add-refund/add-refund.component'
import { PurchaseDetailComponent } from './purchase-detail/purchase-detail.component';
import { RouterModule } from '@angular/router';
import { NgxPermissionsModule } from 'ngx-permissions';
import { BackOrderDetailComponent } from './backorder-detail/backorder-detail.component';
import { ReturnPurchaseDetailComponent } from './return-purchase-detail/return-purchase-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { OpenpurchasereportIndexComponent } from './openpurchasereport-index/openpurchasereport-index.component';
import { OpenPurchaseDetailComponent } from './open-purchase-detail/open-purchase-detail.component';
import { UpdatePurchaseComponent } from './update-purchase/update-purchase.component';
import { AddPreOrderComponent } from './add-pre-order/add-pre-order.component';
import { OpenpurchasereportIndexCustomizedComponent } from './openpurchasereport-index-customized/openpurchasereport-index-customized.component';
import { OpenPurchaseDetailCustomizedComponent } from './open-purchase-detail-customized/open-purchase-detail-customized.component';

import { PurchaseOrderCustomizedReportComponent } from './purchase-order-customized-report/purchase-order-customized-report.component';
import { PurchaseDetailCustomizedComponent } from './purchase-detail-customized/purchase-detail-customized.component';
import { HoldPurchaseDetailComponent } from './hold-purchase-detail/hold-purchase-detail.component';
import { HoldpurchasereportIndexComponent } from './holdpurchasereport-index/holdpurchasereport-index.component';
import { UpdateHoldPurchaseComponent } from './update-hold-purchase/update-hold-purchase.component';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [
    PurchaseOrderReportComponent,
    AddPurchaseComponent,
    ReturnPurchaseReportComponent,
    AddBackOrderComponent,
    BackOrderReportComponent,
    AddRefundComponent,
    PurchaseDetailComponent,
    BackOrderDetailComponent,
    OpenpurchasereportIndexComponent,
    ReturnPurchaseDetailComponent,
    UpdatePurchaseComponent,
    OpenPurchaseDetailComponent,
    AddPreOrderComponent,
    OpenpurchasereportIndexCustomizedComponent,
    OpenPurchaseDetailCustomizedComponent,
    PurchaseDetailCustomizedComponent,
    PurchaseOrderCustomizedReportComponent,
    HoldPurchaseDetailComponent,
    HoldpurchasereportIndexComponent,
    UpdateHoldPurchaseComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    PurchaseRoutingModule,
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
export class PurchaseModule { }
