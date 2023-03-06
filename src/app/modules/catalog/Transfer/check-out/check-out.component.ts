import { OutletStockHistoryItem } from './../../../../Helper/models/OutletStockHistoryItem';
import { StockHistoryItem } from './../../../../Helper/models/StockHistoryItem';
import { TrackableStockDetailsItem } from './../../../../Helper/models/TrackableStockDetailsItem';
import { NonTrackableStockDetailsItem } from './../../../../Helper/models/NonTrackableStockDetailsItem';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, SelectItem, MenuItem } from 'primeng/api';
import { TrackableOutletAssignmentItem } from '../../../../Helper/models/TrackableOutletAssignmentItem';
import { NonTrackableStockLocationItem } from '../../../../Helper/models/NonTrackableStockLocationItem';
import { UserModel } from '../../../../Helper/models/UserModel';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { AssignNonTrackableStockToOutletRequest } from 'src/app/Helper/models/AssignNonTrackableStockToOutletRequest';
import { AssignTrackableStockToOutletRequest } from 'src/app/Helper/models/AssignTrackableStockToOutletRequest';
import { Columns } from 'src/app/shared/Model/columns.model';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { StorageService } from 'src/app/shared/services/storage.service';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

// import { AssignNonTrackableStockToOutletRequest } from '../../../Helper/models/AssignNonTrackableStockToOutletRequest';
// import { AssignTrackableStockToOutletRequest } from '../../../Helper/models/AssignTrackableStockToOutletRequest';


@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  AllNonTrackbleStockDetailsItemList: NonTrackableStockDetailsItem[] = [];
  AllTrackbleStockDetailsItemList: TrackableStockDetailsItem[] = [];
  stockHistoryItem: StockHistoryItem;
  outletStockHistoryItem: OutletStockHistoryItem;
  assignNonTrackableStockToOutletRequest: AssignNonTrackableStockToOutletRequest;
  assignTrackableStockToOutletRequest: AssignTrackableStockToOutletRequest;
  selectedTrackables: TrackableOutletAssignmentItem[] = [];
  selectedNonTrackables: NonTrackableStockLocationItem[] = [];
  selected: NonTrackableStockLocationItem[];
  usermodel: UserModel;


  OutletDropdown: SelectItem[];
  ProductDropdown: SelectItem[];
  filteredProduct: any[];
  selectedProduct: any;
  selectedOutletID = '';
  IsTrackable: boolean;
  IsTrackableChecked: boolean;
  IsNonTrackableChecked: boolean;
  quantity = 0;
  outletStock: number;
  outlet: string;
  headquaterStock: number;
  IsOpenProductDialog = false;
  IsSpinner = false;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  disabled = true;
  // last = 25;
  totalRecords = 0;
  filterGlobal = false;
  multiSelect = false;
  columns: Columns[] = [
    { field: 'productChecked', header: 'Select', sorting: 'productChecked', placeholder: '', type: TableColumnEnum.CHECKBOX_COLUMN, translateCol: 'SSGENERIC.SELECT' },
    { field: 'Location', header: 'Location', sorting: 'Location', placeholder: '', searching: false, translateCol: 'SSGENERIC.LOCATION' },
    { field: 'Quantity', header: 'Quantity', sorting: 'Quantity', placeholder: '', searching: false, translateCol: 'SSGENERIC.QUANTITY' },
    { field: 'SelectedQuantity', header: 'Selected Quantity', sorting: '', placeholder: '', searching: false , translateCol: 'SSGENERIC.SELECTEDQ'},

  ];
  productsColumn: Columns[] = [
    { field: 'ProductVariantID', header: 'ID', sorting: 'ProductVariantID', placeholder: '' },
    { field: 'ProductName', header: 'Name', sorting: 'ProductName', placeholder: '' },
     { field: 'Barcode', header: 'Model', sorting: 'Barcode', placeholder: '' },
    // { field: 'Color', header: 'Color', sorting: 'Color', placeholder: '' },
    // { field: 'PurchasePrice', header: 'PurchasePrice', sorting: 'PurchasePrice', placeholder: '' }
  ];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  dataFunc: any = customSearchFn;
  ProductData: any[] = [];
  allTrackableProductChecked = false;
  constructor(
    private apiService: vaplongapi, private storageService: StorageService,
    private notificationService: NotificationService) {
    this.stockHistoryItem = new StockHistoryItem();
    this.outletStockHistoryItem = new OutletStockHistoryItem();
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'Update',
      Description: `Transfer Product Stock to an Outlet`,
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
    this.GetOutletDropDownList(); // Get product outlet data


  }

  GetProductDropDownList() {
    this.IsSpinner = true;
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
          // this.selectedProduct = this.ProductDropdown[0];
          this.CheckProductTrackbility();
          this.IsSpinner = false;
        }
        else {
          this.IsSpinner = false;
        }
      }
      else {
        this.IsSpinner = false;
        console.log('internal serve Error', response);
      }
    });
  }

  GetOutletDropDownList() {
    this.IsSpinner = true;
    this.OutletDropdown = [];
    this.apiService.GetOutletForDropdownWithoutHeadQuarter().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        for (const item of response.DropDownData) {
          this.OutletDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
        if (this.OutletDropdown.length > 0) {
          this.selectedOutletID = response.DropDownData[0]?.ID;
          this.outlet = response.DropDownData[0].Name;
        }
        this.IsSpinner = false;
      } else {
        this.IsSpinner = false;
        console.log('internal serve Error', response);
      }
    });
  }

  // search(event) {
  //   // let filtered: any[] = [];
  //   let query = event.query;
  //   // for (let i = 0; i < this.ProductDropdown.length; i++) {
  //   //   let product = this.ProductDropdown[i];

  //   //   if (product.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
  //   //     filtered.push(product);
  //   //   }
  //   // }
  //   this.filteredProduct = [...this.ProductDropdown].filter(x => x.label.toLowerCase().includes(query.toLowerCase())).map(x => x);
  //   // this.filteredProduct = filtered;

  // }



  BindProductStockDetail(event: any) {
    if (event !== null) {
      this.CheckProductTrackbility();
    }
  }

  CheckProductTrackbility() {
    this.IsSpinner = true;
    this.apiService.CheckAllProductsTrackability().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        if (this.selectedProduct) {
          const product = this.ProductData.find(x => x.ProductVariantID === this.selectedProduct.value);
          const trackables = response.AllProductTrackabilityInfoItemList.filter(x => x.ProductID === product.ProductID);
          if (trackables[0].IsTrackable) {
            this.IsTrackable = true;
            this.GetTrackableProducts(product.ProductID, this.selectedProduct.value);
            this.IsSpinner = false;
          }
          else {
            this.IsTrackable = false;
            this.GetNonTrackableProducts(product.ProductID, this.selectedProduct.value);
            this.IsSpinner = false;
          }

        }
      }
      else {
        this.IsSpinner = false;
        console.log('internal serve Error', response);
      }

    }
    );

  }


  GetTrackableProducts(productID, productVariantID) {
    const params = {
      PageNo: 0,
      PageSize: 10000000,
      OutletID: this.usermodel.OutletID /* this.selectedOutletID */,
      ProductID: productID,
      ProductVariantID: productVariantID

    };

    this.apiService.GetTrackableProducts(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      // console.log(response);
      if (response.ResponseText === 'Success') {

        this.stockHistoryItem = response.StockHistoryItem;
        this.outletStockHistoryItem = response.OutletStockHistoryItem;
        this.AllTrackbleStockDetailsItemList = response.AllTrackbleStockDetailsItemList;
        if (this.stockHistoryItem !== null) {
          this.headquaterStock = this.stockHistoryItem.TotalRemainingStock;
        }
        if (this.outletStockHistoryItem !== null) {
          this.outletStock = this.outletStockHistoryItem.TotalRemainingStock == null ? 0 : this.outletStockHistoryItem.TotalRemainingStock;
        }
      }
      else {
        this.AllTrackbleStockDetailsItemList = [];
        this.AllNonTrackbleStockDetailsItemList = [];
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'internal serve Error');
        console.log('internal serve Error', response);
      }
    });

  }

  GetNonTrackableProducts(productID, productVariantID) {

    const params = {
      PageNo: 0,
      PageSize: 10000000,
      OutletID: this.usermodel.OutletID/* this.selectedOutletID */,
      ProductID: productID,
      ProductVariantID: productVariantID
    };

    this.apiService.GetNonTrackableProducts(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'Success') {
        this.stockHistoryItem = response.StockHistoryItem;
        this.AllNonTrackbleStockDetailsItemList = response.AllNonTrackbleStockDetailsItemList;
        this.outletStockHistoryItem = response.OutletStockHistoryItem;
        if (this.stockHistoryItem !== null) {
          this.headquaterStock = this.stockHistoryItem.TotalRemainingStock;
        }
        if (this.outletStockHistoryItem !== null) {
          this.outletStock = this.outletStockHistoryItem.TotalRemainingStock == null ? 0 : this.outletStockHistoryItem.TotalRemainingStock;
        }
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'internal serve Error');
        this.AllTrackbleStockDetailsItemList = [];
        this.AllNonTrackbleStockDetailsItemList = [];
        console.log('internal serve Error', response);
      }
    });

  }

  SaveTrackable() {

    if (this.IsTrackable) {
      this.TransferTrackable();
    }
    else {
      this.TransferNonTrackable();
    }
    this.ngOnInit();
  }

  TransferTrackable() {

    if (this.selectedTrackables.length === 0) {
      this.notificationService.notify(NotificationEnum.INFO, 'Warning', 'No product selected.');
      return;
    }
    this.IsSpinner = true;
    this.assignTrackableStockToOutletRequest = new AssignTrackableStockToOutletRequest();
    this.assignTrackableStockToOutletRequest.CreatedByID = this.usermodel.ID;
    this.assignTrackableStockToOutletRequest.AllTrackableOutletAssignmentItemList = this.selectedTrackables;

    this.apiService.TransferTrackable(this.assignTrackableStockToOutletRequest).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Trackable stock transfered to outlet  successfully.');
        const product = this.ProductData.find(x => x.ProductVariantID === this.selectedProduct.value);
        this.GetTrackableProducts(product.ProductID, this.selectedProduct.value);
        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        console.log('internal serve Error', response);
      }
    });
  }

  TransferNonTrackable() {
    this.IsSpinner = true;
    if (this.selectedNonTrackables.length === 0) {
      this.notificationService.notify(NotificationEnum.INFO, 'Warning', 'No product selected.');
      return;
    }
    const product = this.ProductData.find(x => x.ProductVariantID === this.selectedProduct.value);
    this.assignNonTrackableStockToOutletRequest = new AssignNonTrackableStockToOutletRequest();
    this.assignNonTrackableStockToOutletRequest.NonTrackableStockLocationItemList = [];
    this.assignNonTrackableStockToOutletRequest.ProductID = product.ProductID;
    this.assignNonTrackableStockToOutletRequest.OutletID = Number(this.selectedOutletID);
    this.assignNonTrackableStockToOutletRequest.ProductVariantID = this.selectedProduct.value;
    this.assignNonTrackableStockToOutletRequest.Quantity = this.quantity;
    this.assignNonTrackableStockToOutletRequest.CreatedByUserID = this.usermodel.ID;
    this.assignNonTrackableStockToOutletRequest.NonTrackableStockLocationItemList = this.selectedNonTrackables;

    this.apiService.TransferNonTrackable(this.assignNonTrackableStockToOutletRequest).
      pipe(untilDestroyed(this)).subscribe((response: any) => {

        if (response.ResponseText === 'success') {
          this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Non trackable stock transfered to outlet  successfully.');
          const products = this.ProductData.find(x => x.ProductVariantID === this.selectedProduct.value);
          this.GetNonTrackableProducts(products.ProductID, this.selectedProduct.value);
          this.IsSpinner = false;
        }
        else {
          this.IsSpinner = false;
          console.log('internal serve Error', response);
        }
      });
  }

  NonTrackableCheckboxChange(event: any, isChange: boolean) {
    if (event.productChecked) {
      if (event.NonTrackableProductsLocationID === -1) {
        this.selected = this.selectedNonTrackables.filter(x =>
          x.ProductID === event.ProductID && x.ProductVariantID === event.ProductVariantID);
      }
      else {
        this.selected = this.selectedNonTrackables.filter(x => x.ID === event.NonTrackableProductsLocationID);
      }
      event.NonTrackableProductsLocationID = (event.NonTrackableProductsLocationID === -1) ? 0 : event.NonTrackableProductsLocationID;
      if (this.selected.length > 0) {
        let index;
        if (event.NonTrackableProductsLocationID === 0) {
          index = this.selectedNonTrackables.filter(x => x.ProductID === event.ProductID && x.ProductVariantID === event.ProductVariantID);
        }
        else {
          index = this.selectedNonTrackables.filter(x => x.ID === event.NonTrackableProductsLocationID);
        }
        this.selectedNonTrackables.splice(index, 1);
      }
      event.NonTrackableProductsLocationID = (event.NonTrackableProductsLocationID === -1) ? 0 : event.NonTrackableProductsLocationID;
      if (isChange) {
        const product = {
          NonTrackableProductsLocationID: event.NonTrackableProductsLocationID,
          Quantity: event.Quantity,
          ProductID: event.ProductID,
          ProductVariantID: event.ProductVariantID
        };
        this.selectedNonTrackables.push(product);
      }
      else {
        const product = {
          NonTrackableProductsLocationID: event.NonTrackableProductsLocationID,
          Quantity: event.Quantity,
          ProductID: event.ProductID,
          ProductVariantID: event.ProductVariantID
        };
        this.selectedNonTrackables.push(product);
      }
      this.nontrackablequantity(true);
      this.disabled = false;
    }
    else {
      if (isChange) {
        return;
      }
      else {
        // event.SelectedQuantity = 0;
        if (this.selectedNonTrackables.length > 0) {
          event.NonTrackableProductsLocationID = (event.NonTrackableProductsLocationID === -1) ? 0 : event.NonTrackableProductsLocationID;

          let index;
          if (event.NonTrackableProductsLocationID === 0) {
            index = this.selectedNonTrackables.findIndex(x =>
              x.ProductID === event.ProductID && x.ProductVariantID === event.ProductVariantID);
          }
          else {
            index = this.selectedNonTrackables.findIndex(x => x.NonTrackableProductsLocationID === event.NonTrackableProductsLocationID);
          }

          this.selectedNonTrackables.splice(index, 1);
          this.nontrackablequantity(false);
          event.NonTrackableProductsLocationID = (event.NonTrackableProductsLocationID === -1) ? 0 : event.NonTrackableProductsLocationID;

        }

      }
      this.disabled = true;
    }

  }
  nontrackablequantity(bool) {
    this.quantity = 0;
    this.selectedNonTrackables.forEach(element => {
      this.quantity += +element.SelectedQuantity ? +element.SelectedQuantity : +element.Quantity;
    });
  }

  TrackableCheckboxChange(trackable: any, event: any) {
    if (event.checked) {
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
          OutletID: Number(this.selectedOutletID),
          StockHistoryID: trackable.StockHistoryID
        };
        this.selectedTrackables.push(trackableProduct);
      }

      if (isNaN(this.quantity)) {
        this.quantity = 0;
      }
      this.quantity = this.quantity + 1;
    } else {
      const trackables = this.selectedTrackables.filter(x => x.StockHistoryID === trackable.StockHistoryID).shift();
      if (trackables != null) {
        const trackableList = trackables.AllTrackableOutletAssignmentItemDetailList;
        if (trackableList != null) {
          if (trackableList.length > 0) {
            const trackableID = trackableList.findIndex(x => x.TrackableForShoppingID === trackable.TrackableForShoppingID);
            if (trackableID != null) {
              trackableList.splice(trackableID, 1);

              if (trackableList.length === 0) {
                const trackableIndex = this.selectedTrackables.filter(x => x.StockHistoryID === trackable.stockHistoryID).shift();
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

  onChangeProductQuantity(NonTrackable, event) {
    // this.quantity = 0;
    this.selectedNonTrackables.forEach(element => {
      if (element.NonTrackableProductsLocationID === NonTrackable.NonTrackableProductsLocationID) {
        element.SelectedQuantity = +event;
      }
    });
    this.nontrackablequantity(true);
  }
}
