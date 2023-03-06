import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService, LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { Columns } from 'src/app/shared/Model/columns.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ExtrasPermissionEnum } from 'src/app/shared/constant/extras-permission';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { StorageService } from 'src/app/shared/services/storage.service';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-backuphistory',
  templateUrl: './backuphistory.component.html',
  styleUrls: ['./backuphistory.component.scss'],
  providers: [DatePipe,ConfirmationService]

})
export class BackupHistoryComponent implements OnInit, OnDestroy {
  ExtrasPermission = ExtrasPermissionEnum;
  @ViewChild('dt') table: Table;
  AllBackupHistoryList: any[] = [];
  
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
  usermodel: UserModel;

  // last = 25;
  totalRecords = 0;
  genericMenuItems: GenericMenuItems[] = [
   
  ];
  columns: Columns[] = [
    { field: 'BackupName', header: 'Backup File', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'User', header: 'User', sorting: 'User', placeholder: '', translateCol: 'SSGENERIC.USERNAME' },
    { field: 'CreatedAt', header: 'Created At', sorting: 'CreatedAt', placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.CREATEDAT' },

  ];
  constructor(private apiService: vaplongapi, private datepipe: DatePipe, private notificationService: NotificationService,private confirmationService: ConfirmationService, private storageService: StorageService) {
    this.usermodel = this.storageService.getItem('UserModel');
  }
  ngOnDestroy(): void {

  }
  ngOnInit(): void {

    this.GetAllBackupHistoryList(); 
  }

  GetAllBackupHistoryList()  
  {

    this.apiService.GetAllBackupHistory().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllBackupHistoryList = response.AllBackupHistoryList;
        this.totalRecords = response.AllBackupHistoryList.length;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }
  
  AddDatabaseBackup() // Save Payment Condition Method To Communicate API
  {
    var req = { ID: this.usermodel.ID };
    this.apiService.CreateBackup(req).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'backup created successfully.');
        this.GetAllBackupHistoryList();
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    },
    );
  }
  
  DeleteLastDaysReports() {
    this.confirmationService.confirm({
      message: 'Do you want to remove the Last 2 Days database backups?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.DeleteAllByFilters();
      }

    });
  }
  DeleteAllByFilters() {
    let today = new Date();
    const param = {
      FromDate: new Date(this.datepipe.transform(new Date().setDate(today.getDate()-2), 'yyyy-MM-ddTHH:mm:ss')),
      ToDate: new Date(this.datepipe.transform(new Date().setDate(today.getDate()-1), 'yyyy-MM-ddTHH:mm:ss')),
      RequestedUserID:this.usermodel.ID,
    };
    ;
    this.apiService.DeleteAllBackupByFilter(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllBackupHistoryList();
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }
}
