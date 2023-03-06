import { CashRegisterOverviewComponent } from './cash-register-overview/cash-register-overview.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CashRegisterPermissionEnum } from 'src/app/shared/constant/cash-register-permission';
const routes: Routes = [
  { path: '', component: CashRegisterOverviewComponent },
  { 
    path: 'register', component: CashRegisterOverviewComponent ,
    canActivate: [NgxPermissionsGuard],
     data: { title: 'Cash Register' , permissions: { only: CashRegisterPermissionEnum.CashRegisterListing, redirectTo: '/403' }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashRegisterRoutingModule { }
