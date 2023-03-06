import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { Country } from '../../../../Helper/models/Country';
import { UpdateStatus } from '../../../../Helper/models/UpdateStatus';
import { State } from '../../../../Helper/models/State';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { Columns } from 'src/app/shared/Model/columns.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss']
})
export class StatesComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  AllStateList: State[] = [];
  selectedState: State;
  public state: State;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedCountryID = '';

  items: MenuItem[];
  CountryDropdown: SelectItem[];
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
    { field: 'Country', header: 'Country', sorting: 'Country', placeholder: '', translateCol: 'SSGENERIC.COUNTRY' },
  ];
  constructor(private apiService: vaplongapi, private notificationService: NotificationService) {
    this.state = new State();
  }

  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    this.GetAllStateList(); //Get All State List On Page Load
    this.GetCountryList();  //Get All Country List for dropdown list
    this.items = [
      { label: 'Update', icon: 'fas fa-pencil-alt', command: () => this.EditState(this.selectedState) },

    ];

  }
  emitAction(event: any) {
    if (event.forLabel == 'Update') {
      this.EditState(event.selectedRowData)
    }
  }

  GetAllStateList() //Get All State Method Get Data from Service 
  {
    this.IsSpinner = true;

    this.apiService.GetAllStates().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {

        this.AllStateList = response.AllStateList;
        this.totalRecords = response.AllStateList.length;
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

      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
  }

  AddState()//Open Add New State Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()//Close Add New State Section
  {
    this.IsAdd = false;

  }
  SaveUpdateStateDetails() {

    if (this.state.ID > 0)  //for Update
    {
      this.UpdateState();
    }
    else {
      this.SaveState(); //for save
    }


  }
  SaveState() // Save State Method To Communicate API
  {
    this.IsSpinner = true;
    this.state.CountryID = Number(this.selectedCountryID);
    this.apiService.AddState(this.state).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'State has been added successfully.');
        this.GetAllStateList();
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
  UpdateState() // Update State Method To Communicate API
  {
    this.IsSpinner = true;
    this.state.CountryID = Number(this.selectedCountryID);
    this.apiService.UpdateState(this.state).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'State has been updated successfully.');
        this.GetAllStateList();
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

  EditState(state: State) {
    this.state = state;
    this.IsAdd = true;
    this.selectedCountryID = state.CountryID.toString();
  }
  UpdateStateStatus(state: any) // Update State Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = state.ID;
    this.updateStatusModel.Status = state.IsActive;
    this.updateStatusModel.UpdatedByUserID = state.CreatedByUserID;
    this.apiService.UpdateStateStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'State status has been added successfully.');
        this.GetAllStateList();
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
    this.state = new State();
  }

}
