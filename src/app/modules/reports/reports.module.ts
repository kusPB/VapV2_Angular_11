import { AvailableStockComponent } from './stock/available-stock/available-stock.component';
import { SupplierinvoicesComponent } from './supplier/supplierinvoices/supplierinvoices.component';

import { StockShopCategoriesComponent } from './stock/stock-shop-categories/stock-shop-categories.component';
import { StockLocationDetailsComponent } from './stock/stock-location-details/stock-location-details.component';
import { ReportsRoutingModule } from './reports.routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineOrdersComponent } from './shipments/online-orders/online-orders.component';
import { StockIndexPricesComponent } from './stock/stock-index-prices/stock-index-prices.component';
import { VpOrdersComponent } from './shipments/vp-orders/vp-orders.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SingleProductLifeLineComponent } from './single-product-life-line/single-product-life-line.component';
import { CustomerLifeLineReportComponent } from './customer-life-line-report/customer-life-line-report.component';
import { TabViewModule } from 'primeng/tabview';
import { TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
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


@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [
    OnlineOrdersComponent,
    VpOrdersComponent,
    AvailableStockComponent,
    StockIndexPricesComponent,
    StockLocationDetailsComponent,
    StockShopCategoriesComponent,
    SupplierinvoicesComponent,
    SingleProductLifeLineComponent,
    CustomerLifeLineReportComponent,
    SupplierLifeLineReportComponent,
    StockIndexPricesDetailComponent,
    OpencartLogComponent,
    ProductLocationDetailsComponent,
    StockModelComponent,
    PreOrderHistoryComponent,
    StockAlertReportComponent,
    CustomerDashboardReportComponent,
    InventoryWorthReportComponent,
    CashInOutComponent

  ],
  imports: [
    CommonModule,
    SharedModule,
    ReportsRoutingModule,
    NgxPermissionsModule.forChild(),
    TabViewModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateModule,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),

  ]
})
export class ReportsModule { }
