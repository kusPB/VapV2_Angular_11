import { CashRegisterService } from './cash-register.service';
import { SharedModule } from './../../shared/shared.module';
import { CashRegisterOverviewComponent } from './cash-register-overview/cash-register-overview.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashRegisterRoutingModule } from './cash-register.routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';



@NgModule({
    // tslint:disable-next-line: max-line-length
    declarations: [
        CashRegisterOverviewComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        CashRegisterRoutingModule,
        NgxPermissionsModule.forChild(),
        TranslateModule.forChild({
            loader: {
              provide: TranslateModule,
              useFactory: httpTranslateLoader,
              deps: [HttpClient]
            }
          }),

    ],
    providers: [CashRegisterService]
})
export class CashRegisterModule { }
