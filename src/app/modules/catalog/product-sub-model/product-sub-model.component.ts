import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { ProductModel } from '../../../Helper/models/ProductModel';
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
  selector: 'app-product-sub-model',
  templateUrl: './product-sub-model.component.html',
  styleUrls: ['./product-sub-model.component.scss']
})
export class ProductSubModelComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  AllProductModelList: ProductModel[] = [];
  AllProductModelOriginalList: ProductModel[]=[];
  selectedProductModel: ProductModel;
  public productModel: ProductModel;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];
  usermodel: UserModel;

  filteredModels: any[];
  selectedModel: any;

  valCheck = '';
  ProductSearch = '';
  ProductModels: any[];

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
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID' }
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'ParentName', header: 'Parent Name', sorting: 'ParentName', placeholder: '', translateCol: 'SSGENERIC.PARENT' },
    // { field: 'DisplayName', header: 'Display Name', sorting: 'DisplayName', placeholder: '', translateCol: 'SSGENERIC.DISPLAYNAME' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },

  ];
  globalFilterFields = ['Name','DisplayName','ParentName' ,'Description'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];

  constructor(private apiService: vaplongapi,  private storageService: StorageService, private notificationService: NotificationService) {
    this.productModel = new ProductModel();
    this.usermodel = this.storageService.getItem('UserModel');

    const obj = {
      Action: 'View',
      Description: `View Product types`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {  

    this.GetAllProductModelList(); // Get All Product Model List On Page Load
    this.BindModelDropdownList(); // Bind Autocomplete


  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    this.EditProductModel(event.selectedRowData);
  }

  GetAllProductModelList() // Get All Product Quality Method Get Data from Service 
  {
    this.IsSpinner = true;

    this.apiService.GetAllProductModels().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllProductModelOriginalList = response.ProductModels;
        this.AllProductModelList = response.ProductModels.filter(x => x.ParentID != 0 && x.IsActive === true);
        this.totalRecords = this.AllProductModelList.length;
        this.filteredModels = response.ProductModels.filter(x => x.ParentID == 0 && x.IsActive === true);
        // var rootModel = new ProductModel();
        // rootModel.ID=0;
        // rootModel.DisplayName='No Parent';
        // this.filteredModels.push(rootModel);
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  AddProductModel()// Open Add New Product Model Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()// Close Add New Product Model Section
  {
    this.IsAdd = false;

  }
  SaveUpdateProductModelDetails() {

    if (this.productModel.ID > 0)  // for Update
    {
      this.UpdateProductModel();
    }
    else {
      this.SaveProductModel(); // for save
    }


  }
  SaveProductModel() // Save Product Model Method To Communicate API
  {

    if(this.selectedModel.ID==null || this.selectedModel.ID==undefined )
    {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', "please select parent model");
    }
    this.productModel.ID = 0;
    this.productModel.IsActive = true;
    this.productModel.ParentID = this.selectedModel.ID;
    this.productModel.CreatedByUserID = this.usermodel.ID;
    this.apiService.AddProductModel(this.productModel).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllProductModelList();
        this.IsAdd = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }
  UpdateProductModel() // Update Product Model Method To Communicate API
  {
    if(this.selectedModel.value==null || this.selectedModel.value==undefined )
    {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', "please select parent category");
    }
    this.productModel.IsActive = true;
    this.productModel.ParentID = this.selectedModel.value;
    this.productModel.CreatedByUserID = this.usermodel.ID;

    this.apiService.UpdateProductModel(this.productModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllProductModelList();
        this.IsAdd = false;

      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }

  EditProductModel(productModel: ProductModel) {
    this.productModel = productModel;
    var pcategory = this.AllProductModelOriginalList.find(x=>x.ID==productModel.ParentID);
    this.selectedModel = {
      value: pcategory.ID,
      DisplayName: pcategory.DisplayName
    };
    this.IsAdd = true;
  }

  UpdateProductModelStatus(productModel: any) // Update Product Model Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = productModel.ID;
    this.updateStatusModel.Status = productModel.IsActive;
    this.updateStatusModel.UpdatedByUserID = this.usermodel.ID;
    this.apiService.UpdateProductModelStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllProductModelList();
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
    this.productModel = new ProductModel();
  }

  search(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.ProductModels.length; i++) {
      const shopCategory = this.ProductModels[i];

      if (shopCategory.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(shopCategory);
      }
    }

    this.filteredModels = filtered;

  }

  BindModelDropdownList() {
    this.ProductModels = [];
    this.apiService.GetProductModelDropDownData().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        for (let i = 0; i < response.DropDownData.length; i++) {
          this.ProductModels.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }
}
