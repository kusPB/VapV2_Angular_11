import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../../Helper/models/UserModel';
import { Router } from '@angular/router';
import { vaplongapi } from '../../Service/vaplongapi.service';
import { NgxPermissionsService } from 'ngx-permissions';
/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
    providedIn: 'root'
})
export class CredentialsService {
    static instance: CredentialsService;
    private _credentials: any | null = null;
    private decodedToken: any | null = null;
    private _loginType: string | null = null;
    usermodel: UserModel;
    public permissions: any = [];
    constructor(
        private apiService: vaplongapi,
        private router: Router,
        public permissionsService: NgxPermissionsService,
        private storageService: StorageService
    ) {
        CredentialsService.instance = this;
        this.loadPermission();
    }
    logout() {
        this.usermodel = this.storageService.getItem('UserModel');;
        this.removeAllPermission();
        localStorage.clear();
        sessionStorage.clear();
        const obj = {
            Action: 'Logout',
            Description: `logout at ${new Date().toLocaleDateString()}`,
            PerformedAt: new Date().toISOString(),
            UserID: this.usermodel.ID
        }
        this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
        this.navigateToLogin();
    }
    isAuthenticated(): boolean {
        this.usermodel = this.storageService.getItem('UserModel');;
        return !!this.usermodel;
    }
    removeAllPermission() {
        this.permissionsService.flushPermissions();
    }
    getPermission() {
        this.usermodel = JSON.parse(localStorage.getItem('Permission'));
        const request = { ID: this.usermodel.ID }
        this.apiService.GetUserAuthorization(request).subscribe(x => {
            if (x.ResponseCode == 0) {
                this.removeAllPermission();
                this.permissions = x.GetAuthorizeActionItemList.filter(x => x.IsAuthorize).map(x => x.ActionName);
                this.permissionsService.loadPermissions(this.permissions);
            } else {
                this.removeAllPermission();
                this.permissions = [];
            }
        });
    }
    navigateToLogin() {
        this.router.navigate(['/login']);
    }
    loadPermission() {
        if (!this.isAuthenticated()) {
            this.navigateToLogin();
            return;
        }
        this.usermodel = this.storageService.getItem('UserModel');;
        const request = { ID: this.usermodel.ID }

        const perm = this.storageService.getItem('Permissions');
        if (perm) {
            this.permissionsService.loadPermissions(perm);
            return;
        }

        this.apiService.GetUserAuthorization(request).subscribe(x => {
            if (x.ResponseCode == 0) {
                this.removeAllPermission();
                this.permissions = x.GetAuthorizeActionItemList.filter(x => x.IsAuthorize).map(x => x.ActionName);
                this.storageService.setItem('Permissions', this.permissions);
                this.permissionsService.loadPermissions(this.permissions);
                this.CheckUserOpenCashRegisterByUserID();
            } else {
                this.removeAllPermission();
                this.permissions = [];
                //this.CheckUserOpenCashRegisterByUserID();
            }
        });
    }

    CheckUserOpenCashRegisterByUserID() {
        this.usermodel = this.storageService.getItem('UserModel');
        const param = { ID: this.usermodel.ID};
        this.apiService.CheckUserOpenCashRegisterByUserID(param).subscribe(response => {
          if (response.ResponseCode === 0) {
            if (response.CashRegisterHistoryID === -1) {
              //localStorage.setItem('CashRegisterHistoryID', null);
              this.storageService.setItem('CashRegisterHistoryID', 1);
    
            }
            else {
              const data = JSON.stringify(response.CashRegisterHistoryID);
              //localStorage.setItem('CashRegisterHistoryID', data);
              this.storageService.setItem('CashRegisterHistoryID', data);
    
            }
            this.router.navigate(['/dashboard']);
            //this.router.navigate(['/customer/customer-payments']);
          }
          else if (response.ResponseCode === 129) {
            const data = JSON.stringify(response.CashRegisterHistoryID);
            //localStorage.setItem('CashRegisterHistoryID', data);
            this.storageService.setItem('CashRegisterHistoryID', data);
            
              this.router.navigate(['/dashboard']);
            //this.router.navigate(['/customer/customer-payments']);
    
          }
        });
      }

}