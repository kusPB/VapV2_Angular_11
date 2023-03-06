import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
import { AddPerformaInvoiceComponent } from './add-performa-invoice/add-performa-invoice.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SalesPermissionEnum } from "../../shared/constant/sales-permission";
import { UpdateReceiptNewComponent } from './update-receipt-new/update-receipt-new.component';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
import { HoldSaleDetailComponent } from './hold-sale-detail/hold-sale-detail.component';
import { AddSaleRefundComponent } from './add-sale-refund/add-sale-refund.component';
import { RefundSaleDetailComponent } from './refundsale-detail/refundsale-detail.component';
import { UpdateSaleDetailComponent } from './update-sale-detail/update-sale-detail.component';
import { OnlineOrderDetailComponent } from './online-order-detail/online-order-detail.component';
import { PerformaInvoiceDetailComponent } from './performainvoice-detail/performainvoice-detail.component';
import { VpSaleDetailComponent } from './vp-sale-detail/vp-sale-detail.component';
import { SaleStatsDetailComponent } from './sale-stats-detail/sale-stats-detail.component';
import { UpdateReceiptByOrderComponent } from './update-receipt-by-order/update-receipt-by-order.component';

const routes: Routes = [
  { path: '', component: SaleIndexComponent },
  {
    path: 'sale-index', component: SaleIndexComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Update Orders',
      permissions: {
        only: SalesPermissionEnum.SalesHistory,
        redirectTo: '/403'
      }
    }
  },
  {
    path: 'sale-invoiceoverview',
    component: SaleInvoiceoverviewComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Invoices Overview', permissions:
      {
        only: SalesPermissionEnum.SubMenuInvoiceOverview,
        redirectTo: '/403'
      }
    }
  },
  {
    path: 'salerefundreport-index', component: SalerefundreportIndexComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Credit Notes',
      permissions: {
        only: SalesPermissionEnum.ReturnSalesHistory,
        redirectTo: '/403'
      }
    }
  },
  {
    path: 'performainvoice-index', component: PerformainvoiceIndexComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Performa Invoices',
      permissions: { only: SalesPermissionEnum.PerfomaSaleListing, redirectTo: '/403' }
    }
  },
  {
    path: 'performainvoice-detail/:id', component: PerformaInvoiceDetailComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Performa Invoices Details',
      permissions: { only: SalesPermissionEnum.PerfomaSaleListing, redirectTo: '/403' }
    }
  },
  {
    path: 'add-performa-invoice', component: AddPerformaInvoiceComponent,
    // canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Performa Invoice'
      // , permissions: { only: SalesPermissionEnum.AddPerfomaInvoice, redirectTo: '/403' }
    }
  },
  {
    path: 'add-performa-invoice/:id', component: AddPerformaInvoiceComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Performa Invoice', permissions: { only: SalesPermissionEnum.AddPerfomaInvoice, redirectTo: '/403' }
    }
  },
  {
    path: 'opensalereport-index', component: OpensalereportIndexComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Hold Sale', permissions: { only: SalesPermissionEnum.OpenSalesListing, redirectTo: '/403' }
    }
  },
  {
    path: 'sale-detail/:id', component: SaleDetailComponent,
    data: {
      title: 'Sale Detail'
    }
  },
  {
    path: 'vp-sale-detail/:id', component: VpSaleDetailComponent,
    data: {
      title: 'Vp Sale Detail'
    }
  },
  {
    path: 'online-order-detail/:id', component: OnlineOrderDetailComponent,
    data: {
      title: 'Online Order Detail'
    }
  },
  {
    path: 'update-sale-detail/:id', component: UpdateSaleDetailComponent,
    data: {
      title: 'Update Sale Detail'
    }
  },
  {
    path: 'refundsale-detail/:id', component: RefundSaleDetailComponent,
    data: {
      title: 'Refund Sale Detail'
    }
  },
  {
    path: 'hold-sale-detail/:id', component: HoldSaleDetailComponent,
    data: {
      title: 'Hold Sale Detail'
    }
  },
  {
    path: 'sale-stats', component: SaleStatsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Sale Stats',
      permissions: { only: SalesPermissionEnum.SubMenuStats, redirectTo: '/403' }
    }
  },
  {
    path: 'sale-stats-report', component: SaleStatsDetailComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Sale Stats Report',
      permissions: { only: SalesPermissionEnum.SubMenuStats, redirectTo: '/403' }
    }
  },
  {
    path: 'salereport-byproduct', component: SalereportByproductComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Sale Report By Product', permissions: { only: SalesPermissionEnum.SubMenuOverviewProductWise, redirectTo: '/403' }
    }
  },
  {
    path: 'salereport-byuser', component: SalereportByuserComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Sale Report By User', permissions: { only: SalesPermissionEnum.SubMenuOverviewUserWise, redirectTo: '/403' }
    }
  },
  {
    path: 'salereport-bysubcategory', component: SalereportBysubcategoryComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Sale Report By SubCategory', permissions: { only: SalesPermissionEnum.SubMenuOverviewSubCategoryWise, redirectTo: '/403' }
    }
  },
  //{ path: 'add-receipt', component: AddReceiptComponent, data: { title: 'Sale Invoice' } },
  {
    path: 'add-receipt-new', component: AddReceiptNewComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Sale Invoice', permissions: { only: [SalesPermissionEnum.AddSale, SalesPermissionEnum.AddHoldSale], redirectTo: '/403' }
    }
  },
  {
    path: 'add-receipt-new/:id', component: UpdateReceiptNewComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Sale Invoice', permissions: { only: SalesPermissionEnum.AddSale, redirectTo: '/403' }
    }
  },
  {
    path: 'add-receipt-by-order/:id', component: UpdateReceiptByOrderComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Sale Invoice', permissions: { only: SalesPermissionEnum.AddSaleByExternalIncomingOrder, redirectTo: '/403' }
    }
  },  
  {
    path: 'add-sale-refund/:id', component: AddSaleRefundComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Refund Sale Invoice', permissions: { only: SalesPermissionEnum.SaleRefund, redirectTo: '/403' }
    }
  },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
