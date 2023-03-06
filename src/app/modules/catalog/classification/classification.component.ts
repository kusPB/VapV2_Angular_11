import { Component,OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem} from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Classification } from '../../../Helper/models/Classification';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from '../../shell/services/notification.service';

@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styles: [
  ],
})
export class ClassificationComponent implements OnInit,OnDestroy {

  @ViewChild('dt') table: Table;
  AllClassificationList: Classification[]=[];
  selectedClassification: Classification;
  public classification :Classification;
  updateStatusModel:UpdateStatus;
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
    { label: 'Update', icon: 'fas fa-pencil-alt',  dependedProperty: 'ID' }
  ];
  columns: Columns[] = [
    
    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '',type: TableColumnEnum.TOGGLE_BUTTON , translateCol: 'SSGENERIC.STATUS'},
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },

  ];
  globalFilterFields = "['Name','Description']";
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000]


  constructor(private apiService: vaplongapi, private notificationService: NotificationService) {
    this.classification = new Classification();
  }


  ngOnInit(): void {
    this.GetAllClassificationList(); //Get All Classification List On Page Load
  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    this.EditClassification(event.selectedRowData);
  }
  GetAllClassificationList() //Get All Classification Method Get Data from Service 
  {
    this.IsSpinner=true;

    this.apiService.GetAllClassification().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
          
         this.AllClassificationList = response.AllClassificationList;
         this.totalRecords=response.AllClassificationList.length;
         this.IsSpinner = false;
  
      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );
  
  }

  AddClassification()//Open Add New Classification Section
  {
    this.ResetFields();
    this.IsAdd=true;
  }
  CloseAddSection()//Close Add New Classification Section
  {
    this.IsAdd=false;
    
  }
  SaveUpdateClassificationDetails()
  {

   if(this.classification.ID > 0)  //for Update
   {
     this.UpdateClassification();
   }
   else
   {
     this.SaveClassification(); //for save
   }


  }
  SaveClassification() // Save Classification Method To Communicate API
  {
    this.IsSpinner=true;
    this.apiService.AddClassifications(this.classification).pipe(untilDestroyed(this)).subscribe((response: any) => {
      
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllClassificationList();
        this.IsSpinner = false;
         this.IsAdd=false;
  
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }
  UpdateClassification() // Update Classification Method To Communicate API
  {
    this.IsSpinner=true;
    this.apiService.UpdateClassifications(this.classification).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllClassificationList();
        this.IsSpinner = false;
         this.IsAdd=false;
  
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }

  EditClassification(classification:Classification) {
    this.classification=classification;
    this.IsAdd=true;
   }
  UpdateClassificationStatus(classification:any) // Update Classification Status Method To Communicate API
  { 
    this.IsSpinner = true;
    this.updateStatusModel= new UpdateStatus();
    this.updateStatusModel.ID=classification.ID;
    this.updateStatusModel.Status=classification.IsActive;
    this.updateStatusModel.UpdatedByUserID=classification.CreatedByUserID;
    this.apiService.UpdateClassificationStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllClassificationList();
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
    this.classification= new Classification(); 
  }

}
