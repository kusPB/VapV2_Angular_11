import { UserModel } from 'src/app/Helper/models/UserModel';
import { StorageService } from 'src/app/shared/services/storage.service';
import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { IImageModel } from 'src/app/Helper/models/ImageModel';
import { UpdateStatus } from 'src/app/Helper/models/UpdateStatus';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit {

  updateStatusModel: UpdateStatus;
  items: MenuItem[];
  IsSpinner = false;
  IsAdd = false;
  rows = 25;
  base64textString: IImageModel = {
    Base64String: '',
    Extention: ''
  };
  totalRecords = 0;
  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID' },
    { label: 'Delete', icon: 'fas fa-pencil-alt', dependedProperty: 'ID' },
  ];
  columns: Columns[] = [
    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },
  ];
  helpColumn: Columns[] = [
    { field: 'IsActive', header: 'IsActive', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Heading', header: 'Heading', sorting: 'Heading', placeholder: '' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '' },

  ];

  globalFilterFields = ['Name', 'Description'];
  rowsPerPageOptions = [10, 25, 50, 100, 200, 500, 1000, 5000];
  helpList: any[] = [];
  helpModel = {
    ID: 0,
    Heading: '',
    Image: '',
    Description: '',
    Icon: '',
    CreatedByUserID:1,
    IsActive: true,
    HelpDetails: [],
    Attachment: {
      Base64String: '',
      Extention: ''
    }
  };
  helpDetails = {
    ID: 0,
    HelpID: 0,
    Description: '',
    DetailDescription: '',
    Image: '',
    Icon: '',
    Attachment: {
      Base64String: '',
      Extention: ''
    }
  }
  imageBasePath: string = '';
  helpDetailArr: any[] = [];
  usermodel: UserModel;

  constructor(private apiService: vaplongapi, private notificationService: NotificationService,
    private router: Router, private storageService: StorageService) {

    this.usermodel = this.storageService.getItem('UserModel');
    this.imageBasePath = environment.HELP_IMAGE_PATH;
    
  }
  ngOnInit(): void {
    this.GetAllHelp(); // Get All Discount Group List On Page Load
  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    if (event.forLabel === 'Update') {
      this.EditHelp(event.selectedRowData);
    }
    if (event.forLabel === 'Delete') {
      this.DeleteHelp(event.selectedRowData.ID);
    }
  }
  AddHelpDetailToList() {
    if (this.helpDetails.Description === '' || this.helpDetails.DetailDescription === '' || this.helpDetails.Icon === '' || this.helpDetails.Attachment.Base64String === '') {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please Provide Required Fields');
      return false;
    }
    const obj = JSON.parse(JSON.stringify(this.helpDetails));
    this.helpDetailArr.push(obj);
    this.helpDetails = {
      ID: 0,
      HelpID: 0,
      Description: '',
      DetailDescription: '',
      Image: '',
      Icon: '',
      Attachment: {
        Base64String: '',
        Extention: ''
      }
    };
  }
  deleteItemFromProductArr(index) {
    this.helpDetailArr.splice(index, 1);
  }
  GetAllHelp() {
    this.apiService.GetAllHelp().pipe(untilDestroyed(this)).subscribe((response: any) => {
      
      if (response.ResponseText === 'success') {
        this.helpList = response.Helps;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    });
  }
  

  AddFolder()// Open Add New Folder Section
  {
    this.ResetFields();
    this.IsAdd = !this.IsAdd;
  }
  CloseAddSection()// Close Add New Folder Section
  {
    this.IsAdd = false;
    this.ResetFields();
  }
  save() {

    if (this.helpModel.ID > 0)  // for Update
    {
      this.UpdateHelp();
    }
    else {
      this.SaveHelp(); // for save
    }


  }
  validateFields(help: any) {
    
    if (help.Heading === '' || help.Description === '' || help.Icon === '' || help.Attachment.Base64String === '' && help.Image === '') {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please Provide Required Fields');
      return false;
    }

    return true;
  }
  SaveHelp() // Save Folder Lable Method To Communicate API
  {
    if (!this.validateFields(this.helpModel)) {
      return;
    }
    
    this.helpModel.ID = 0;
    this.helpModel.CreatedByUserID = this.usermodel.ID;
    this.helpModel.HelpDetails = this.helpDetailArr;
    this.apiService.SaveHelp(this.helpModel).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllHelp();
        this.IsAdd = false;
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }
  UpdateHelp() // Update Discount Group Method To Communicate API
  {
    if (this.helpModel.Attachment == null) {
      this.helpModel.Attachment = {
        Base64String: '',
        Extention: ''
      };
    }
    
    if (!this.validateFields(this.helpModel)) {
      return;
    }
    this.helpModel.HelpDetails = this.helpDetailArr;
    this.helpModel.CreatedByUserID = this.usermodel.ID;
    this.apiService.UpdateHelp(this.helpModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllHelp();
        this.IsAdd = false;

      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }

  EditHelp(data: any) {
    const obj = JSON.parse(JSON.stringify(data));
    this.helpModel = obj;
    this.helpDetailArr = obj.HelpDetails;
    this.IsAdd = true;
  }

  UpdateStatus(help: any) // Update Discount Group Status Method To Communicate API
  {
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = help.ID;
    this.updateStatusModel.Status = help.IsActive;
    this.updateStatusModel.UpdatedByUserID = this.usermodel.ID;

    this.apiService.UpdateHelpStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllHelp();
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);

      }
    });
  }
  DeleteHelp(ID: any) // Update Discount Group Status Method To Communicate API
  {
    var Request = { ID: ID };
    
    this.apiService.DeleteHelp(Request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllHelp();
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);

      }
    });
  }

  ResetFields() // Reset Object
  {
    this.helpModel = {
      ID: 0,
      Heading: '',
      Image: '',
      Description: '',
      Icon: '',
      IsActive: true,
      CreatedByUserID: 1,
      HelpDetails: [],
      Attachment: {
        Base64String: '',
        Extention: ''
      }
    };
    this.helpDetailArr = [];
  }

  onUpload(file, isForMaster = true) {
    
    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file[0]);
      const self = this;
      // tslint:disable-next-line: only-arrow-functions
      reader.onload = function (e) {
        const obj = { Base64String: reader.result.toString(), Extention: file[0].type.split('/')[1] };
        if (isForMaster) {
          self.helpModel.Attachment = obj;
        } else {
          self.helpDetails.Attachment = obj;
        }
      };

    }

  }

  // handleReaderLoaded(e) {
  //   this.base64textString.push({ Base64String: 'data:image/png;base64,' + btoa(e.target.result), Extention: 'png' });
  // }
}
