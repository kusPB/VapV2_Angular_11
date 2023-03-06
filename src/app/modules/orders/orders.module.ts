import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersRoutingModule } from './orders.routing.module';
import { ManageIncomingOrderComponent } from './external-order/manage-incomingorder/manage-incoming-order.component';
import { ApproveInternalordersComponent } from './internal-orders/approve-internalorders/approve-internalorders.component';
import { ManageInternalOrdersComponent } from './internal-orders/manage-internal-orders/manage-internal-orders.component';
import { PurchaseInternalOrderComponent } from './internal-orders/purchase-internalorder/purchase-internalorder.component';
import { ShippingTransferComponent } from './internal-orders/shipping-transfer/shipping-transfer.component';
import { ShippingTransferDetailsComponent } from './internal-orders/shipping-transfer-details/shipping-transfer-details.component';
import { AddIncomingOrderComponent } from './external-order/add-incoming-order/add-incoming-order.component';
//import { ShippingTransferReceiveComponent } from './internal-orders/shipping-transfer-receive/shipping-transfer-receive.component';
// import { SearchPipe } from 'src/app/shared/pipes/search-pipe';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ShippingTransferReceiveComponent } from './internal-orders/shipping-transfer-receive/shipping-transfer-receive.component';
import { AddShippingTransferComponent } from './internal-orders/add-shipping-transfer/add-shipping-transfer.component';
import { IncomingOrderDetailComponent } from './external-order/incoming-order-detail/incoming-order-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { ShippingTransferNewComponent } from './internal-orders/shipping-transfer-new/shipping-transfer-new.component';


@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [
    ManageIncomingOrderComponent,
    ApproveInternalordersComponent,
    ManageInternalOrdersComponent,
    PurchaseInternalOrderComponent,
    ShippingTransferComponent,
    ShippingTransferNewComponent,
    ShippingTransferDetailsComponent,
    AddIncomingOrderComponent,
    //ShippingTransferReceiveComponent,
    // SearchPipe,
    ShippingTransferReceiveComponent,
    AddShippingTransferComponent,
    IncomingOrderDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    OrdersRoutingModule,
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
export class OrdersModule { }