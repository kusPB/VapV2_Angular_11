import { HelpListComponent } from './help-list/help-list.component';
import { HelpDetailComponent } from './help-list/help-detail/help-detail.component';
import { HelpComponent } from './help-list/help/help.component';
import { ClientSourceResolver } from './client/clientsource/clientsource-resolver';
import { ExtrasService } from './extras.service';
import { SharedModule } from './../../shared/shared.module';
import { OutletoverviewComponent } from './../extras/outlet/outletoverview/outletoverview.component';
import { AddUserComponent } from './../extras/users/add-user/add-user.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExtrasRoutingModule } from './extras-routing.module';
import { ExtrasComponent } from './extras.component';
import { PermissionsComponent } from './../extras/users/permissions/permissions.component';
import { PaymentconditionComponent } from 'src/app/modules/extras/client/paymentcondition/paymentcondition.component';
import { OverviewComponent } from 'src/app/modules/extras/expense/overview/overview.component';
import { ManageroleComponent } from 'src/app/modules/extras/users/managerole/managerole.component';
import { ExpensetypeoverviewComponent } from 'src/app/modules/extras/expense-type/expensetypeoverview/expensetypeoverview.component';
import { DeliverymethodComponent } from 'src/app/modules/extras/client/deliverymethod/deliverymethod.component';
import { CountryComponent } from 'src/app/modules/extras/regions/country/country.component';
import { ClientsourceComponent } from 'src/app/modules/extras/client/clientsource/clientsource.component';
import { CityComponent } from 'src/app/modules/extras/regions/city/city.component';
import { ManageuserComponent } from 'src/app/modules/extras/users/manageuser/manageuser.component';
import { ManagewagesComponent } from 'src/app/modules/extras/expense/managewages/managewages.component';
import { WagesIndexComponent } from 'src/app/modules/extras/expense/wages-index/wages-index.component';
import { StatesComponent } from 'src/app/modules/extras/regions/states/states.component';
import { DiscountManagementComponent } from 'src/app/modules/extras/discount-management/discount-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeliverymethodResolver } from './client/deliverymethod/clientsource-resolver';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ActivityComponent } from './activity/activity.component';
import { TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { TimelineModule } from "primeng/timeline";
import { HttpClient } from '@angular/common/http';
import { BackupHistoryComponent } from './dbBackup/backuphistory.component';

@NgModule({
  declarations: [
    ExtrasComponent,
    AddUserComponent,
    CityComponent,
    ClientsourceComponent,
    CountryComponent,
    DeliverymethodComponent,
    DiscountManagementComponent,
    ExpensetypeoverviewComponent,
    ManageroleComponent,
    ManageuserComponent,
    ManagewagesComponent,
    OutletoverviewComponent,
    OverviewComponent,
    PaymentconditionComponent,
    PermissionsComponent,
    StatesComponent,
    WagesIndexComponent,
    ActivityComponent,
    HelpComponent,
    HelpDetailComponent,
    BackupHistoryComponent,
    HelpListComponent
  ],
  imports: [
    CommonModule,
    TimelineModule,
    SharedModule,
    ExtrasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPermissionsModule.forChild(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateModule,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    ExtrasService,
    ClientSourceResolver,
    DeliverymethodResolver,
  ]
})
export class ExtrasModule { }
