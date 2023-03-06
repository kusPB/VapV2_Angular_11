import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
/* import { BreadcrumbService } from '../../../../app.breadcrumb.service'; */
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { UserModel } from '../../../../Helper/models/UserModel';
import { Role } from '../../../../Helper/models/Role';
import { ExtrasPermissionEnum } from 'src/app/shared/constant/extras-permission';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { IImageModel } from 'src/app/Helper/models/ImageModel';
import { environment } from 'src/environments/environment';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {
  ExtrasPermission = ExtrasPermissionEnum;
  RoleList: Role[];
  uploadedFiles: any[] = [];

  selectedUser: UserModel;
  public user: UserModel;
  selectedOutletID = '';
  selectedRole: Role;

  OutletDropdown: SelectItem[];
  IsSpinner = false;
  loading: boolean;
  IsDeliveryPerson = false;
  IsReseller = false;
  UserButtonLabel = '';
  buttonIcon = '';
  routeID: any;
  roleList: any[];
  base64textString: IImageModel = {
    Base64String: '',
    Extention: ''
  };
  imageBasePath = '';
  usermodel: UserModel;

  constructor(
    private route: ActivatedRoute, private apiService: vaplongapi,
    private notificationService: NotificationService, private router: Router,private storageService: StorageService) {
    this.routeID = this.route.snapshot.params.id;
    this.user = new UserModel();
    this.imageBasePath = environment.USER_IMAGE_PATH;
  }
  ngOnDestroy() {

  }
  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    if (this.routeID !== '0' && this.routeID !== undefined) {

      this.UserButtonLabel = 'Update User';
      this.buttonIcon = 'fas fa-pen';
      this.fillFields(this.routeID);
    }

    else {
      this.UserButtonLabel = 'Add User';
      this.buttonIcon = 'fas fa-plus';
      this.GetOutletDDList(0); // Get All Outlet List for add user on page load
      this.GetRolesList(0);

    }

  }

  GetRolesList(id) {
    this.RoleList = [];
    this.apiService.GetAllRoles().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.RoleList = response.AllRoleList;

        if (id !== 0) {
          this.selectedRole = this.RoleList.filter(x => x.ID === id).shift();
        }
      }
      else {
        console.log('internal serve Error', response);
      }
    });
  }

  GetOutletDDList(id) {
    this.OutletDropdown = [];
    this.apiService.GetOutletForDropdown().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {

        if (id === 0) {
          this.selectedOutletID = response.DropDownData[0].ID;
        } else {
          this.selectedOutletID = id;
        }

        for (const item of response.DropDownData) {
          this.OutletDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }

      }
      else {
        console.log('internal serve Error', response);
      }
    });
  }
  fillFields(id) {

    this.user = new UserModel();
    const params = { ID: id };
    this.apiService.GetUserByID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.user = response.UserModel;
        this.IsDeliveryPerson = this.user.IsDeliveryPerson;
        this.GetOutletDDList(this.user.OutletID);
        this.GetRolesList(this.user.RoleID);
      }
      else {
        console.log('internal server error ! fillFields ');

      }
    },
      error => {
        console.log('internal server error ! fillFields');
      }
    );

  }

  SaveUpdateUserDetails() {

    if (this.user.ID > 0)  // for Update
    {
      this.UpdateUser();
    }
    else {
      this.SaveUser(); // for save
    }
  }
  SaveUser() // Save User Method To Communicate API
  {
    this.IsSpinner = true;
    this.user.OutletID = Number(this.selectedOutletID);
    this.user.IsDeliveryPerson = this.IsDeliveryPerson;
    this.user.IsReseller = this.IsReseller;
    this.user.RoleID = this.selectedRole.ID;
    this.user.ParentUserID = this.usermodel.ID;
    this.user.AttachedImage = this.base64textString;
    this.apiService.AddUser(this.user).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseCode === 0) {

        const userID = response.UserModel.ID;
        const roleID = this.selectedRole.ID;

        this.AddUserRole(roleID, userID);
        this.ResetFields();
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'User has been added successfully.');
        this.IsSpinner = false;
        this.router.navigate(['/extras/manage-user']);

      }
      else if(response.ResponseCode ===136)
      {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server error ! not getting api data.');
      }
    },
    );
  }
  UpdateUser() // Update User Method To Communicate API
  {
    
    this.IsSpinner = true;
    this.user.OutletID = Number(this.selectedOutletID);
    this.user.IsDeliveryPerson = this.IsDeliveryPerson;
    this.user.IsReseller = this.IsReseller;
    this.user.RoleID = this.selectedRole.ID;
    this.user.UpdatedByUserID = this.usermodel.ID;
    this.user.AttachedImage = this.base64textString;
    this.apiService.UpdateUser(this.user).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {

        const userID = response.UserModel.ID;
        const roleID = this.selectedRole.ID;

        this.AddUserRole(roleID, userID);

        
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server error ! not getting api data.');
      }
    },
    );
  }
  AddUserRole(roleID, userID) //   Method To Communicate API
  {
    this.IsSpinner = true;

    this.roleList = [];
    this.roleList.push(roleID);
    const AssignRoleToUserModel = {
      CreatedByUserID: this.user.ID,
      UserID: userID,
      RoleIDList: this.roleList
    };

    this.apiService.AssignRoleToUser(AssignRoleToUserModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      
      if (response.ResponseCode === 0) {
        this.ResetFields();
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'User has been updated successfully.');
        this.router.navigate(['/extras/manage-user']);
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server error ! not getting api data.');
      }
    },
    );
  }

  ResetFields() // Reset Object
  {
    this.user = new UserModel();
  }
  onUpload(event) {
    const file = event.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();

    reader.readAsDataURL(file);
    const self = this;
    // tslint:disable-next-line: only-arrow-functions
    reader.onload = function (e) {
      self.base64textString = { Base64String: reader.result.toString(), Extention: file.type.split('/')[1] };
    };
  }
  onClear(form: any) {
    this.base64textString = { Extention: '', Base64String: '' };
    form.clear();
  }
}
