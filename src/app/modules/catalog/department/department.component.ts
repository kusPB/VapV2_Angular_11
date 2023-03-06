import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { Department } from '../../../Helper/models/Department';
import { Classification } from '../../../Helper/models/Classification';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';

import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from '../../shell/services/notification.service';
import { CatalogPermissionEnum } from 'src/app/shared/constant/catalog-permission';



@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styles: []
})
export class DepartmentComponent implements OnInit, OnDestroy {
  CatalogPermission = CatalogPermissionEnum;
  @ViewChild('dt') table: Table;
  AllDepartmentList: Department[] = [];
  ClassificationList: Classification[];
  selectedDepartment: Department;
  department: Department;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedClassificationID = '';

  items: MenuItem[];
  ClassificationDropdown: SelectItem[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // last = 25;
  totalRecords = 0;


  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID', permission: CatalogPermissionEnum.UpdateDepartment }
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '' , translateCol: 'SSGENERIC.NAME'},
    { field: 'Classification', header: 'Classification', sorting: 'Classification', placeholder: '', translateCol: 'SSGENERIC.CLASIFICATION' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '' , translateCol: 'SSGENERIC.DESCRIPTION'},

  ];
  globalFilterFields = ['Name', 'Classification', 'Description'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];

  constructor(private apiService: vaplongapi, private notificationService: NotificationService) {

    this.department = new Department();
  }

  ngOnInit(): void {
    this.GetAllDepartmentList();
    this.GetClassificationList();
  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    this.EditDepartment(event.selectedRowData);
  }
  GetAllDepartmentList() // Get All Department Method Get Data from Service
  {
    this.IsSpinner = true;
    this.apiService.GetAllDepartments().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        ;
        this.AllDepartmentList = response.AllDepartmentList;
        this.totalRecords = response.AllDepartmentList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  GetClassificationList() {
    this.ClassificationDropdown = [];
    this.apiService.GetClassificationDropList().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {


        this.selectedClassificationID = response.DropDownData[0].ID;
        for (let i = 0; i < response.DropDownData.length; i++) {
          this.ClassificationDropdown.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }

      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
  }


  AddDepartment() // Open Add New Deparment Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection() // Close Add New Department Section
  {
    this.IsAdd = false;

  }

  SaveUpdateDepartmentDetails() {
    if (this.department.ID > 0) {
      this.UpdateDepartment();
    }
    else {
      this.SaveDepartment();
    }
  }

  SaveDepartment() // Save Department Method To Communicate API
  {
    this.IsSpinner = true;
    this.department.ClassificationID = Number(this.selectedClassificationID);
    this.apiService.AddDepartment(this.department).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllDepartmentList();
        this.IsSpinner = false;
        this.IsAdd = false;


      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }

  EditDepartment(department: Department) {

    this.department = department;
    this.selectedClassificationID = this.department.ClassificationID.toString();
    this.IsAdd = true;
  }

  UpdateDepartment() // Update Department Method To Communicate API
  {

    this.IsSpinner = true;
    this.department.ClassificationID = Number(this.selectedClassificationID);
    this.apiService.UpdateDepartment(this.department).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllDepartmentList();
        this.IsAdd = false;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    });
  }

  UpdateDepartmentStatus(department: any) // Update Department Status Method To Communicate API
  {
    this.IsSpinner = true;

    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = department.ID;
    this.updateStatusModel.Status = department.IsActive;
    this.updateStatusModel.UpdatedByUserID = department.CreatedByUserID;
    this.apiService.UpdateDepartmentStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllDepartmentList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }

  ResetFields() // Reset Object
  {
    this.department = new Department();
  }

}
