import { SupplierinvoicesComponent } from './supplier/supplierinvoices/supplierinvoices.component';
import { AvailableStockComponent } from './stock/available-stock/available-stock.component';
import { VpOrdersComponent } from './shipments/vp-orders/vp-orders.component';

import { StockIndexPricesComponent } from './stock/stock-index-prices/stock-index-prices.component';
import { OnlineOrdersComponent } from './shipments/online-orders/online-orders.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockLocationDetailsComponent } from './stock/stock-location-details/stock-location-details.component';
import { StockShopCategoriesComponent } from './stock/stock-shop-categories/stock-shop-categories.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ReportPermissionEnum } from 'src/app/shared/constant/report-permission';
import { SingleProductLifeLineComponent } from './single-product-life-line/single-product-life-line.component';
import { CustomerLifeLineReportComponent } from './customer-life-line-report/customer-life-line-report.component';
import { SupplierLifeLineReportComponent } from './supplier-life-line-report/supplier-life-line-report.component';
import { StockIndexPricesDetailComponent } from './stock/stock-index-prices-detail/stock-index-prices-detail.component';
import { OpencartLogComponent } from './opencart/log/opencartlog.component';
import { StockModelComponent } from './stock/stock-model/stock-model.component';
import { ProductLocationDetailsComponent } from './stock/product-location-details/product-location-details.component';
import { PreOrderHistoryComponent } from './pre-order-history-report/pre-order-history.component';
import { StockAlertReportComponent } from './stock/stock-alert-report/stock-alert-report.component';
import { InventoryWorthReportComponent } from './inventory-worth-report/inventory-worth-report.component';
import { CustomerDashboardReportComponent } from './customer-dashboard-report/customer-dashboard-report.component';
import { CashInOutComponent } from './cash-in-out/cash-in-out.component';


const routes: Routes = [
  { path: '', component: OnlineOrdersComponent },
  {
    path: 'online-orders', component: OnlineOrdersComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'ONLINE ORDERS', permissions: { only: ReportPermissionEnum.OnlineOrdersReport, redirectTo: '/403' }
    }
  },
  {
    path: 'vp-orders', component: VpOrdersComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'VP ORDERS', permissions: { only: ReportPermissionEnum.VPOrders, redirectTo: '/403' }
    }
  },
  {
    path: 'cash-in-out', component: CashInOutComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Cash In Out', permissions: { only: ReportPermissionEnum.SubMenuCashInOut, redirectTo: '/403' }
    }
  },
  {
    path: 'opencartlogs', component: OpencartLogComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Open Cart Logs', permissions: { only: ReportPermissionEnum.OpencartLogsReport, redirectTo: '/403' }
    }
  },
  {
    path: 'available-stock', component: AvailableStockComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'STOCK REPORT', permissions: { only: ReportPermissionEnum.StockListing, redirectTo: '/403' }
    }
  },
  {
    path: 'stock-by-models', component: StockModelComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'STOCK BY PRODUCT MODELS REPORT', permissions: { only: ReportPermissionEnum.StockReportByModels, redirectTo: '/403' }
    }
  },
  {
    path: 'stock-index-prices', component: StockIndexPricesComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'STOCK REPORT', permissions: { only: ReportPermissionEnum.SubMenuStockPurchasePrice, redirectTo: '/403' }
    }
  },
  {
    path: 'stock-index-prices-detail', component: StockIndexPricesDetailComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'STOCK REPORT', permissions: { only: ReportPermissionEnum.SubMenuStockPurchasePrice, redirectTo: '/403' }
    }
  },
  {
    path: 'stock-location-details', component: StockLocationDetailsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'STOCK REPORT WITH LOCATION DETAILS', permissions: { only: ReportPermissionEnum.SubMenuStockLocation, redirectTo: '/403' }
    }
  },
  {
    path: 'product-location-details', component: ProductLocationDetailsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'All PRODUCTS WITH LOCATION DETAILS', permissions: { only: ReportPermissionEnum.SubMenuStockLocation, redirectTo: '/403' }
    }
  },
  {
    path: 'stock-shop-categories', component: StockShopCategoriesComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'STOCK REPORT BY SHOP CATEGORIES', permissions: { only: ReportPermissionEnum.StockbyShopCategories, redirectTo: '/403' }
    }
  },
  {
    path: 'supplier-invoices', component: SupplierinvoicesComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Supplier Invoice Payments Report', permissions: {
        only: [ReportPermissionEnum.SubMenuSupplierInvoices, ReportPermissionEnum.SubMenuInvoicePayments],
        redirectTo: '/403'
      }
    }
  },
  {
    path: 'single-product-life-line', component: SingleProductLifeLineComponent,
    data: {
      title: 'Single Product Life Line', permissions: { only: ReportPermissionEnum.SingleProductLifeLine, redirectTo: '/403' }
    }
  },
  {
    path: 'customer-life-line-report', component: CustomerLifeLineReportComponent,
    data: {
      title: 'Customer Life Line Report', permissions: { only: ReportPermissionEnum.CustomerLifeLlineReport, redirectTo: '/403' }
    }
  },
  {
    path: 'supplier-life-line-report', component: SupplierLifeLineReportComponent,
    data: {
      title: 'supplier Life Line Report',
      permissions: { only: ReportPermissionEnum.SupplierLifeLlineReport, redirectTo: '/403' }
    }
  },

  {
    path: 'customer-dashboard-report', component: CustomerDashboardReportComponent,
    data: {
      title: 'Customer Dashboard Report', permissions: { only: ReportPermissionEnum.CustomerLifeLlineReport, redirectTo: '/403' }
    }
  },

  {
    path: 'pre-order-history/:id', component: PreOrderHistoryComponent,
    data: {
      title: 'Pre Order History',
      //  permissions: { only: ReportPermissionEnum.CustomerLifeLlineReport, redirectTo: '/403' 
    }
  },
  {
    path: 'stock-alert-report', component: StockAlertReportComponent,
    data: {
      title: 'Stock Alert Report',
      permissions: { only: ReportPermissionEnum.StockAlertReport, redirectTo: '/403' }    }
  },
  {
    path: 'inventory-value-report', component: InventoryWorthReportComponent,
    data: {
      title: 'Inventory Value Report',
      permissions: { only: ReportPermissionEnum.InventoryValueReport, redirectTo: '/403' }    }
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
