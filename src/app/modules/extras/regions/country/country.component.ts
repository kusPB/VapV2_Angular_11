import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { Country } from '../../../../Helper/models/Country';
import { UpdateStatus } from '../../../../Helper/models/UpdateStatus';
import { Table } from 'primeng/table';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { Columns } from 'src/app/shared/Model/columns.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit, OnDestroy {

  @ViewChild('dt') table: Table;
  AllCountryList: Country[] = [];
  selectedCountry: Country;
  public country: Country;
  updateStatusModel: UpdateStatus;
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
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'Name' },
  ];
  columns: Columns[] = [
    { field: 'IsActive', header: 'Status', sorting: 'IsActive', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
  ];
  constructor(private apiService: vaplongapi, private notificationService: NotificationService) {
    this.country = new Country();
  }
  ngOnDestroy(): void {

  }
  ngOnInit(): void {

    this.GetAllCountryList(); //Get All Countries List On Page Load    
    // this.items = [
    //   { label: 'Update', icon: 'fas fa-pencil-alt', command: () => this.EditCountry(this.selectedCountry) },

    //  ];

  }
  emitAction(event: any) {
    if (event.forLabel == 'Update') {
      this.EditCountry(event.selectedRowData);
    }
  }

  GetAllCountryList() //Get All Countries Method Get Data from Service 
  {
    this.IsSpinner = true;

    this.apiService.GetAllCountries().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {

        this.AllCountryList = response.AllCountryList;
        this.totalRecords = response.AllCountryList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  AddCountry()//Open Add New Country Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()//Close Add New Country Section
  {
    this.IsAdd = false;

  }
  SaveUpdateCountryDetails() {

    if (this.country.ID > 0)  //for Update
    {
      this.UpdateCountry();
    }
    else {
      this.SaveCountry(); //for save
    }


  }
  SaveCountry() // Save Country Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddCountry(this.country).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Country has been added successfully.');
        this.GetAllCountryList();
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
  UpdateCountry() // Update Country Method To Communicate API
  {
    this.apiService.UpdateCountry(this.country).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Country has been updated successfully.');
        this.GetAllCountryList();
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

  EditCountry(country: Country) {
    this.country = country;
    this.IsAdd = true;
  }
  UpdateCountryStatus(country: any) // Update Country Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = country.ID;
    this.updateStatusModel.Status = country.IsActive;
    this.updateStatusModel.UpdatedByUserID = country.CreatedByUserID;
    this.apiService.UpdateCountryStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Country status has been updated successfully.');
        this.GetAllCountryList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    },
    );
  }

  ResetFields() // Reset Object
  {
    this.country = new Country();
  }


}
