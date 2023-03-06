import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { WishlistModel } from 'src/app/Helper/models/WishlistModel';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';


import { Columns } from 'src/app/shared/Model/columns.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { StorageService } from 'src/app/shared/services/storage.service';


@Component({
  selector: 'app-manage-internal-orders',
  templateUrl: './manage-internal-orders.component.html',
  styleUrls: ['./manage-internal-orders.component.scss']
})

export class ManageInternalOrdersComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  AllInternalOrderList: WishlistModel[] = [];
  selectedInternalOrder: WishlistModel;
  public internalOrder: WishlistModel;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedProductID = '';
  Products: any[];
  filteredProduct: any[];
  selectedProduct: any;
  Quantity;
  Remarks;
  items: MenuItem[];
  ProductDropdown: SelectItem[];
  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 25;
  // last = 25;
  totalRecords = 0;

  usermodel: UserModel;
  displayDialog = false;
  DialogRemarks = '';

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-edit', dependedProperty: 'ID' },
  ];

  rowGroup: RowGroup = {
    property: 'CreatedAt',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };

  columns: Columns[] = [
    { field: 'CreatedBy', header: 'Created By', sorting: 'CreatedBy', placeholder: '' , translateCol: 'SSGENERIC.CREATEDBY'},
    { field: 'BLabel', header: 'Model', sorting: 'BLabel', placeholder: '', translateCol: 'SSGENERIC.MODEL' },
    { field: 'Barcode', header: 'EAN', sorting: 'Barcode', placeholder: '' , translateCol: 'SSGENERIC.EAN'},
    { field: 'ProductVariant', header: 'Product', sorting: 'ProductVariant', placeholder: '', translateCol: 'SSGENERIC.PRODUCT' },
    { field: 'Quantity', header: 'Quantity', sorting: 'Quantity', placeholder: '' , translateCol: 'SSGENERIC.QUANTITY'},
    { field: 'CreatedAt', header: 'CreatedAt', sorting: 'CreatedAt', placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.CREATEDAT' },
    { field: 'Outlet', header: 'Outlet', sorting: 'Outlet', placeholder: '' , translateCol: 'SSGENERIC.OUTLET'},
    { field: 'Remarks', header: 'Remarks', sorting: '', placeholder: '', type: TableColumnEnum.REMARKS, translateCol: 'SSGENERIC.REMARKS' },

  ];
  productsColumn: Columns[] = [
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '' },
    { field: 'Color', header: 'Color', sorting: 'Color', placeholder: '' },
    { field: 'PurchasePrice', header: 'PurchasePrice', sorting: 'PurchasePrice', placeholder: '' }
  ];
  globalFilterFields = ['CreatedBy','BLabel', 'ProductVariantID', 'Barcode', 'ProductVariant', 'Quantity', 'CreatedAt', 'Outlet'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];

  dataFunc: any = customSearchFn;
  ProductData: any = [];
  IsOpenProductDialog = false;
  constructor(private apiService: vaplongapi, private notificationService: NotificationService, private storageService: StorageService) {
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Wish-Lists`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {

    this.usermodel = this.storageService.getItem('UserModel');
    this.internalOrder = new WishlistModel();
    this.GetAllInternalOrderList(); // Get All Internal Order List On Page Load
    this.GetProductVariantDropDownList(); // Get All ProductVariant List On Page Load for Dropdown

  }
  ngOnDestroy(): void {

  }
  emitAction(event) {
    if (event.forLabel === 'Update') {
      this.EditInternalOrder(event.selectedRowData);
    }

  }
  GetAllInternalOrderList() // Get All Internal Method Get Data from Service
  {
    const request = new FilterRequestModel();
    request.IsPurchased = false;
    request.IsAproved = false;
    if (this.usermodel.ID === 1) {
      request.IsGetAll = true;
    } else {
      request.ID = this.usermodel.ID;
    }
    this.apiService.GetAllInternalOrderList(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        
        this.AllInternalOrderList = response.Wishlists.filter(x => x.IsApproved === false);
        this.totalRecords = this.AllInternalOrderList.length;

      }
      else {
        console.log('internal server error ! not getting api data');
      }
    },
    );

  }

  GetProductVariantDropDownList() {

    this.Products = [];
    // this.apiService.GetProductDropDownDatawithVariantInfo().pipe(untilDestroyed(this)).subscribe((response: any) => {
    //   if (response.ResponseCode === 0) {
    //     this.selectedProductID = response.DropDownData[0].ProductVariantID;
    //     for (let i = 0; i < response.DropDownData.length; i++) {
    //       this.Products.push({
    //         value: response.DropDownData[i].ProductVariantID,
    //         label: response.DropDownData[i].ProducVariantName,
    //       });
    //     }
    this.apiService.GetPurchaseProduct().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        response.AllProductVariantList = response.AllProductVariantList.filter(x => x.IsActive === true);
        this.ProductData = response.AllProductVariantList;
        for (const item of response.AllProductVariantList) {
          this.Products.push({
            value: item.ID,
            label: item.Product,
          });
        }
        this.filteredProduct = this.Products;

      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
  }

  SaveUpdateInternalOrderDetails() {
    if (this.internalOrder.ID > 0)  // for Update
    {
      this.UpdateInternalOrder();
    }
    else {
      this.SaveInternalOrder(); // for save
    }


  }
  SaveInternalOrder() // Save InternalOrder Method To Communicate API
  {
    this.IsSpinner = true;
    this.internalOrder.ProductVariantID = Number(this.selectedProduct.value);
    this.internalOrder.Remarks = this.Remarks;
    this.internalOrder.Quantity = this.Quantity;
    this.internalOrder.CreatedByID = this.usermodel.ID;
    this.internalOrder.OutletID = this.usermodel.OutletID;
    this.apiService.AddWishlist(this.internalOrder).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllInternalOrderList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    });
  }
  UpdateInternalOrder() // Update Cash Register Method To Communicate API
  {
    this.IsSpinner = true;
    this.internalOrder.ProductVariantID = Number(this.selectedProduct.value);
    this.internalOrder.Remarks = this.Remarks;
    this.internalOrder.Quantity = this.Quantity;
    this.internalOrder.CreatedByID = this.usermodel.ID;
    this.internalOrder.OutletID = this.usermodel.OutletID;

    this.apiService.UpdateWishlist(this.internalOrder).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.GetAllInternalOrderList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }

  EditInternalOrder(internalOrder: WishlistModel) {
    this.internalOrder = internalOrder;
    this.selectedProduct = {
      value: internalOrder.ProductVariantID,
      label: internalOrder.ProductVariant
    };
    this.Quantity = this.internalOrder.Quantity;
    this.Remarks = this.internalOrder.Remarks;

  }

  showDialog(event) {
    this.displayDialog = true;
    this.DialogRemarks = event.Remarks;
  }
  OpenProductDialog() {
    this.IsOpenProductDialog = true;
  }
  selectValue(newValue: any) {
    const obj = {
      value: newValue.ID,
      label: newValue.Product
    };
    this.selectedProduct = obj;
    this.IsOpenProductDialog = false;
  }

}

