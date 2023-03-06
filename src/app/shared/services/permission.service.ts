import { Injectable } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { CredentialsService } from "./credentials.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  static instance: PermissionService;
  constructor(public permissionsService: NgxPermissionsService, public credentialsService: CredentialsService) {
    PermissionService.instance = this;
  }

  setPermission(data: any) {
    this.permissionsService.loadPermissions(data);
  }
  getPermissionAccess(permission: any) {
    const res = this.permissionsService.getPermission(permission);
    return res;
  }

  addPermission(data: any | any[]) {
    this.permissionsService.addPermission(data);
  }

  getPermission(): any {
    return this.permissionsService.getPermissions();
  }

  removeAllPermission() {
    this.permissionsService.flushPermissions();
  }

  loadPermissions() {
    this.credentialsService.loadPermission();
  }
}

export function loadPermissionsFactory(permissionService: PermissionService) {
  return () => permissionService.loadPermissions();
}
