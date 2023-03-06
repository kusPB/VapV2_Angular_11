import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
;
/* import { BreadcrumbService } from '../../app.breadcrumb.service'; */
import { UserModel } from '../../../Helper/models/UserModel';
import { CredentialsService } from 'src/app/shared/services/credentials.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { AuthService } from 'src/app/Service/auth.service';
import { NotificationService } from '../../shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { ShellPermissionEnum } from 'src/app/shared/constant/shell-permission';
import { ignoreElements } from 'rxjs/operators';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { Login } from 'src/app/Helper/models/Login';


@Component({
  selector: 'app-login',
  templateUrl: './logineo.component.html',
  styleUrls: ['./logineo.component.scss']
})
export class LoginEOComponent implements OnInit, OnDestroy {
  public loginmodel: Login;
  public usermodel: UserModel;
  IsSpinner = false;
  constructor(
    private vaplongservice: vaplongapi, public router: Router, private authService: AuthService,
    private credentialsService: CredentialsService,private permission: PermissionService, private storageService: StorageService, private notificationService: NotificationService) {
    localStorage.clear();
    this.loginmodel = new Login();

  }
  ngOnDestroy() {

  }
  ngOnInit(): void {
  }
  validateFields() {
    // tslint:disable-next-line: deprecation
    if(this.loginmodel.UserName==null || this.loginmodel.UserName==""|| this.loginmodel.UserName==undefined) {
      // this.notificationService.notify(
      //   NotificationEnum.INFO,
      //   "info",
      //   "Please enter your username"
      // );
      alert('Please enter your username')
      return false;
    } 
    else if(this.loginmodel.Password==null || this.loginmodel.Password=="" || this.loginmodel.Password==undefined)
    {
      // this.notificationService.notify(
      //   NotificationEnum.INFO,
      //   "info",
      //   "Please enter your password"
      // );
      alert('Please enter your password')

      return false;

    }
    else {
      return true;
    }
  }

  loginuser() {
    if (!this.validateFields()) {
      return;
    }
    this.IsSpinner = true;
    this.authService.login(this.loginmodel).subscribe((token) => {
      if (localStorage.getItem('access_token')) {

        this.vaplongservice.UserLogin(this.loginmodel).pipe(untilDestroyed(this)).subscribe(response => {
          this.usermodel = response;
          if (response.ResponseCode === 0) {
            this.storageService.setItem('SessionStartTime', new Date());
            this.storageService.setItem('UserModel', response.UserModel);
            this.usermodel = this.storageService.getItem('UserModel');
            this.credentialsService.loadPermission();
            this.storageService.setItem('UserModel', response.UserModel);
            this.IsSpinner = false;

            //this.CheckUserOpenCashRegisterByUserID(response.UserModel.ID);
          }
          else {
            this.IsSpinner = false;
            this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'invalid username and password');
          }
        });
      }
    }, (err: any) => {
      this.IsSpinner = false;
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', err);
    });
  }

  // CheckUserOpenCashRegisterByUserID(id) {
  //   const param = { ID: id };
  //   this.vaplongservice.CheckUserOpenCashRegisterByUserID(param).pipe(untilDestroyed(this)).subscribe(response => {
  //     if (response.ResponseCode === 0) {
  //       if (response.CashRegisterHistoryID === -1) {
  //         //localStorage.setItem('CashRegisterHistoryID', null);
  //         this.storageService.setItem('CashRegisterHistoryID', 1);

  //       }
  //       else {
  //         const data = JSON.stringify(response.CashRegisterHistoryID);
  //         //localStorage.setItem('CashRegisterHistoryID', data);
  //         this.storageService.setItem('CashRegisterHistoryID', data);

  //       }
  //       this.router.navigate(['/dashboard']);
  //       //this.router.navigate(['/customer/customer-payments']);
  //     }
  //     else if (response.ResponseCode === 129) {
  //       const data = JSON.stringify(response.CashRegisterHistoryID);
  //       //localStorage.setItem('CashRegisterHistoryID', data);
  //       this.storageService.setItem('CashRegisterHistoryID', data);
        
  //         this.router.navigate(['/dashboard']);
  //       //this.router.navigate(['/customer/customer-payments']);

  //     }
  //   });
  // }
}
