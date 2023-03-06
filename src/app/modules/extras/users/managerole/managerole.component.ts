import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { Role } from '../../../../Helper/models/Role';
import { Router } from '@angular/router';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { Columns } from 'src/app/shared/Model/columns.model';
import { ExtrasPermissionEnum } from 'src/app/shared/constant/extras-permission';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-managerole',
  templateUrl: './managerole.component.html',
  styleUrls: ['./managerole.component.scss']
})
export class ManageroleComponent implements OnInit, OnDestroy {
  ExtrasPermission = ExtrasPermissionEnum;
  @ViewChild('dt') table: Table;
  AllRoleList: Role[] = [];
  selectedRole: Role;
  public role: Role;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';

  items: MenuItem[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // last = 25;
  totalRecords = 0;
  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'pi pi-pencil', dependedProperty: 'Name', permission: ExtrasPermissionEnum.UpdateRole },
    { label: 'Permission', icon: 'pi pi-lock', dependedProperty: 'Name' }
  ];
  columns: Columns[] = [
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '' , translateCol: 'SSGENERIC.DESCRIPTION'},

  ];
  usermodel: any;
  constructor(private apiService: vaplongapi,  private storageService: StorageService, private notificationService: NotificationService, private router: Router) {
    this.role = new Role();
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Roles`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }
ngOnDestroy(): void {
  
}
  ngOnInit(): void {
    this.GetAllRoleList(); //Get All Role List On Page Load

    // this.items = [
    //   { label: 'Update', icon: 'fas fa-pencil-alt', command: () => this.EditRole(this.selectedRole) },
    //   { label: 'Permission', icon: 'pi pi-lock', command: () => this.AddPermissions(this.selectedRole) },

    //  ];
  }
  emitAction(event: any) {
    if (event.forLabel == 'Update') {
      this.EditRole(event.selectedRowData)
    } else {
      this.AddPermissions(event.selectedRowData)
    }
  }

  GetAllRoleList() //Get All Role Get Data from Service 
  {
    this.IsSpinner = true;

    this.apiService.GetAllRoles().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllRoleList = response.AllRoleList;
        this.totalRecords = response.AllRoleList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  AddRole()//Open Add New Role Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()//Close Add New Role Section
  {
    this.IsAdd = false;

  }
  SaveUpdateRoleDetails() {

    if (this.role.ID > 0)  //for Update
    {
      this.UpdateRole();
    }
    else {
      this.SaveRole(); //for save
    }


  }
  SaveRole() // Save Role To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddRole(this.role).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Role has been added successfully.');
        this.GetAllRoleList();
        this.IsSpinner = false;
        this.IsAdd = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    },
    );
  }
  UpdateRole() // Update Role Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.UpdateRole(this.role).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Role has been updated successfully.');
        this.GetAllRoleList();
        this.IsSpinner = false;
        this.IsAdd = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    },
    );
  }

  EditRole(role: Role) {
    this.role = role;
    this.IsAdd = true;
  }

  ResetFields() // Reset Object
  {
    this.role = new Role();
  }

  AddPermissions(role: Role) {
    this.router.navigate(['/extras/permissions', role.ID]);
  }
}
