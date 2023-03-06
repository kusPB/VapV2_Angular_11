import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { UpdateStatus } from '../../../../Helper/models/UpdateStatus';
import { Outlet } from '../../../../Helper/models/Outlet';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { Columns } from 'src/app/shared/Model/columns.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ExtrasPermissionEnum } from 'src/app/shared/constant/extras-permission';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { isNullOrUndefined } from 'util';
import { StorageService } from 'src/app/shared/services/storage.service';
import { TrackableProductsPurchaseDetailModel } from 'src/app/Helper/models/PurchaseModel';

@Component({
  selector: 'app-outletoverview',
  templateUrl: './outletoverview.component.html',
  styleUrls: ['./outletoverview.component.scss']
})
export class OutletoverviewComponent implements OnInit {
  ExtrasPermission = ExtrasPermissionEnum;
  @ViewChild('dt') table: Table;
  AllOutletList: Outlet[] = [];
  selectedOutlet: Outlet;
  public outlet: Outlet;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';

  selectedCountryID = '';
  selectedStateID = '';
  selectedCityID = '';

  CountryDropdown: SelectItem[];
  StateDropdown: SelectItem[];
  CityDropdown: SelectItem[];

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
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'Name', permission: ExtrasPermissionEnum.UpdateOutlet },
    { label: 'Delete', icon: 'fas fa-trash', dependedProperty: 'Name' },
  ];
  columns: Columns[] = [
    { field: 'IsActive', header: 'Status', sorting: 'IsActive', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'EmailAddress', header: 'EmailAddress', sorting: 'EmailAddress', placeholder: '', translateCol: 'SSGENERIC.EMAILADDRESS' },
    { field: 'PhoneNo', header: 'PhoneNo', sorting: 'PhoneNo', placeholder: '', translateCol: 'SSGENERIC.PHONENO' },
    { field: 'Address', header: 'Address', sorting: 'Address', placeholder: '', translateCol: 'SSGENERIC.ADDRESS' },

  ];
  usermodel: any;
  constructor(private apiService: vaplongapi, private notificationService: NotificationService,private storageService: StorageService) {
    this.usermodel = this.storageService.getItem('UserModel');
    this.outlet = new Outlet();
  }

  ngOnInit(): void {
    this.GetAllOutletList(); //Get All Outlet List On Page Load

    this.items = [
      { label: 'Update', icon: 'fas fa-pencil-alt', command: () => this.EditOutlet(this.selectedOutlet) },
      { label: 'Delete', icon: 'fas fa-trash-alt' },

    ];
  }
  emitAction(event: any) {
    if (event.forLabel == 'Update') {
      this.EditOutlet(event.selectedRowData)
    }
  }
  GetAllOutletList() //Get All Outlet Method Get Data from Service 
  {

    this.IsSpinner = true;

    this.apiService.GetAllOutlet().subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllOutletList = response.AllOutletList;
        this.totalRecords = response.AllOutletList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server error ! not getting api data.');
      }
    },
    );

  }

  AddOutlet()//Open Add New Outlet Section
  {
    this.GetCountryDDFunction(0, false, 0, 0);
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()//Close Add New Outlet Section
  {
    this.IsAdd = false;

  }
  SaveUpdateOutletDetails() {

    if (this.outlet.ID > 0)  //for Update
    {
      this.UpdateOutlet();
    }
    else {
      this.SaveOutlet(); //for save
    }


  }
  SaveOutlet() // Save Outlet Method To Communicate API
  {
    this.IsSpinner = true;
    this.outlet.CityID = Number(this.selectedCityID);
    this.outlet.CreatedByUserID = this.usermodel.ID;
    this.apiService.AddOutlet(this.outlet).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Outlet has been added successfully.');
        this.GetAllOutletList();
        this.IsSpinner = false;
        this.IsAdd = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server error ! not getting api data.');
      }
    },
    );
  }
  UpdateOutlet() // Update Outlet Method To Communicate API
  {
    this.IsSpinner = true;
    this.outlet.CreatedByUserID = this.usermodel.ID;
    this.apiService.UpdateOutlet(this.outlet).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Outlet has been updated successfully.');
        this.GetAllOutletList();
        this.IsSpinner = false;
        this.IsAdd = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server error ! not getting api data.');
      }
    },
    );
  }

  EditOutlet(outlet: Outlet) {
    this.outlet = outlet;
    this.IsAdd = true;

    this.selectedCountryID = this.outlet.CountryID?.toString();
    this.selectedStateID = this.outlet.StateID?.toString();
    this.selectedCityID = this.outlet.CityID?.toString();

    this.GetCountryDDFunction(this.selectedCountryID, 1, this.selectedStateID, this.selectedCityID); //Bind Department dropdownlist 
  }
  UpdateOutletStatus(outlet: any) // Update Outlet Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = outlet.ID;
    this.updateStatusModel.Status = outlet.IsActive;
    this.updateStatusModel.UpdatedByUserID = outlet.CreatedByUserID;
    this.apiService.UpdateOutletStatus(this.updateStatusModel).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Outlet status has been updated successfully.');
        this.GetAllOutletList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server error ! not getting api data.');
      }
    },
    );
  }

  // physical Address dropdown code

  GetCountryDDFunction(selected, isEdit, state, city) {
    this.CountryDropdown = [];
    this.apiService.GetCountriesForDropdown().subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        // tslint:disable-next-line: deprecation
        if (selected !== 0 && !isNullOrUndefined(selected) && isEdit === true) {
          this.selectedCountryID = selected;
          this.GetStateByCountryID_DDFuntion(selected, state, true, city);
        }
        else {
          this.GetStateByCountryID_DDFuntion(response.DropDownData[0].ID, 0, false, 0);
          this.selectedCountryID = response.DropDownData[0].ID;
        }
        for (let i = 0; i <= response.DropDownData.length; i++) {
          this.CountryDropdown.push({
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

  GetStateByCountryID_DDFuntion(para, selected, isEdit, city) {

    // tslint:disable-next-line: prefer-const
    let id = {
      ID: para
    };
    this.StateDropdown = [];
    this.apiService.GetStatesForDropdownByCountryId(id).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        // tslint:disable-next-line: deprecation
        if (selected !== 0 && !isNullOrUndefined(selected) && isEdit === true) {
          this.selectedStateID = selected;
          this.GetCityByStateID_DDFuntion(selected, city, true);
        }

        else {
          this.GetCityByStateID_DDFuntion(response.DropDownData[0].ID, 0, false);
          this.selectedStateID = response.DropDownData[0].ID;
        }
        for (let i = 0; i <= response.DropDownData.length; i++) {
          this.StateDropdown.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }

      }
      else {
        console.log('internal serve Error', response);
      }
    });
  }

  GetCityByStateID_DDFuntion(para, selected, isEdit) {

    // tslint:disable-next-line: prefer-const
    let id = {
      ID: para
    };
    this.CityDropdown = [];
    this.apiService.GetCitiesForDropdownByStateId(id).subscribe((response) => {

      if (response.ResponseText === 'success') {
        // tslint:disable-next-line: deprecation
        if (selected !== 0 && !isNullOrUndefined(selected) && isEdit === true) {
          this.selectedCityID = selected;
        }

        else {
          this.selectedCityID = response.DropDownData[0].ID;
        }
        for (let i = 0; i <= response.DropDownData.length; i++) {
          this.CityDropdown.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }

      }
      else {
        console.log('internal serve Error', response);
      }
    });
  }

  ResetFields() // Reset Object
  {
    this.outlet = new Outlet();
  }
  onChangeCountry(event: any) {
    this.GetStateByCountryID_DDFuntion(event.value, 0, false, 0);
  }
  onChangeState(event: any) {
    this.GetCityByStateID_DDFuntion(event.value, 0, false);
  }

}
