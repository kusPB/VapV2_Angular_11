import { AppComponent } from './app.component';
import { Shell } from './modules/shell/shell.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  Shell.childRoutes([
    // {
    //   path: 'dashboard',
    //   component: dash
    //   // loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule),
    //   // data: { title: ('Dashboard'), breadcrumb: '' }
    // },
    {
      path: 'sale',
      loadChildren: () => import('../app/modules/sales/sales.module').then(m => m.SalesModule),
    },
    {
      path: 'cashregister',
      loadChildren: () => import('../app/modules/cash-register/cash-register.module').then(m => m.CashRegisterModule),
    },
    {
      path: 'catalog',
      loadChildren: () => import('../app/modules/catalog/catalog.module').then(m => m.CatalogModule),
    },
    {
      path: 'customer',
      loadChildren: () => import('../app/modules/customer/customer.module').then(m => m.CustomerModule),
    },
    {
      path: 'extras',
      loadChildren: () => import('../app/modules/extras/extras.module').then(m => m.ExtrasModule),
    },
    {
      path: 'orders',
      loadChildren: () => import('../app/modules/orders/orders.module').then(m => m.OrdersModule),
    },
    {
      path: 'purchase',
      loadChildren: () => import('../app/modules/purchase/purchase.module').then(m => m.PurchaseModule),
    },
    {
      path: 'reports',
      loadChildren: () => import('../app/modules/reports/reports.module').then(m => m.ReportsModule),
    },
    {
      path: 'supplier',
      loadChildren: () => import('../app/modules/supplier/supplier.module').then(m => m.SupplierModule),
    },

  ])
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
