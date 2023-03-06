import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { SubCategory } from '../../../Helper/models/SubCategory';
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
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styles: []
})
export class SubCategoryComponent implements OnInit, OnDestroy {
  CatalogPermission = CatalogPermissionEnum;
  AllSubCategoryList: SubCategory[] = [];
  selectedSubCategory: SubCategory;
  subCategory: SubCategory;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedClassificationID = '';
  selectedDepartmentID = '';
  selectedCategoryID = '';

  items: MenuItem[];
  ClassificationDropdown: SelectItem[];
  DepartmentDropdown: SelectItem[];
  CategoryDropdown: SelectItem[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // last = 25;
  totalRecords = 0;

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID', permission: CatalogPermissionEnum.UpdateSubcategory }
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Category', header: 'Category', sorting: 'Category', placeholder: '', translateCol: 'SSGENERIC.CATEGORY' },
    { field: 'Department', header: 'Department', sorting: 'Department', placeholder: '', translateCol: 'SSGENERIC.DEPARTMENT' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },

  ];
  globalFilterFields = ['Name', 'Category', 'Department', 'Description'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];


  constructor(private apiService: vaplongapi, private notificationService: NotificationService) {
    this.subCategory = new SubCategory();
  }

  ngOnInit(): void {
    this.GetAllSubCategoriesList();
    this.GetClassificationList();

  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    this.EditSubCategory(event.selectedRowData);
  }
  GetAllSubCategoriesList() // Get All Sub Categories Method Get Data from Service 
  {
    this.IsSpinner = true;
    this.apiService.GetAllSubCategories().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {

        this.AllSubCategoryList = response.AllSubCategoryList;
        this.totalRecords = response.AllSubCategoryList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }
  // Get  Classification data for dropdownlist
  GetClassificationList() {
    this.ClassificationDropdown = [];

    this.apiService.GetClassificationDropList().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {


        for (let i = 0; i < response.DropDownData.length; i++) {
          this.ClassificationDropdown.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }
        if (this.ClassificationDropdown.length > 0) // set default value
        {
          this.selectedClassificationID = this.ClassificationDropdown[0].value;
          this.GetDepartmentByClassificationID(this.selectedClassificationID); // Bind Department dropdownlist 
        }


      }
      else {

        console.log('internal serve Error', response);
      }

    }
    );
  }
  // Get  Department data by classification id for dropdownlist
  GetDepartmentByClassificationID(classificationId) {

    const id = {
      ID: classificationId
    };
    this.DepartmentDropdown = [];
    this.apiService.GetDepartmentByClassificationID(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {

        for (let i = 0; i < response.DropDownData.length; i++) {
          this.DepartmentDropdown.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }

        if (this.DepartmentDropdown.length > 0) // set default value
        {
          this.selectedDepartmentID = this.DepartmentDropdown[0].value;
          this.GetCategoryByDepartmentID(this.selectedDepartmentID);
        }

      }
      else {
        console.log('internal serve Error', response);
      }
    });
  }
  // Get  Categories data by department id for dropdownlist
  GetCategoryByDepartmentID(DepartmentId) {

    // tslint:disable-next-line: prefer-const
    let id = {
      ID: DepartmentId
    };
    this.CategoryDropdown = [];
    this.apiService.GetCategoryByDepartmentID(id).pipe(untilDestroyed(this)).subscribe((response) => {

      if (response.ResponseText === 'success') {
        for (let i = 0; i < response.DropDownData.length; i++) {
          this.CategoryDropdown.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }
        if (this.CategoryDropdown.length > 0) {
          this.selectedCategoryID = this.CategoryDropdown[0].value;
        }

      }
      else {
        console.log('internal serve Error', response);
      }
    });
  }

  AddSubCategory()// Open Add New Sub Category Section
  {
    this.IsAdd = true;
    this.ResetFields();
  }
  CloseAddSection()// Close Add New Sub Category Section
  {
    this.IsAdd = false;

  }

  SaveUpdateSubCategoryDetails() {
    if (this.subCategory.ID > 0) {
      this.UpdateSubCategory();
    }
    else {
      this.SaveSubCategory();
    }
  }

  SaveSubCategory() // Save Sub Category Method To Communicate API
  {
    this.IsSpinner = true;
    this.subCategory.ClassificationID = Number(this.selectedClassificationID);
    this.subCategory.DepartmentID = Number(this.selectedDepartmentID);
    this.subCategory.CategoryID = Number(this.selectedCategoryID);
    this.subCategory.SeriesID = 0;
    this.apiService.AddSubCategory(this.subCategory).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllSubCategoriesList();
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

  EditSubCategory(subCategory: SubCategory) {
    this.subCategory = subCategory;
    this.selectedClassificationID = this.subCategory.ClassificationID.toString();
    this.selectedDepartmentID = this.subCategory.DepartmentID.toString();
    this.selectedCategoryID = this.subCategory.CategoryID.toString();
    this.IsAdd = true;
  }

  UpdateSubCategory() // Update Sub Category Method To Communicate API
  {
    this.IsSpinner = true;
    this.subCategory.ClassificationID = Number(this.selectedClassificationID);
    this.subCategory.DepartmentID = Number(this.selectedDepartmentID);
    this.subCategory.SeriesID = 0;
    this.apiService.UpdateSubCategory(this.subCategory).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllSubCategoriesList();
        this.IsAdd = false;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }

  UpdateSubCategoryStatus(subCategory: any) // Update SubCategory Status Method To Communicate API
  {
    this.IsSpinner = true;

    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = subCategory.ID;
    this.updateStatusModel.Status = subCategory.IsActive;
    this.updateStatusModel.UpdatedByUserID = subCategory.CreatedByUserID;
    this.apiService.UpdateSubCategoryStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllSubCategoriesList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }

  BindDepartment(event: any) // Bind Department On Onchange event off classification dropdownlist
  {
    this.GetDepartmentByClassificationID(event.value);
  }

  BindCategory(event: any) // Bind Category On Onchange event off department dropdownlist
  {
    this.GetCategoryByDepartmentID(event.value);
  }

  ResetFields() // Reset Object
  {
    this.subCategory = new SubCategory();
  }


}
