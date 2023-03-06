import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { ActionModel } from '../../../../Helper/models/ActionModel'
import { Router, ActivatedRoute } from '@angular/router';
import { UpdateRoleActionModel } from '../../../../Helper/models/UpdateRoleActionModel';
import { RoleActionModel } from '../../../../Helper/models/RoleActionModel';
import { UserModel } from '../../../../Helper/models/UserModel';
import { StorageService } from 'src/app/shared/services/storage.service';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { Columns } from 'src/app/shared/Model/columns.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  @ViewChild('dt1') table1: Table;
  AllAssignedActionList: RoleActionModel[] = [];
  AllActionListTemp : ActionModel[] = [];
  AllActionsList: ActionModel[] = [];
  updateStatusModel: UpdateRoleActionModel;
  usermodel: UserModel;

  PaginationData: any = [];

  items: MenuItem[];
  IsSpinner = false;
  loading: boolean;
  actionID: string;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  totalRecords = 0;
  roleId = 0;
  totalRecordsAction = 0;
  firstAction = 0;
  rowsAction = 25;

  columns: Columns[] = [
    { field: 'IsActive', header: 'Status', sorting: 'IsActive', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Action', header: 'Action', sorting: 'ArticalNo', placeholder: '', translateCol: 'SSGENERIC.ACTION' },
    { field: 'ActionDescription', header: 'Description', sorting: 'ActionDescription', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },
    

  ];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  globalFilterFields = ['Action','ActionDescription'];
  constructor(
    private route: ActivatedRoute, private apiService: vaplongapi, private notificationService: NotificationService,
    private router: Router, private storageService: StorageService) {
    this.roleId = this.route.snapshot.params.id;
  }
  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    
    this.GetAllActionsList(); //Get All  Actions list On Page Load
    this.GetAllAssigendActionList(); //Get All Assigned Acction list On Page Load
    this.usermodel = this.storageService.getItem('UserModel');;

  }

  GetAllAssigendActionList() //Get All Assigned Acction list Data from Service 
  {
    let id = {
      ID: this.roleId
    };

    this.apiService.GetAllActionsByRoleID(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllAssignedActionList = response.RoleActionList;
        if (this.AllActionListTemp.length > 0)
        {
          this.AllAssignedActionList.forEach(element => {
            this.AllActionListTemp = this.AllActionListTemp.filter(obj => obj.ID !== element.ActionID && obj.IsActive==true);
          });
          this.AllActionsList = this.AllActionListTemp;
          this.totalRecords = this.AllActionsList.length;
        }
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  GetAllActionsList() //Get All Actions list Data from Service 
  {
    this.apiService.GetAllActionsList().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        
        this.AllActionListTemp = response.AllActionList;               
        //.AllActionsList = this.AllActionsList.filter(x => !this.AllAssignedActionList.map(y => y.ActionID).includes(x.ID)); //filter All action list with already assigned actions

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  AssignAction(ActionID: number) {
    this.actionID = ActionID.toString();
    let actionIDs = [this.actionID];
    this.IsSpinner = true;
    let params = {
      RoleID: this.roleId,
      CreatedByUserID: this.usermodel.ID,
      ActionIDList: actionIDs
    };
    this.apiService.AssignActionToRole(params).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Action has been assigned to role successfully.');
        this.GetAllAssigendActionList();
        this.GetAllActionsList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    },
    );

  }

  UpdateAssignedActionStatus(model: any) {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateRoleActionModel();
    this.updateStatusModel.RoleActionID = model.ID;
    this.updateStatusModel.Status = model.IsActive;
    this.apiService.UpdateRoleActionStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Action status has been updated successfully.');
        this.GetAllAssigendActionList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    },
    );
  }

}
