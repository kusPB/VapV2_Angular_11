import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from '../../shell/services/notification.service';
import { ProductPrint } from 'src/app/Helper/models/ProductPrint';


@Component({
  selector: 'app-product-print',
  templateUrl: './product-print.component.html',
  styles: [
  ],
})
export class ProductPrintComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  AllProductPrintList: ProductPrint[] = [];
  selectedProductPrint: ProductPrint;
  public ProductPrint: ProductPrint;
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

    this.ProductPrint = new ProductPrint();
  }

  ngOnInit(): void {
    this.GetAllProductPrintList(); // Get All Classification List On Page Load

  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    this.EditProductPrint(event.selectedRowData);
  }

  GetAllProductPrintList() // Get All ProductPrint Method Get Data from Service
  {
    this.IsSpinner = true;

    this.apiService.GetAllPrints().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.AllProductPrintList = response.AllPrintList;
        this.totalRecords = response.AllPrintList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  AddProductPrint()// Open Add New ProductPrint Section
  {
    this.ResetFields();
    this.IsAdd = true;
  }
  CloseAddSection()// Close Add New ProductPrint Section
  {
    this.IsAdd = false;

  }
  SaveUpdateDetails() {

    if (this.ProductPrint.ID > 0)  // for Update
    {
      this.UpdateProductPrint();
    }
    else {
      this.SaveProductPrint(); // for save
    }


  }
  SaveProductPrint() // Save Code Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.AddPrint(this.ProductPrint).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllProductPrintList();
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
  UpdateProductPrint() // Update ProductPrint Method To Communicate API
  {
    this.IsSpinner = true;
    this.apiService.UpdatePrint(this.ProductPrint).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllProductPrintList();
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

  EditProductPrint(ProductPrint: ProductPrint) {
    this.ProductPrint = ProductPrint;
    this.IsAdd = true;
  }

  UpdateProductPrintStatus(ProductPrint: any) // Update ProductPrint Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = ProductPrint.ID;
    this.updateStatusModel.Status = ProductPrint.IsActive;
    this.updateStatusModel.UpdatedByUserID = ProductPrint.CreatedByUserID;
    this.apiService.UpdatePrintStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllProductPrintList();
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
    this.ProductPrint = new ProductPrint();
  }

}
