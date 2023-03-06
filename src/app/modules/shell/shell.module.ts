import { NotificationService } from './services/notification.service';
import { NotificationsComponent } from './notifications/notifications.component';
import { MenuModule } from 'primeng/menu';
import { SharedModule } from './../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { AppSearchComponent } from './search/search.component';
import { AppRightmenuComponent } from './rightmenu/rightmenu.component';
import { AppMenuComponent } from './menu/menu.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellComponent } from './shell.component';
import { AsideComponent } from './aside/aside.component';
import { AppConfigComponent } from './config/config.component';
import { AppFooterComponent } from './footer/footer.component';
import { AppTopBarComponent } from './topbar/topbar.component';
import { MenuService } from './menu/menu.service';
import { MenubarModule } from 'primeng/menubar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppMenuitemComponent } from './menu/app.menuitem.component';
import { BreadcrumbComponent } from './breadcrumbs/breadcrumb.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AppNotfoundComponent } from 'src/app/pages/app.notfound.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { DashboardNewComponent } from './dashboardNew/dashboard/dashboardNew.component';

import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    MenuModule,
    MenubarModule,
    BreadcrumbModule,
    NgxPermissionsModule.forChild(),
    TooltipModule
    // NotificationService,
  ],
  declarations: [
    ShellComponent,
    AsideComponent,
    AppConfigComponent,
    AppFooterComponent,
    HeaderComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    AppRightmenuComponent,
    AppSearchComponent,
    AppTopBarComponent,
    BreadcrumbComponent,
    NotificationsComponent,
    AppNotfoundComponent,
    DashboardComponent,
    DashboardNewComponent
  ],
  providers: [
    MenuService
  ]
})
export class ShellModule { }
