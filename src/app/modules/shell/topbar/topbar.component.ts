/* import { BreadcrumbService } from './../../../app.breadcrumb.service'; */
// import { AppMainComponent } from './../../../app.main.component';
import {Component, OnDestroy} from '@angular/core';
// import { BreadcrumbService } from './app.breadcrumb.service';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ShellComponent } from '../shell.component';
import { CredentialsService } from 'src/app/shared/services/credentials.service';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ChangePasswordRequest } from 'src/app/Helper/models/ChangePasswordRequest';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { ExtrasPermissionEnum } from 'src/app/shared/constant/extras-permission';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

export class AppTopBarComponent implements OnDestroy{
    ExtrasPermission = ExtrasPermissionEnum;
    subscription: Subscription;
    changepasswordrequest:ChangePasswordRequest;
    displayPasswordPopup = false;
    confirmnewpassword ='';
    items: MenuItem[];
    public usermodel: UserModel;

    constructor(private apiService: vaplongapi, private readonly credentialsService: CredentialsService, public app: ShellComponent,private notificationService: NotificationService,private storageService:StorageService) {
    /*     this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
            this.items = response;
        }); */
        this.usermodel = this.storageService.getItem("UserModel");
        this.changepasswordrequest = new ChangePasswordRequest();

    }
    logout() {
        this.credentialsService.logout();
      }

      OpenChangePasswordPopUp(ID) {

        this.changepasswordrequest = new ChangePasswordRequest();
        this.changepasswordrequest.UserID = ID;
        this.changepasswordrequest.UpdatedByUserID = this.usermodel.ID;
        this.changepasswordrequest.OldPassword = '12345';
        this.displayPasswordPopup = true;
        this.confirmnewpassword = '';
      }
      PasswordClosedPopUp() {
        this.displayPasswordPopup = false;
      }
      ChangePassword() {

        if (this.confirmnewpassword !== this.changepasswordrequest.NewPassword) {
          this.notificationService.notify(NotificationEnum.ERROR, 'error', 'The specified passwords does not match');
        }
        else {
          this.apiService.ChangePasswordBySuperadmin(this.changepasswordrequest).pipe(untilDestroyed(this)).subscribe((response: any) => {
            if (response.ResponseText === 'success' || response.ResponseCode === 0) {
              this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'password changed successfully');
              this.displayPasswordPopup = false;
            }
            else if (response.ResponseCode === 108) {
              this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Already Exist');
            }
            else {
              this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server Error ! try again');
            }
          },
            error => {
              this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server error !  not getting api data');
            }
          );
        }
      }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
