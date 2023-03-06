import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { UpdateStatus } from '../../../../Helper/models/UpdateStatus';
import { City } from '../../../../Helper/models/City';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { Columns } from 'src/app/shared/Model/columns.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss'],
})
export class CityComponent implements OnInit, OnDestroy {

  @ViewChild('dt') table: Table;
  AllCityList: City[] = [];
  selectedCity: City;
  public city: City;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedStateID = '';
  selectedCountryID = '';
  items: MenuItem[];
  CountryDropdown: SelectItem[];
  StateDropdown: SelectItem[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // last = 25;
  totalRecords = 0;
  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'Name' },
  ];
  columns: Columns[] = [
    { field: 'IsActive', header: 'Status', sorting: 'IsActive', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'PostalCode', header: 'PostalCode', sorting: 'PostalCode', placeholder: '', translateCol: 'SSGENERIC.POSTALCODE' },
    { field: 'Country', header: 'Country', sorting: 'Country', placeholder: '', translateCol: 'SSGENERIC.COUNTRY' },
    { field: 'State', header: 'State', sorting: 'State', placeholder: '', translateCol: 'SSGENERIC.STATE' },

  ];
  constructor(private apiService: vaplongapi, private notificationService: NotificationService) {
    this.city = new City();
  }
  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    this.GetAllCityList(); // Get All City List On Page Load
    this.GetCountryList(); // Get All Country List On Page Load
    // this.items = [
    //   { label: 'Update', icon: 'fas fa-pencil-alt', command: () => this.EditState(this.selectedCity) },
    //  ];

  }
  emitAction(event: any) {
    if (event.forLabel == 'Update') {
      this.EditState(event.selectedRowData);
    }
  }
  GetAllCityList() //Get All City Method Get Data from Service 
  {
    this.IsSpinner = true;

    this.apiService.GetAllCities().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllCityList = response.AllCityList;
        this.totalRecords = response.AllCityList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  GetCountryList() {
    this.CountryDropdown = [];
    this.apiService.GetCountriesForDropdown().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {


        this.selectedCountryID = response.DropDownData[0].ID;
        for (let i = 0; i < response.DropDownData.length; i++) {
          this.CountryDropdown.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }
        this.GetStateList(this.selectedCountryID);
      }
      else {
        console.log('internal serve Error', response.ResponseText);
      }

    }
    );
  }
  onChangeCountry(event: any) {
    this.GetStateList(event.value);
  }
  GetStateList(countryId) {
    this.StateDropdown = [];
    let id = {
      ID: countryId
    };
    this.apiService.GetStatesForDropdownByCountryId(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {


        this.selectedStateID = response.DropDownData[0].ID;
        for (let i = 0; i < response.DropDownData.length; i++) {
          this.StateDropdown.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }

      }
      else {
        console.log('internal serve Error', response.ResponseText);
      }

    }
    );
  }

  AddCity()//Open Add New City Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()//Close Add New City Section
  {
    this.IsAdd = false;

  }
  SaveUpdateCityDetails() {

    if (this.city.ID > 0)  //for Update
    {
      this.UpdateCity();
    }
    else {
      this.SaveCity(); //for save
    }


  }
  SaveCity() // Save City Method To Communicate API
  {
    this.IsSpinner = true;
    this.city.CountryID = Number(this.selectedCountryID);
    this.city.StateID = Number(this.selectedStateID);
    this.apiService.AddCity(this.city).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'City has been added successfully.');
        this.GetAllCityList();
        this.IsSpinner = false;
        this.IsAdd = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseTex);
      }
    },
    );
  }
  UpdateCity() // Update City Method To Communicate API
  {
    this.IsSpinner = true;
    this.city.CountryID = Number(this.selectedCountryID);
    this.city.StateID = Number(this.selectedStateID);
    this.apiService.UpdateCity(this.city).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'City has been updated successfully.');
        this.GetAllCityList();
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

  EditState(city: City) {
    this.city = city;
    this.IsAdd = true;
    this.selectedCountryID = city.CountryID.toString();
    this.selectedStateID = city.StateID.toString();
  }
  UpdateCityStatus(city: any) // Update City Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = city.ID;
    this.updateStatusModel.Status = city.IsActive;
    this.updateStatusModel.UpdatedByUserID = city.CreatedByUserID;
    this.apiService.UpdateCityStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'City status has been updated successfully.');
        this.GetAllCityList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    },
    );
  }

  BindStates(event: any) //Bind States On Onchange event off country dropdownlist
  {
    this.GetStateList(event.value);
  }

  ResetFields() // Reset Object
  {
    this.city = new City();
  }

}
