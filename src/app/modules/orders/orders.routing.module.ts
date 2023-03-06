import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageIncomingOrderComponent } from './external-order/manage-incomingorder/manage-incoming-order.component';
import { ApproveInternalordersComponent } from './internal-orders/approve-internalorders/approve-internalorders.component';
import { ManageInternalOrdersComponent } from './internal-orders/manage-internal-orders/manage-internal-orders.component';
import { PurchaseInternalOrderComponent } from './internal-orders/purchase-internalorder/purchase-internalorder.component';
import { ShippingTransferComponent } from './internal-orders/shipping-transfer/shipping-transfer.component';
import { ShippingTransferDetailsComponent } from './internal-orders/shipping-transfer-details/shipping-transfer-details.component';
import { AddIncomingOrderComponent } from './external-order/add-incoming-order/add-incoming-order.component';
// import { ShippingTransferReceiveComponent } from './internal-orders/shipping-transfer-receive/shipping-transfer-receive.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ShippingTransferReceiveComponent } from './internal-orders/shipping-transfer-receive/shipping-transfer-receive.component';
import { AddShippingTransferComponent } from './internal-orders/add-shipping-transfer/add-shipping-transfer.component';
import { OrderPermissionEnum } from 'src/app/shared/constant/order-permission';
import { IncomingOrderDetailComponent } from './external-order/incoming-order-detail/incoming-order-detail.component';
import { ShippingTransferNewComponent } from './internal-orders/shipping-transfer-new/shipping-transfer-new.component';


const routes: Routes = [
  { path: '', component: ManageIncomingOrderComponent },
  {
    path: 'manage-internalorder', component: ManageInternalOrdersComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      // tslint:disable-next-line: max-line-length
      title: 'Internal Order', permissions: { only: [OrderPermissionEnum.ViewAllInternalOrders, OrderPermissionEnum.InternalOrder], redirectTo: '/403' }
    }
  },
  {
    path: 'approve-internalorder', component: ApproveInternalordersComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Approve Internal Order', permissions: { only: OrderPermissionEnum.ApproveInternalOrders, redirectTo: '/403' }
    }
  },
  {
    path: 'purchase-internalorder', component: PurchaseInternalOrderComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Purchase Internal Order', permissions: { only: OrderPermissionEnum.PurchaseInternalOrders, redirectTo: '/403' }
    }
  },
  {
    path: 'add-incoming-order', component: AddIncomingOrderComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'External Incoming Orders', permissions: { only: OrderPermissionEnum.IncomingOrder, redirectTo: '/403' }
    }
  },
  {
    path: 'manage-incoming-order', component: ManageIncomingOrderComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'External Order', permissions: { only: OrderPermissionEnum.ViewAllIncomingOrders, redirectTo: '/403' }
    }
  },
  {
    path: 'incoming-order-detail/:id', component: IncomingOrderDetailComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'External Order Detail', permissions: { only: OrderPermissionEnum.ViewAllIncomingOrders, redirectTo: '/403' }
    }
  },

  // {
  //   path: 'shipping-transfer', component: ShippingTransferComponent,
  //   canActivate: [NgxPermissionsGuard],
  //   data: {
  //     title: 'Incoming Shippings', permissions: { only: OrderPermissionEnum.SubMenuShipmentDocument, redirectTo: '/403' }
  //   }
  // },
  // {
  //   path: 'shipping-transfer/Details/ID/:id', component: ShippingTransferDetailsComponent,
  //   canActivate: [NgxPermissionsGuard],
  //   data: {
  //     title: 'Incoming Shipping Details', permissions: { only: OrderPermissionEnum.SubMenuShipmentDocument, redirectTo: '/403' }
  //   }
  // },
  // {
  // path: 'shipping-transfer/Receive/ID/:id', component: ShippingTransferReceiveComponent,
  // canActivate: [NgxPermissionsGuard],
  // data: { title: 'Receive Shipping', permissions: { only: OrderPermissionEnum.SubMenuShipmentDocument , redirectTo: '/403'}
  // }
  // },
  {
    path: 'manage-internalorder', component: ManageInternalOrdersComponent,
    data: {
      title: 'Internal Order', permissions: { only: OrderPermissionEnum.InternalOrder, redirectTo: '/403' }
    }
  },
  {
    path: 'approve-internalorder', component: ApproveInternalordersComponent,
    data: {
      title: 'Approve Internal Order', permissions: { only: OrderPermissionEnum.ApproveInternalOrders, redirectTo: '/403' }
    }
  },
  {
    path: 'manage-externalorder', component: ManageIncomingOrderComponent,
    data: {
      title: 'External Order', permissions: { only: OrderPermissionEnum.SubMenuShipmentDocument, redirectTo: '/403' }
    }
  },
  {
    path: 'purchase-internalorder', component: PurchaseInternalOrderComponent,
    data: {
      title: 'Purchase Internal Order', permissions: { only: OrderPermissionEnum.PurchaseInternalOrders, redirectTo: '/403' }
    }
  },
  {
    path: 'shipping-transfer', component: ShippingTransferComponent,
    data: {
      // tslint:disable-next-line: max-line-length
      title: 'Incoming Shippings', permissions: { only: [OrderPermissionEnum.ShippingTransferListing, OrderPermissionEnum.ShipmentTransfer], redirectTo: '/403' }
    }
  },
  {
    path: 'shipping-transfer-new', component: ShippingTransferNewComponent,
    data: {
      // tslint:disable-next-line: max-line-length
      title: 'Incoming Shippings Report', permissions: { only: [OrderPermissionEnum.SUBMENU_INCOMINGSHIPMENTREPORT], redirectTo: '/403' }
    }
  },
  {
    path: 'shipping-transfer/Details/ID/:id', component: ShippingTransferDetailsComponent, 
    data: {
      title: 'Incoming Shipping Details', permissions: { only: OrderPermissionEnum.ShippingTransferDetails, redirectTo: '/403' }
    }
  },
 
  {
    path: 'shipping-transfer/Receive/ID/:id', component: ShippingTransferReceiveComponent,
    data: {
      title: 'Receive Shipping', permissions: { only: OrderPermissionEnum.ShippingTransferReceive, redirectTo: '/403' }
    }
  },
  {
    path: 'shipping-transfer/Add', component: AddShippingTransferComponent,
    data: {
      title: 'Incoming Shipment Document', permissions: { only: OrderPermissionEnum.ShippingTransferAdd, redirectTo: '/403' }
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
