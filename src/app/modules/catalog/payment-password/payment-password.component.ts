import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { PaymentPasswordModel } from '../../../Helper/models/PaymentPasswordModel';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from '../../shell/services/notification.service';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { StorageService } from 'src/app/shared/services/storage.service';


@Component({
  selector: 'app-payment-password',
  templateUrl: './payment-password.component.html',
  styles: [
  ],
})
export class PaymentPasswordComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  AllPaymentPasswordList: PaymentPasswordModel[] = [];
  selectedPaymentPassword: PaymentPasswordModel;
  public paymentPassword: PaymentPasswordModel;
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
  PasswordText = '';
  PaymentText = '';

  displayPassword = false; 

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID' },
    { label: 'Check Password', icon: 'fas fa-pencil-alt', dependedProperty: 'ID' }

  ];
  columns: Columns[] = [

    //{ field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'ID', header: 'ID', sorting: 'ID', placeholder: '', translateCol: 'SSGENERIC.ID' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    //{ field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },

  ];
  globalFilterFields = ['Name'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  usermodel: UserModel;

  constructor(private apiService: vaplongapi, private notificationService: NotificationService,private storageService: StorageService) {

    this.paymentPassword = new PaymentPasswordModel();
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    this.GetAllPaymentPasswordList(); // Get All Classification List On Page Load

  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    if (event.forLabel === 'Update') {
      this.EditPassword(event.selectedRowData);
    }
    if (event.forLabel === 'Check Password') {
      this.CheckPassword(event.selectedRowData);
    }
  }

  CheckPassword(data) // Get All Color Method Get Data from Service
  {
    let req = {ID:data.ID};

    this.PaymentText = data.Name;
    this.apiService.GetPaymentPasswordById(req).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        let Passwordlist = response.PaymentPasswords;
        if(Passwordlist.length>0){
          this.PasswordText = Passwordlist[0].Password;
        }
        else{
          this.PasswordText = 'not found';
        }

        this.displayPassword = true;

      }
      else {
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }



  GetAllPaymentPasswordList() // Get All Color Method Get Data from Service
  {
    this.IsSpinner = true;

    this.apiService.GetAllPaymentPasswordRecords().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllPaymentPasswordList = response.PaymentPasswords;
        this.totalRecords = response.PaymentPasswords.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  
  CloseAddSection()// Close Add New Color Section
  {
    this.IsAdd = false;

  }
  
 
  UpdatePaymentPassword() // Update Color Method To Communicate API
  {
    
        var model = {
          ID:this.paymentPassword.ID,
          Name:this.paymentPassword.Name,
          Password:this.paymentPassword.Password,
          IsActive:true,
          UpdatedByUserID:this.usermodel.ID,
        }
    this.apiService.ChangePaymentPasswordBySuperadmin(model).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllPaymentPasswordList();
        this.IsAdd = false;
      }
      else {
        this.IsSpinner = false;
        this.IsAdd = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }

  EditPassword(paymentPassword) {
    this.paymentPassword = paymentPassword;
    this.IsAdd = true;
  }

  

  ResetFields() // Reset Object
  {
    this.paymentPassword = new PaymentPasswordModel();
  }

}
