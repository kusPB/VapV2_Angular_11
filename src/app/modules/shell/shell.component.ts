import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
// import { ActivatedRoute, Router } from '@angular/router';
// import { UserModel } from '../app/Helper/models/UserModel';
import { MenuService } from './menu/menu.service';
import { UserModel } from '../../Helper/models/UserModel';
import { Router } from '@angular/router';
import { HttpStateService } from 'src/app/shared/services/http-state.service';
import { CredentialsService } from 'src/app/shared/services/credentials.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { Observable } from 'rxjs';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit, OnDestroy {
  items: MenuItem[];
  // menuMode = 'static';
  menuMode = 'slim';
  // menuMode = 'overlay';
  public usermodel: UserModel;
  colorScheme = 'light';
  // for vaplong 
  //menuTheme = 'layout-sidebar-darkgray';
	// for mcservices 
  //menuTheme = 'layout-sidebar-blue';
  menuTheme = environment.MENU_THEME;
  
  overlayMenuActive: boolean;
  staticMenuDesktopInactive: boolean;
  staticMenuMobileActive: boolean;
  menuClick: boolean;
  search = false;
  searchClick = false;
  userMenuClick: boolean;
  topbarUserMenuActive: boolean;
  notificationMenuClick: boolean;
  topbarNotificationMenuActive: boolean;
  rightMenuClick: boolean;
  rightMenuActive: boolean;
  configActive: boolean;
  configClick: boolean;
  resetMenu: boolean;
  menuHoverActive = false;
  inputStyle = 'outlined';
  ripple: boolean;
  bcLoadedData;
  bcForDisplay; loading = false;
  observableRef;
  show = false;
  constructor(
    private menuService: MenuService, private primengConfig: PrimeNGConfig, private router: Router,
    private httpStateService: HttpStateService, private storageService: StorageService,private apiService: vaplongapi 

  ) { }
ngOnDestroy(): void {
  
}
  ngOnInit() {
    this.usermodel = this.storageService.getItem('UserModel');
    if (this.usermodel == null) {
      this.router.navigate(['/login']);
      return;
    }
    else if (this.usermodel.ID < 0) {
      this.router.navigate(['/login']);
      return;
    }
    this.primengConfig.ripple = true;
    this.httpStateService.state.pipe(untilDestroyed(this)).subscribe((progress: any) => {
      // if (progress && progress.url) {
      // if (!this.filterBy) {
      this.loading = progress;
      this.show = (progress) ? false : true;
      // } else if (progress.url.indexOf(this.filterBy) !== -1) {
      //   this.loading = (progress.state === HttpProgressState.start) ? true : false;
      // }
      // }
    });
  
    

  }

  onLayoutClick() {
    if (!this.searchClick) {
      this.search = false;
    }

    if (!this.userMenuClick) {
      this.topbarUserMenuActive = false;
    }

    if (!this.notificationMenuClick) {
      this.topbarNotificationMenuActive = false;
    }

    if (!this.rightMenuClick) {
      this.rightMenuActive = false;
    }

    if (!this.menuClick) {
      if (this.isSlim()) {
        this.menuService.reset();
      }

      if (this.overlayMenuActive || this.staticMenuMobileActive) {
        this.hideOverlayMenu();
      }

      this.menuHoverActive = false;
      this.unblockBodyScroll();
    }

    if (this.configActive && !this.configClick) {
      this.configActive = false;
    }

    this.searchClick = false;
    this.configClick = false;
    this.userMenuClick = false;
    this.rightMenuClick = false;
    this.notificationMenuClick = false;
    this.menuClick = false;
  }

  onMenuButtonClick(event) {
    this.menuClick = true;
    this.topbarUserMenuActive = false;
    this.topbarNotificationMenuActive = false;
    this.rightMenuActive = false;

    // if (this.isOverlay()) {
    //     this.overlayMenuActive = !this.overlayMenuActive;
    // }

    if (this.isDesktop()) {
      this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
    } else {
      this.staticMenuMobileActive = !this.staticMenuMobileActive;
      if (this.staticMenuMobileActive) {
        this.blockBodyScroll();
      } else {
        this.unblockBodyScroll();
      }
    }

    event.preventDefault();
  }

  onSearchClick(event) {
    this.search = !this.search;
    this.searchClick = !this.searchClick;
  }

  onMenuClick($event) {
    this.menuClick = true;
    this.resetMenu = false;
  }

  onTopbarUserMenuButtonClick(event) {
    this.userMenuClick = true;
    this.topbarUserMenuActive = !this.topbarUserMenuActive;

    this.hideOverlayMenu();

    event.preventDefault();
  }

  onTopbarNotificationMenuButtonClick(event) {
    this.notificationMenuClick = true;
    this.topbarNotificationMenuActive = !this.topbarNotificationMenuActive;

    this.hideOverlayMenu();

    event.preventDefault();
  }

  onRightMenuClick(event) {
    this.rightMenuClick = true;
    this.rightMenuActive = !this.rightMenuActive;

    this.hideOverlayMenu();

    event.preventDefault();
  }

  onRippleChange(event) {
    this.ripple = event.checked;
  }

  onConfigClick(event) {
    this.configClick = true;
  }

  isSlim() {
    return this.menuMode === 'slim';
  }

  isOverlay() {
    return this.menuMode === 'overlay';
  }

  isDesktop() {
    return window.innerWidth > 991;
  }

  isMobile() {
    return window.innerWidth <= 991;
  }

  hideOverlayMenu() {
    this.overlayMenuActive = false;
    this.staticMenuMobileActive = false;
  }

  blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll');
    } else {
      document.body.className += ' blocked-scroll';
    }
  }

  unblockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll');
    } else {
      document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
        'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }
}
