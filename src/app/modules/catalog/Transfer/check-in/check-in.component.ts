import { DropdownModule } from 'primeng/dropdown';

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router, RouteReuseStrategy } from '@angular/router';
import { LazyLoadEvent, SelectItem, MenuItem } from 'primeng/api';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { OutletStockHistoryItem } from '../../../../Helper/models/OutletStockHistoryItem';
import { NonTrackableStockDetailsItem } from '../../../../Helper/models/NonTrackableStockDetailsItem';
import { TrackableStockDetailsItem } from '../../../../Helper/models/TrackableStockDetailsItem';
import { UserModel } from '../../../../Helper/models/UserModel';
import { AssignNonTrackableStockToHeadquarterRequest } from '../../../../Helper/models/AssignNonTrackableStockToHeadquarterRequest';
import { AssignTrackableStockToHeadquarterRequest } from '../../../../Helper/models/AssignTrackableStockToHeadquarterRequest';
import { TrackableReturnStockToHeadquarterItem } from '../../../../Helper/models/TrackableReturnStockToHeadquarterItem';
import { Columns } from 'src/app/shared/Model/columns.model';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { StorageService } from 'src/app/shared/services/storage.service';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit, OnDestroy {

  @ViewChild('dt') table: Table;
  AllNonTrackbleReturnDetailsItemList: NonTrackableStockDetailsItem[] = [];
  AllTrackbleReturnDetailsItemList: TrackableStockDetailsItem[] = [];
  outletStockHistoryItem: OutletStockHistoryItem;
  assignNonTrackableStockToHeadquarterRequest: AssignNonTrackableStockToHeadquarterRequest;
  assignTrackableStockToHeadquarterRequest: AssignTrackableStockToHeadquarterRequest;
  selectedTrackables: TrackableReturnStockToHeadquarterItem[] = [];
  usermodel: UserModel;

  ProductDropdown: SelectItem[];
  filteredProduct: any[];
  selectedProduct: any;
  IsTrackable: boolean;
  IsTrackableChecked: boolean;
  IsNonTrackableChecked: boolean;
  quantity: number;
  outletStock: number;
  outlet: string;
  IsSpinner = false;
  IsOpenProductDialog = false;
  disabled = true;
  isAllChecked = false;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // last = 25;
  totalRecords = 0;
  filterGlobal = false;
  multiSelect = false;
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  columns: Columns[] = [
    // { field: 'productChecked', header: 'Select', sorting: 'productChecked', placeholder: '', type: TableColumnEnum.CHECKBOX_COLUMN },
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '', searching: false, translateCol: 'SSGENERIC.PRODUCT' },
    { field: 'Quantity', header: 'Quantity', sorting: 'Quantity', placeholder: '', searching: false, translateCol: 'SSGENERIC.QUANTITY' },
  ];
  productsColumn: Columns[] = [
    { field: 'ProductVariantID', header: 'ID', sorting: 'ProductVariantID', placeholder: '' },
    { field: 'ProductName', header: 'Name', sorting: 'ProductName', placeholder: '' },
    { field: 'Barcode', header: 'Model', sorting: 'Barcode', placeholder: '' },
    // { field: 'Color', header: 'Color', sorting: 'Color', placeholder: '' },
    // { field: 'PurchasePrice', header: 'PurchasePrice', sorting: 'PurchasePrice', placeholder: '' }
  ];
  dataFunc: any = customSearchFn;
  ProductData: any[] = [];
  constructor(private apiService: vaplongapi, private notificationService: NotificationService, private storageService: StorageService) {
    this.outletStockHistoryItem = new OutletStockHistoryItem();
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'Update',
      Description: `Return Product Stock to Headquarter`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }
  ngOnDestroy() {

  }
  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    this.GetProductDropDownList(); // Get product autocomplete data
    this.outlet = this.usermodel.Outlet;
  }

  GetProductDropDownList() {
    this.ProductDropdown = [];
    this.apiService.GetProductDropDownDatawithVariantInfo().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {

        this.ProductData = response.DropDownData;
        for (const item of response.DropDownData) {
          this.ProductDropdown.push({
            value: item.ProductVariantID,
            label: item.ProducVariantName,
          });
        }
        this.filteredProduct = this.ProductDropdown;
        if (this.ProductDropdown.length > 0) {
          this.selectedProduct = this.ProductDropdown[0];
          this.CheckProductTrackbility();
        }

      }
      else {
        console.log('internal serve Error', response);
      }

    }
    );
  }

  search(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (const item of this.ProductDropdown) {
      const product = item;

      if (product.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(product);
      }
    }

    this.filteredProduct = filtered;

  }

  BindProductStockDetail(event: any) {
    if (event !== null) {
      this.CheckProductTrackbility();
    }
  }

  CheckProductTrackbility() {
    this.quantity = 0;
    this.outletStock = 0;
    this.IsSpinner = true;
    this.apiService.CheckAllProductsTrackability().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        const product = this.ProductData.find(x => x.ProductVariantID === this.selectedProduct.value);
        const trackables = response.AllProductTrackabilityInfoItemList.filter(x => x.ProductID === product.ProductID);
        if (trackables[0].IsTrackable) {
          this.IsTrackable = true;
          this.GetTrackableProducts(product.ProductID, this.selectedProduct.value);
        }
        else {
          this.IsTrackable = false;
          this.GetNonTrackableProducts(product.ProductID, this.selectedProduct.value);
        }
        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        console.log('internal serve Error', response);
      }
    });

  }


  GetTrackableProducts(productID, productVariantID) {
    this.IsSpinner = true;
    const params = {
      PageNo: 0,
      PageSize: 10000000,
      OutletID: this.usermodel.OutletID,
      ProductID: productID,
      ProductVariantID: productVariantID

    };
    this.apiService.GetTrackableReturnProducts(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      // console.log(response);
      if (response.ResponseCode === 0) {
        this.outletStockHistoryItem = response.OutletStockHistoryItem;
        this.AllTrackbleReturnDetailsItemList = response.AllTrackbleStockDetailsItemList;
        if (this.outletStockHistoryItem !== null) {
          this.outletStock = this.outletStockHistoryItem.TotalRemainingStock == null ? 0 : this.outletStockHistoryItem.TotalRemainingStock;
        }
        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        console.log('internal serve Error', response);
      }

    }
    );

  }

  GetNonTrackableProducts(productID, productVariantID) {
    this.IsSpinner = true;

    const params = {
      PageNo: 0,
      PageSize: 10000000,
      OutletID: this.usermodel.OutletID,
      ProductID: productID,
      ProductVariantID: productVariantID
    };

    this.apiService.GetNonTrackableReturnProducts(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.outletStockHistoryItem = response.OutletStockHistoryItem;

        const item1 = {
          NonTrackableProductsLocationID: 0,
          LevelID: 0,
          ProductID: this.outletStockHistoryItem.ProductID,
          ProductVariantID: this.outletStockHistoryItem.ProductVariantID,
          Product: this.outletStockHistoryItem.Product + ' (' + this.outletStockHistoryItem.ProductVariant + ')',
          ProductVariant: '',
          Location: '',
          Quantity: this.outletStockHistoryItem.TotalRemainingStock,
          SelectedQuantity: 0,
          isProductSelected: false,
          isQuantityChangeable: false,
        };
        this.AllNonTrackbleReturnDetailsItemList = [];
        if (this.outletStockHistoryItem.TotalRemainingStock > 0) {
          this.AllNonTrackbleReturnDetailsItemList.push(item1);
        }
        if (this.outletStockHistoryItem !== null) {
          this.outletStock = this.outletStockHistoryItem.TotalRemainingStock == null ? 0 : this.outletStockHistoryItem.TotalRemainingStock;
        }
        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        console.log('internal serve Error', response);
      }

    }
    );

  }

  SaveTrackable() {

    if (this.IsTrackable) {
      this.ReturnTrackable();
    }
    else {
      this.ReturnNonTrackable();
    }
  }

  ReturnTrackable() {

    if (this.quantity === 0) {
      this.notificationService.notify(NotificationEnum.INFO, 'Warning', 'Please select quantity.');
      return;
    }

    if (this.selectedTrackables.length === 0) {
      this.notificationService.notify(NotificationEnum.INFO, 'Warning', 'No product selected.');
      return;
    }
    this.assignTrackableStockToHeadquarterRequest = new AssignTrackableStockToHeadquarterRequest();
    this.assignTrackableStockToHeadquarterRequest.CreatedByID = this.usermodel.ID;
    this.assignTrackableStockToHeadquarterRequest.AllTrackableReturnStockToHeadquarterList = this.selectedTrackables;

    this.apiService.ReturnTrackable(this.assignTrackableStockToHeadquarterRequest).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'trackable stock return to headquarter  successfully.');
        const product = this.ProductData.find(x => x.ProductVariantID === this.selectedProduct.value);
        this.GetTrackableProducts(product.ProductID, this.selectedProduct.value);
        this.quantity = 0;
        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        console.log('internal serve Error', response);
      }
    });


  }

  ReturnNonTrackable() {
    if (this.quantity === 0) {
      this.notificationService.notify(NotificationEnum.INFO, 'Warning', 'Please select quantity.');
      return;
    }
    const product = this.ProductData.find(x => x.ProductVariantID === this.selectedProduct.value);
    this.assignNonTrackableStockToHeadquarterRequest = new AssignNonTrackableStockToHeadquarterRequest();

    this.assignNonTrackableStockToHeadquarterRequest.ProductID = product.ProductID;
    this.assignNonTrackableStockToHeadquarterRequest.OutletID = this.usermodel.OutletID;
    this.assignNonTrackableStockToHeadquarterRequest.ProductVariantID = this.selectedProduct.value;
    this.assignNonTrackableStockToHeadquarterRequest.Quantity = this.quantity;
    this.assignNonTrackableStockToHeadquarterRequest.CreatedByUserID = this.usermodel.ID;

    this.apiService.ReturnNonTrackable(this.assignNonTrackableStockToHeadquarterRequest)
      .pipe(untilDestroyed(this)).subscribe((response: any) => {

        if (response.ResponseText === 'success') {
          this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Non trackable stock return to headquarter  successfully.');
          const products = this.ProductData.find(x => x.ProductVariantID === this.selectedProduct.value);
          this.GetNonTrackableProducts(products.ProductID, this.selectedProduct.value);
          this.IsSpinner = false;
        }
        else {
          this.IsSpinner = false;
          console.log('internal serve Error', response);
        }
      }
      );

  }

  TrackableCheckboxChange(trackable: any, event: any) {
    if (event.checked === true) {
      const item = { TrackableForShoppingID: trackable.TrackableForShoppingID };
      const trackableSingleStockHistory = this.selectedTrackables.filter(x => x.StockHistoryID === trackable.StockHistoryID).shift();
      if (!(trackableSingleStockHistory == null)) {
        if (trackableSingleStockHistory.AllTrackableOutletAssignmentItemDetailList.length > 0) {
          trackableSingleStockHistory.AllTrackableOutletAssignmentItemDetailList.push(item);
        }
      }
      else {
        const allTrackableOutletAssignmentItemDetailList = new Array();
        allTrackableOutletAssignmentItemDetailList.push(item);

        const trackableProduct = {
          AllTrackableOutletAssignmentItemDetailList: allTrackableOutletAssignmentItemDetailList,
          OutletID: this.usermodel.OutletID,
          StockHistoryID: trackable.StockHistoryID,
          OutletStockHistoryID: trackable.OutletStockHistoryID

        };
        this.selectedTrackables.push(trackableProduct);
      }
      if (isNaN(this.quantity)) {
        this.quantity = 0;
      }

      this.quantity = this.quantity + 1;
    }
    else if (event.checked === false) {
      const trackables = this.selectedTrackables.filter(x => x.StockHistoryID === trackable.StockHistoryID).shift();
      if (trackables != null) {
        const trackableList = trackables.AllTrackableOutletAssignmentItemDetailList;
        if (trackableList != null) {
          if (trackableList.length > 0) {
            const trackableID = trackableList.findIndex(x => x.TrackableForShoppingID === trackable.TrackableForShoppingID);
            if (trackableID != null) {
              trackableList.splice(trackableID, 1);

              if (trackableList.length === 0) {
                const trackableIndex = this.selectedTrackables.filter(x => x.StockHistoryID === trackable.StockHistoryID).shift();
                this.selectedTrackables.splice(Number(trackableIndex), 1);
              }
            }
          }
        }
      }
      if (isNaN(this.quantity)) {
        this.quantity = 0;
      }

      this.quantity = this.quantity - 1;
    }
  }

  OpenProductDialog() {
    this.IsOpenProductDialog = true;
  }

  selectValue(newValue: any) {
    this.IsOpenProductDialog = false;
    const obj = {
      value: newValue.ID ? newValue.Id : newValue.ProductVariantID,
      label: newValue.Product ? newValue.Product : newValue.ProducVariantName
    };
    this.selectedProduct = obj;
    this.CheckProductTrackbility();
  }
  CheckAllCheckBox() {
    if (this.isAllChecked) {
      console.log(this.AllTrackbleReturnDetailsItemList);
    }
    else {
      this.selectedTrackables = [];
      this.quantity = 0;
    }
  }
}
