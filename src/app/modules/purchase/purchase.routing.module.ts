import { PurchaseOrderReportComponent } from './purchase-order-report/purchase-order-report.component';
import { AddPurchaseComponent } from './add-purchase/add-purchase.component';
import { ReturnPurchaseReportComponent } from './return-purchase-report/return-purchase-report.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBackOrderComponent } from './add-back-order/add-back-order.component';
import { BackOrderReportComponent } from './back-order-report/back-order-report.component';
import { AddRefundComponent } from './add-refund/add-refund.component';
import { PurchaseDetailComponent } from './purchase-detail/purchase-detail.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PurchasePermissionEnum } from 'src/app/shared/constant/purchase-permission';
import { ReturnPurchaseDetailComponent } from './return-purchase-detail/return-purchase-detail.component';
import { BackOrderDetailComponent } from './backorder-detail/backorder-detail.component';
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


const routes: Routes = [
  { path: '', component: PurchaseOrderReportComponent },
  {
    path: 'add', component: AddPurchaseComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Add Purchase',
      permissions: {
        only: PurchasePermissionEnum.AddPurchase,
        redirectTo: '/403'
      }
    }
  },
  {
    path: 'addPreOrder', component: AddPreOrderComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Add Pre Order',
      permissions: {
        only: PurchasePermissionEnum.AddOpenPurchaseOrder,
        redirectTo: '/403'
      }
    }
  },
  {
    path: 'add/:id', component: UpdatePurchaseComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Add Purchase',
      permissions: {
        only: PurchasePermissionEnum.AddPurchase,
        redirectTo: '/403'
      }
    }
  },

  {
    path: 'add-hold/:id', component: UpdateHoldPurchaseComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Add Purchase',
      permissions: {
        only: PurchasePermissionEnum.UpdateHoldPurchase,
        redirectTo: '/403'
      }
    }
  },

  {
    path: 'add-back-order', component: AddBackOrderComponent,
    data: {
      title: 'Add Back Order',
      permissions: {
        only: PurchasePermissionEnum.BackOrder, redirectTo: '/403'
      }
    }
  },
  {
    path: 'back-order-report', component: BackOrderReportComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Back Order Report',
      permissions: {
        only: PurchasePermissionEnum.BackOrder,
        redirectTo: '/403'
      }
    }
  },
  {
    path: 'refund/:id', component: AddRefundComponent,
    data: {
      title: 'Refund',
      permissions: {
        only: PurchasePermissionEnum.PurchaseRefund,
        redirectTo: '/403'
      }
    }
  },
  {
    path: 'details/:id', component: PurchaseDetailComponent,
    data: {
      title: 'Purchase Detail',
    }
  },
  {
    path: 'customized-details/:id', component: PurchaseDetailCustomizedComponent,
    data: {
      title: 'Purchase Detail Customized',
    }
  },
  {
    path: 'return-details/:id', component: ReturnPurchaseDetailComponent,
    data: {
      title: 'Return Purchase Detail',
    }
  },
  {
    path: 'backorder-details/:id', component: BackOrderDetailComponent,
    data: {
      title: 'Back Order Detail',
    }
  },
  {
    path: 'purchase-order-report', component: PurchaseOrderReportComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Purchase Order Report',
      permissions: {
        only: PurchasePermissionEnum.PurchaseListing,
        redirectTo: '/403'
      }
    }
  },
  {
    path: 'purchase-order-customized-report', component: PurchaseOrderCustomizedReportComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Purchase Order Customized Report',
      permissions: {
        only: PurchasePermissionEnum.PurchaseCustomizedListing,
        redirectTo: '/403'
      }
    }
  },
  {
    path: 'pre-order-report', component: OpenpurchasereportIndexComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      
      title: 'Pre Order Report',
      permissions: {
        only: PurchasePermissionEnum.OpenPurchaseOrderReport,
        redirectTo: '/403'
      }
    }
  },
  {
    path: 'pre-order-customized-report', component: OpenpurchasereportIndexCustomizedComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      
      title: 'Pre Order Customized Report',
      permissions: {
        only: PurchasePermissionEnum.CustomizedOpenPurchaseOrderReport,
        redirectTo: '/403'
      }
    }
  },
  {
    path: 'hold-details/:id', component: HoldPurchaseDetailComponent,
    data: {
      title: 'Hold Purchase Detail',
    }
  },
  {
    path: 'opendetails/:id', component: OpenPurchaseDetailComponent,
    data: {
      title: 'Pre Order Detail',
    }
  },
  {
    path: 'opendetailscustomized/:id', component: OpenPurchaseDetailCustomizedComponent,
    data: {
      title: 'Pre Order Detail Customized',
    }
  },
  {
    path: 'return-purchase-report',
    component: ReturnPurchaseReportComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Return Purchase Report',
      permissions: {
        only: PurchasePermissionEnum.ReturnPurchaseHistory,
        redirectTo: '/403'
      }
    }
  },

  {
    path: 'hold-purchase-report', component: HoldpurchasereportIndexComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      
      title: 'Hold Purchase Report',
      permissions: {
        only: PurchasePermissionEnum.HoldPurchaseReport,
        redirectTo: '/403'
      }
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
