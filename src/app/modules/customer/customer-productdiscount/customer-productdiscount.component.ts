import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { UpdateStatus } from 'src/app/Helper/models/UpdateStatus';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { UserModel } from 'src/app/Helper/models/UserModel';

import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { customSearchFn } from '../../../shared/constant/product-search';
import { StorageService } from 'src/app/shared/services/storage.service';


@Component({
  selector: 'app-customer-productdiscount',
  templateUrl: './customer-productdiscount.component.html',
  styleUrls: ['./customer-productdiscount.component.scss'],
  providers: []
})
export class CustomerProductDiscountComponent implements OnInit, OnDestroy {
  AllCustomerProductsDiscountList: any[] = [];
  selectedCustomerProductsDiscount;
  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = true;
  loading: boolean;
  first = 0;
  rows = 25;
  // last = 25;
  totalRecords = 0;
  items: MenuItem[];
  cols: any[];
  exportColumns: any[];
  updateStatusModel: UpdateStatus;
  usermodel: UserModel;

  valCheck = '';
  ProductSearch = '';
  selectedProductID = '';
  Products: any[];
  filteredProduct: any[];
  selectedProduct: any = {};

  MinDiscPer = 0;
  MaxDiscPer = 0;
  txtName = '';
  txtDiscountGroup = '';
  txtDiscountGroupType = '';
  txtCurrentBalance = 0;
  txtEmail = '';
  txtCompany = '';
  txtPhoneNo = '';
  txtMobileNo = '';
  CustomerID = 1;
  selectedRowForDiscountUpdate: '';
  displayUpdateModel = false;
  updateMinDiscPer = 0;
  updateMaxDiscPer = 0;

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID' },
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON },
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '' },
    { field: 'fMinDiscPrec', header: 'Min Disc.', sorting: 'fMinDiscPrec', placeholder: '' },
    { field: 'fMaxDiscPerc', header: 'Max Disc.', sorting: 'fMaxDiscPerc', placeholder: '' },

  ];
  productsColumn: Columns[] = [
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '' },
    { field: 'Color', header: 'Color', sorting: 'Color', placeholder: '' },
    { field: 'PurchasePrice', header: 'PurchasePrice', sorting: 'PurchasePrice', placeholder: '' }
  ];
  globalFilterFields = ['fMinDiscPrec', 'fMaxDiscPerc', 'Product'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  IsOpenProductDialog = false;
  ProductData: any = [];
  dataFunc: any = customSearchFn;

  constructor(
    private route: ActivatedRoute, private apiService: vaplongapi,
    private readonly notificationService: NotificationService, private storageService: StorageService) {
    this.CustomerID = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    this.GetCustomerID(this.CustomerID);
    this.getAllProductsDiscountByCustomerID(this.CustomerID);
    this.GetProductVariantDropDownList(); // Get All ProductVariant List On Page Load for Dropdown
  }
  ngOnDestroy(): void {
  }
  emitAction(event) {
    if (event.forLabel === 'Update') {
      this.EditRecord(event.selectedRowData);
    }

  }
  EditRecord(selected) {
    this.updateMinDiscPer = selected.fMinDiscPrec;
    this.updateMaxDiscPer = selected.fMaxDiscPerc;
    this.displayUpdateModel = true;
  }
  UpdateSelectedDiscountDetails() {
    this.IsSpinner = true;
    const params =
    {
      ID: this.selectedCustomerProductsDiscount.ID,
      fMaxDiscPerc: this.updateMaxDiscPer,
      fMinDiscPrec: this.updateMinDiscPer,
      nDailyQuota: this.selectedCustomerProductsDiscount.nDailyQuota,
      nMonthlyQuota: this.selectedCustomerProductsDiscount.nMonthlyQuota,
      nMaxShopQuantity: this.selectedCustomerProductsDiscount.nMaxShopQuantity,
      bShowForShop: this.selectedCustomerProductsDiscount.bShowForShop,
      CustomerID: this.selectedCustomerProductsDiscount.CustomerID,
      ProductID: this.selectedCustomerProductsDiscount.ProductID,
      CreatedByUserID: this.usermodel.ID,
    };
    this.apiService.UpdateCustomerProductsDiscount(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.IsSpinner = false;
        this.displayUpdateModel = false;
        this.getAllProductsDiscountByCustomerID(this.CustomerID);

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
    );
  }


  SaveCustomerProductsDiscount() // Save Method To Communicate API
  {
    this.IsSpinner = true;

    const params =
    {
      ProductID: Number(this.selectedProduct.value),
      MaxDiscountPerc: this.MaxDiscPer,
      MinDiscountPerc: this.MinDiscPer,
      DiscountGroupID: this.CustomerID,
      CreatedByUserID: this.usermodel.ID,
    };
    this.apiService.AddCustomerProductWiseDiscount(params).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.getAllProductsDiscountByCustomerID(this.CustomerID);
        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    });
  }


  UpdateCustomerProductsDiscountStatus(selectedRow: any) // Update Status Method To Communicate API
  {
    this.IsSpinner = true;
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = selectedRow.ID;
    // this.updateStatusModel.Status=(selectedRow.IsActive=== true) ? false : true;
    this.updateStatusModel.Status = selectedRow.IsActive;

    this.updateStatusModel.UpdatedByUserID = this.usermodel.ID;
    this.apiService.UpdateCustomerProductsDiscountStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.getAllProductsDiscountByCustomerID(this.CustomerID);
        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    });
  }

  GetCustomerID(id) {
    const params = { ID: id };
    this.apiService.GetCustomerbyID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.txtName = 'Name: ' + response.CustomerModel.FirstName + ' ' + response.CustomerModel.LastName;
        this.txtDiscountGroup = 'Group: ' + ((response.CustomerModel.DiscountGroup === null) ?
          'No discount group assigned' : response.Customer.DiscountGroup);
        this.txtDiscountGroupType = 'Discount: ' + '';
        this.txtCurrentBalance = response.CustomerModel.CurrentBalance;
        this.txtEmail = 'Email: ' + response.CustomerModel.EmailAddress;
        this.txtCompany = 'Company: ' + response.CustomerModel.sCompanyName;
        this.txtPhoneNo = 'Tel: ' + response.CustomerModel.PhoneNo;
        this.txtMobileNo = 'Mobile: ' + response.CustomerModel.Mobile;
      }
      else {
        console.log('internal serve Error', response);
      }
    });
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
    });
  }

  getAllProductsDiscountByCustomerID(id) {
    this.IsSpinner = true;
    const param = { ID: id };
    this.apiService.GetAllCustomerProductsDiscountByCustomerID(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.AllCustomerProductsDiscountList = response.AllCustomerProductsDiscountList;
        this.totalRecords = response.AllCustomerProductsDiscountList.length;
        if (response.AllCustomerProductsDiscountList.length > 0) {
          this.txtDiscountGroupType = 'Group Type: ' + response.AllCustomerProductsDiscountList[0].ActiveDiscountType;
        }
        this.IsSpinner = false;
      } else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    });
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
