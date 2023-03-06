import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { UserModel } from '../../../../Helper/models/UserModel';
import { ChangePasswordRequest } from '../../../../Helper/models/ChangePasswordRequest';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { Columns } from 'src/app/shared/Model/columns.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ExtrasPermissionEnum } from 'src/app/shared/constant/extras-permission';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { UpdateStatus } from 'src/app/Helper/models/UpdateStatus';
import { StorageService } from 'src/app/shared/services/storage.service';


@Component({
  selector: 'app-manageuser',
  templateUrl: './manageuser.component.html',
  styleUrls: ['./manageuser.component.scss']
})
export class ManageuserComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  AllUserList: UserModel[] = [];

  ExtrasPermission = ExtrasPermissionEnum;
  selectedUser: UserModel;
  public user: UserModel;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';

  items: MenuItem[];
  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  // last = 25;
  totalRecords = 0;
  usermodel: UserModel;

  displayPasswordPopup = false;
  displayReportingPasswordPopup = false;
  changepasswordrequest: ChangePasswordRequest;
  changepasswordrequest1: ChangePasswordRequest;
  confirmnewpassword1;

  confirmnewpassword;
  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'FirstName', permission: ExtrasPermissionEnum.UpdateUserRole },
    { label: 'Password', icon: 'fas fa-key', dependedProperty: 'FirstName' }
  ];
  columns: Columns[] = [
    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'FirstName', header: 'FirstName', sorting: 'FirstName', placeholder: '', translateCol: 'SSGENERIC.FIRSTNAME' },
    { field: 'UserName', header: 'UserName', sorting: 'UserName', placeholder: '', translateCol: 'SSGENERIC.USERNAME' },
    { field: 'Role', header: 'Role', sorting: 'Role', placeholder: '', translateCol: 'SSGENERIC.ROLE' },
    { field: 'Address', header: 'Address', sorting: 'Address', placeholder: '', translateCol: 'SSGENERIC.ADDRESS' },
    { field: 'Outlet', header: 'Outlet', sorting: 'Outlet', placeholder: '', translateCol: 'SSGENERIC.OUTLET' },
  ];
  UpdateUserStatus: UpdateStatus;
  constructor(
    private apiService: vaplongapi, private notificationService: NotificationService,
    private route: ActivatedRoute, private router: Router,private storageService: StorageService) {

    this.changepasswordrequest = new ChangePasswordRequest();
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View List of Users`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }
  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    this.changepasswordrequest1 = new ChangePasswordRequest();
    this.GetAllUserList(); // Get All User List On Page Load
    // this.items = [
    //   { label: 'Update', icon: 'fas fa-pencil-alt', command: () => this.EditUser(this.selectedUser.ID) },
    //   { label: 'Password', icon: 'fas fa-key' , command: () => this.OpenChangePasswordPopUp(this.selectedUser.ID) },

    //  ];
  }
  emitAction(event: any) {
    if (event.forLabel === 'Update') {
      this.EditUser(event.selectedRowData.ID);
    } else {
      this.OpenChangePasswordPopUp(event.selectedRowData.ID);
    }
  }

  GetAllUserList() // Get All User Method Get Data from Service
  {
    this.IsSpinner = true;
    this.apiService.GetAllUsers().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {

        this.AllUserList = response.AllUsersList;
        this.totalRecords = response.AllUsersList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server error ! not getting api data.');
      }
    },
    );

  }

  EditUser(ID) {
    this.router.navigate(['/extras/add-user', ID]);
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

  OpenReportingPasswordDialog() {
    this.displayReportingPasswordPopup = true;
  }
  ReportingPasswordClosedPopUp() {
    this.displayReportingPasswordPopup = false;
  }
  ChangeReportingPassword() {
    
    if (this.confirmnewpassword1 !== this.changepasswordrequest1.NewPassword) {
      this.notificationService.notify(NotificationEnum.ERROR, 'error', 'The specified passwords does not match');
    }
    
    else {
    this.changepasswordrequest1.OldPassword = '1234';
    this.changepasswordrequest1.UserID = 1;
    this.changepasswordrequest1.UpdatedByUserID = this.usermodel.ID;
      this.apiService.ChangePaymentPasswordBySuperadmin(this.changepasswordrequest1).pipe(untilDestroyed(this)).subscribe((response: any) => {
        if (response.ResponseText === 'success' || response.ResponseCode === 0) {
          this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'password changed successfully');
          this.displayReportingPasswordPopup = false;
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
  UpdateUserStatusFunction(user: UserModel) {
    this.IsSpinner = true;
    this.UpdateUserStatus = new UpdateStatus();
    this.UpdateUserStatus.ID = user.ID;
    this.UpdateUserStatus.Status = user.IsActive;
    this.UpdateUserStatus.UpdatedByUserID = user.UpdatedByUserID;
    this.apiService.UpdateUserStatus(this.UpdateUserStatus).
      pipe(untilDestroyed(this)).subscribe((response: any) => {
        if (response.ResponseText === 'success') {
          this.IsSpinner = false;
          // this.GetAllProductWithLazyLoadinFunction(this.filterRequestModel);
          this.notificationService.notify(NotificationEnum.SUCCESS, 'success', 'Change Status Successfully');
        }
        else {
          this.IsSpinner = false;
          this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server Erro ! try again');
          console.log('internal server error !  not getting api data');
        }
      },
      );
  }

}
