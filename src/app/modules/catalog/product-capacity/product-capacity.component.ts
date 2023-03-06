import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { ProductCapacity } from '../../../Helper/models/ProductCapacity';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from '../../shell/services/notification.service';


@Component({
  selector: 'app-product-capacity',
  templateUrl: './product-capacity.component.html',
  styles: [
  ],
})
export class ProductCapacityComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  AllProductCapacityList: ProductCapacity[] = [];
  selectedProductCapacity: ProductCapacity;
  public ProductCapacity: ProductCapacity;
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
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID' }
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },

  ];
  globalFilterFields = ['Name', 'Description'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];

  constructor(private apiService: vaplongapi, private notificationService: NotificationService) {

    this.ProductCapacity = new ProductCapacity();
  }

  ngOnInit(): void {
    this.GetAllProductCapacityList(); // Get All Classification List On Page Load

  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    this.EditProductCapacity(event.selectedRowData);
  }

  GetAllProductCapacityList() // Get All ProductCapacity Method Get Data from Service
  {
    this.IsSpinner = true;

    this.apiService.GetAllCapacity().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.AllProductCapacityList = response.AllCapacityList;
        this.totalRecords = response.AllCapacityList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  AddProductCapacity()// Open Add New ProductCapacity Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()// Close Add New ProductCapacity Section
  {
    this.IsAdd = false;

  }
  SaveUpdateProductCapacityDetails() {

    if (this.ProductCapacity.ID > 0)  // for Update
    {
      this.UpdateProductCapacity();
    }
    else {
      this.SaveProductCapacity(); // for save
    }


  }
  SaveProductCapacity() // Save Code Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddCapacity(this.ProductCapacity).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllProductCapacityList();
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
  UpdateProductCapacity() // Update ProductCapacity Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.UpdateCapacity(this.ProductCapacity).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllProductCapacityList();
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

  EditProductCapacity(ProductCapacity: ProductCapacity) {
    this.ProductCapacity = ProductCapacity;
    this.IsAdd = true;
  }

  UpdateProductCapacityStatus(ProductCapacity: any) // Update ProductCapacity Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = ProductCapacity.ID;
    this.updateStatusModel.Status = ProductCapacity.IsActive;
    this.updateStatusModel.UpdatedByUserID = ProductCapacity.CreatedByUserID;
    this.apiService.UpdateCapacityStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllProductCapacityList();
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

  ResetFields() // Reset Object
  {
    this.ProductCapacity = new ProductCapacity();
  }

}
