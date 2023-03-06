import { Input } from '@angular/core';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CredentialsService } from 'src/app/shared/services/credentials.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent implements OnInit, OnDestroy {

  private routerSubscription: Subscription;
  breadcrumbs: MenuItem[];
  loading = false;
  show = false;
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly changeDetector: ChangeDetectorRef,

    /* private breadcrumbService: BreadcrumbService, */) {
  }

  ngOnInit() {
    this.subscribeOnRouterEvents();
    this.initBreadcrumbs();

  }

  ngOnDestroy() {
    if (this.routerSubscription)
      this.routerSubscription.unsubscribe();
  }

  private subscribeOnRouterEvents() {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.initBreadcrumbs();
      this.changeDetector.markForCheck();
    });
  }

  private initBreadcrumbs() {
    this.breadcrumbs = [
      { label: '', routerLink: '' }
    ];

    let currentRoute = this.activatedRoute.root;
    let url = '';

    do {
      const childrenRoutes = currentRoute.children;
      currentRoute = null;

      childrenRoutes.forEach((route: any) => {
        if (route.outlet !== 'primary')
          return;

        const routeSnapshot = route.snapshot;
        url += '/' + routeSnapshot.url.map(segment => segment.path).join('/');

        if (route.snapshot.data.title) {
          // const userType = route.queryParams.value['user-type'];
          // const prefix = userType ? userType.charAt(0).toUpperCase() + userType.slice(1) + ' ' : '';
          let title = route.snapshot.data.title.toUpperCase();
          this.breadcrumbs.push({
            label: title,
            routerLink: url
          });
          /*     this.breadcrumbService.setItems([
                { label: route.snapshot.data.title }
              ]); */
        }
        currentRoute = route;
      });
    } while (currentRoute);
  }
}
