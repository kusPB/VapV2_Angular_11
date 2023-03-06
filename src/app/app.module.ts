import { SalesModule } from './modules/sales/sales.module';
import { LoginModule } from './modules/login/login.module';
import { SharedModule } from './shared/shared.module';
import { RouterModule } from '@angular/router';
import { ShellModule } from './modules/shell/shell.module';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';



import { AppCodeModule } from './app.code.component';
import { AppComponent } from './app.component';
import { DashboardDemoComponent } from './demo/view/dashboarddemo.component';
import { FormLayoutDemoComponent } from './demo/view/formlayoutdemo.component';
import { InputDemoComponent } from './demo/view/inputdemo.component';
import { ButtonDemoComponent } from './demo/view/buttondemo.component';
import { TableDemoComponent } from './demo/view/tabledemo.component';
import { ListDemoComponent } from './demo/view/listdemo.component';
import { TreeDemoComponent } from './demo/view/treedemo.component';
import { PanelsDemoComponent } from './demo/view/panelsdemo.component';
import { OverlaysDemoComponent } from './demo/view/overlaysdemo.component';
import { MenusDemoComponent } from './demo/view/menusdemo.component';
import { MessagesDemoComponent } from './demo/view/messagesdemo.component';
import { MiscDemoComponent } from './demo/view/miscdemo.component';
import { EmptyDemoComponent } from './demo/view/emptydemo.component';
import { ChartsDemoComponent } from './demo/view/chartsdemo.component';
import { FileDemoComponent } from './demo/view/filedemo.component';
import { DocumentationComponent } from './demo/view/documentation.component';
import { DisplayComponent } from './utilities/display.component';
import { ElevationComponent } from './utilities/elevation.component';
import { FlexboxComponent } from './utilities/flexbox.component';
import { GridComponent } from './utilities/grid.component';
import { IconsComponent } from './utilities/icons.component';
import { WidgetsComponent } from './utilities/widgets.component';
import { SpacingComponent } from './utilities/spacing.component';
import { TypographyComponent } from './utilities/typography.component';
import { TextComponent } from './utilities/text.component';
import { AppCrudComponent } from './pages/app.crud.component';
import { AppCalendarComponent } from './pages/app.calendar.component';
import { AppInvoiceComponent } from './pages/app.invoice.component';
import { AppHelpComponent } from './pages/app.help.component';
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { AppErrorComponent } from './pages/app.error.component';
import { AppAccessdeniedComponent } from './pages/app.accessdenied.component';
import { AppLoginComponent } from './pages/app.login.component';


import { CountryService } from './demo/service/countryservice';
import { CustomerService } from './demo/service/customerservice';
import { EventService } from './demo/service/eventservice';
import { IconService } from './demo/service/iconservice';
import { NodeService } from './demo/service/nodeservice';
import { PhotoService } from './demo/service/photoservice';
import { ProductService } from './demo/service/productservice';
// import {BreadcrumbService} from './app.breadcrumb.service';
import { ApiService } from './../app/shared/api.service';
import { ResolverService } from '../app/shared/resolver.service';
import { ProductCounterResolverService } from '../app/shared/Product-counter-resolver.service';
import { InterceptorService } from "src/app/shared/services/spinner-interceptor.service";
import { MessageService } from 'primeng/api';
import { NotificationService } from './modules/shell/services/notification.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PermissionService, loadPermissionsFactory } from "./shared/services/permission.service";
import { AuthInterceptor } from './Service/auth.interceptor';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    AppCodeModule,
    LoginModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ShellModule,
    NgxPermissionsModule.forRoot()
    //   SalesModule,
    //   CashRegisterModule,

  ],
  declarations: [
    AppComponent,
    DashboardDemoComponent,
    FormLayoutDemoComponent,
    InputDemoComponent,
    ButtonDemoComponent,
    TableDemoComponent,
    ListDemoComponent,
    TreeDemoComponent,
    PanelsDemoComponent,
    OverlaysDemoComponent,
    MenusDemoComponent,
    MessagesDemoComponent,
    MessagesDemoComponent,
    MiscDemoComponent,
    ChartsDemoComponent,
    EmptyDemoComponent,
    FileDemoComponent,
    DocumentationComponent,
    DisplayComponent,
    ElevationComponent,
    FlexboxComponent,
    GridComponent,
    IconsComponent,
    WidgetsComponent,
    SpacingComponent,
    TypographyComponent,
    TextComponent,
    AppCrudComponent,
    AppCalendarComponent,
    AppLoginComponent,
    AppInvoiceComponent,
    AppHelpComponent,
    // AppNotfoundComponent,
    AppErrorComponent,
    AppAccessdeniedComponent,

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      deps: [PermissionService],
      useFactory: loadPermissionsFactory,
      multi: true
    },
    MessageService,
    NotificationService,
    // {provide: LocationStrategy, useClass: HashLocationStrategy},
    CountryService, CustomerService, EventService, IconService, NodeService,
    PhotoService, ProductService, /* MenuService, */ /* BreadcrumbService,  */ApiService, ResolverService, ProductCounterResolverService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}