import { HelpDetailComponent } from './help-list/help-detail/help-detail.component';
import { DeliverymethodResolver } from './client/deliverymethod/clientsource-resolver';
import { ClientSourceResolver } from './client/clientsource/clientsource-resolver';
import { PaymentconditionComponent } from './../extras/client/paymentcondition/paymentcondition.component';
import { PermissionsComponent } from './../extras/users/permissions/permissions.component';

import { OverviewComponent } from './../extras/expense/overview/overview.component';
import { ManageroleComponent } from './../extras/users/managerole/managerole.component';
import { ExpensetypeoverviewComponent } from './../extras/expense-type/expensetypeoverview/expensetypeoverview.component';
import { DeliverymethodComponent } from './../extras/client/deliverymethod/deliverymethod.component';
import { CountryComponent } from './../extras/regions/country/country.component';
import { ClientsourceComponent } from './../extras/client/clientsource/clientsource.component';
import { CityComponent } from './../extras/regions/city/city.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUserComponent } from './../extras/users/add-user/add-user.component';
import { ManageuserComponent } from './../extras/users/manageuser/manageuser.component';
import { ManagewagesComponent } from './../extras/expense/managewages/managewages.component';
import { WagesIndexComponent } from './../extras/expense/wages-index/wages-index.component';
import { StatesComponent } from './../extras/regions/states/states.component';
import { DiscountManagementComponent } from './../extras/discount-management/discount-management.component';

import { ExtrasComponent } from './extras.component';
import { OutletoverviewComponent } from './../extras/outlet/outletoverview/outletoverview.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ExtrasPermissionEnum } from 'src/app/shared/constant/extras-permission';
import { ActivityComponent } from './activity/activity.component';
import { HelpComponent } from './help-list/help/help.component';
import { HelpListComponent } from './help-list/help-list.component';
import { BackupHistoryComponent } from './dbBackup/backuphistory.component';

const routes: Routes = [
  { path: '', component: ExtrasComponent },
  {
    path: 'discount-management', component: DiscountManagementComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Discount Management', permissions: { only: ExtrasPermissionEnum.SubMenuDiscountGroups, redirectTo: '/403' }
    }
  },
  {
    path: 'add-user', component: AddUserComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Add User', permissions: { only: ExtrasPermissionEnum.UsersListing, redirectTo: '/403' }
    }
  },
  {
    path: 'add-user/:id', component: AddUserComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Add User', permissions: { only: [ExtrasPermissionEnum.UsersListing, ExtrasPermissionEnum.UpdateUserRole], redirectTo: '/403' }
    }
  },
  {
    path: 'city', component: CityComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'City', permissions: { only: ExtrasPermissionEnum.SubMenuCity, redirectTo: '/403' }
    }
  },
  {
    path: 'client-source', component: ClientsourceComponent, resolve: { data: ClientSourceResolver },
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Client Sources', permissions: { only: ExtrasPermissionEnum.ClientSourceListing, redirectTo: '/403' }
    }
  },
  {
    path: 'country', component: CountryComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Country', permissions: { only: ExtrasPermissionEnum.SubMenuCountry, redirectTo: '/403' }
    }
  },
  {
    path: 'delivery-method', component: DeliverymethodComponent, resolve: { data: DeliverymethodResolver },
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Delivery Method', permissions: { only: ExtrasPermissionEnum.ShippingMethodListing, redirectTo: '/403' }
    }
  },

  {
    path: 'expense-type-overview', component: ExpensetypeoverviewComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Expense Type', permissions: { only: ExtrasPermissionEnum.ExpenseTypesListing, redirectTo: '/403' }
    }
  },
  {
    path: 'manage-role', component: ManageroleComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Manage Roles', permissions: { only: ExtrasPermissionEnum.RoleListing, redirectTo: '/403' }
    }
  },
  {
    path: 'activity', component: ActivityComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'activity role', permissions: { only: ExtrasPermissionEnum.Activity, redirectTo: '/403' }
    }
  },
  {
    path: 'manage-user', component: ManageuserComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'User', permissions: { only: ExtrasPermissionEnum.SubMenuManageUsers, redirectTo: '/403' }
    }
  },
  {
    path: 'managewages', component: ManagewagesComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Wage', permissions: { only: ExtrasPermissionEnum.AddWage, redirectTo: '/403' }
    }
  },
  {
    path: 'wages-overview', component: WagesIndexComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Wages', permissions: { only: ExtrasPermissionEnum.WagesListing, redirectTo: '/403' }
    }
  },
  {
    path: 'expense-overview', component: OverviewComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Expense', permissions: { only: ExtrasPermissionEnum.ExpensesListing, redirectTo: '/403' }
    }
  },
  {
    path: 'payment-condition', component: PaymentconditionComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Payment Condition', permissions: { only: ExtrasPermissionEnum.PaymentConditionListing, redirectTo: '/403' }
    }
  },
  {
    path: 'backup-database', component: BackupHistoryComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Database Backup', permissions: { only: ExtrasPermissionEnum.DatabaseBackupHistory, redirectTo: '/403' }
    }
  },
  {
    path: 'permissions/:id', component: PermissionsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Role Permissions', permissions: { only: [ExtrasPermissionEnum.PermissionsListing, ExtrasPermissionEnum.AssignRolePermissions], redirectTo: '/403' }
    }
  },
  {
    path: 'states', component: StatesComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'State', permissions: { only: ExtrasPermissionEnum.SubMenuState, redirectTo: '/403' }
    }
  },
  {
    path: 'outlet-overview', component: OutletoverviewComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Outlet', permissions: { only: ExtrasPermissionEnum.OutletsListing, redirectTo: '/403' }
    }
  },
  {
    path: 'help', component: HelpComponent,
    data: {
      title: 'Development Activity',
    }
  },
  {
    path: 'help-list', component: HelpListComponent,
    data: {
      title: 'Development Activity',
    }
  },
  {
    path: 'help-detail/:id', component: HelpDetailComponent,
    data: {
      title: 'Development Activity Detail',
    }
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtrasRoutingModule { }
