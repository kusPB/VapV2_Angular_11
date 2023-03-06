// import { NotFoundComponent } from './../../shared/not-found/not-found.component';
import { Routes, Route } from '@angular/router';
import { AppNotfoundComponent } from 'src/app/pages/app.notfound.component';
import { ShellPermissionEnum } from 'src/app/shared/constant/shell-permission';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { DashboardNewComponent } from './dashboardNew/dashboard/dashboardNew.component';

import { ShellComponent } from './shell.component';
// import { AuthenticationGuard } from '@app/services/authentication/authentication.guard';

/**
 * Provides helper methods to create routes.
 */
export class Shell {
  /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return The new route using shell as the base.
   */
  
  static childRoutes(routes: Routes): Route {
    return {
      path: '',
      component: ShellComponent,
      children: [
        ...routes,       
        
        {
          path: 'dashboard', component: DashboardComponent,
          data: { title: 'Dashboard', permissions: { only: ShellPermissionEnum.SubMenuDashboard, redirectTo: '/403' } }
        },
        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

       
        
        { path: '403', component: AppNotfoundComponent, pathMatch: 'full' },
        // { path: '404', component: NotFoundComponent, pathMatch: 'full' },
        // { path: '**', redirectTo: '/404', pathMatch: 'full' }
      ],
      // canActivate: [AuthenticationGuard],
      // Reuse ShellComponent instance when navigating between child views
      data: { reuse: false, breadcrumb: 'Dashboard' }
    };
  }
}
