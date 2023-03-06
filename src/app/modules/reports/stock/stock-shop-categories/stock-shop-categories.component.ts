import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, SelectItem, MenuItem } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';

import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { AddwishlistDialogComponent } from 'src/app/EntryComponents/addwishlist-dialog/addwishlist-dialog.component';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-stock-shop-categories',
  templateUrl: './stock-shop-categories.component.html',
  styleUrls: ['./stock-shop-categories.component.scss']
})
export class StockShopCategoriesComponent implements OnInit, OnDestroy {
  @ViewChild('wishList') wishList: AddwishlistDialogComponent;
  dateForDD: any;
  selectedDated: 7;
  totalRecords = 0;
  rows = 25;
  first = 0;
  loading = false;
  items: MenuItem[];

  AllStockList: any[] = [];
  selectedStock;
  ShopCategoryDropdown: SelectItem[];
  filteredShopCategories: any[];
  selectedShopCategoryID = '';
  selectedShop: any;
  IsSpinner = false;
  imageBasePath;
  imgSrc = '';
  displayImage = false;
  selectedVariantIDforWishlist: number;
  selectedProductNameforWishlist: string;
  isAddToWishlist = false;


  genericMenuItems: GenericMenuItems[] = [
     { label: 'Wishlist', icon: 'fas fa-shopping-cart', dependedProperty: 'ID' }
  ];
  columns: Columns[] = [
    { field: 'ProductImage', header: 'Product', sorting: '', placeholder: '', type: TableColumnEnum.MULTIPLEIMAGES,translateCol: 'SSGENERIC.PRODUCT' },
    { field: 'ID', header: 'SKU', sorting: 'ID', placeholder: '' },
    { field: 'Product', header: 'Name', sorting: 'Product', placeholder: '' },
    { field: 'BLabel', header: 'Model', sorting: 'BLabel', placeholder: '' },
    { field: 'Barcode', header: 'EAN', sorting: 'Barcode', placeholder: '' },
    { field: 'RemainingStock', header: 'Availible Stock', sorting: 'RemainingStock', placeholder: '' }
  ];

  globalFilterFields = ['Product', 'BLabel', 'ID', 'Barcode', 'RemainingStock'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  dataFunc: any = customSearchFn;
  usermodel: any;

  constructor(private apiService: vaplongapi, private storageService: StorageService,private notificationService: NotificationService) {
    this.imageBasePath = this.apiService.imageBasePath;
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Stock Report Shop-Category Wise`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnInit(): void {
    this.GetShopCategoryDropDownList();
  }

  ngOnDestroy(): void {
  }
  emitAction(event) {
    this.AddToWishlist(event.selectedRowData.ID, event.selectedRowData.Product);
  }
  GetShopCategoryDropDownList() {

    this.ShopCategoryDropdown = [];
    this.apiService.GetShopCategoryForDropdown().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.selectedShopCategoryID = response.DropDownData[0].ID;
        for (const item of response.DropDownData) {
          this.ShopCategoryDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
        this.filteredShopCategories = this.ShopCategoryDropdown;
        // this.getProductStockByShopCategoryID(this.selectedShopCategoryID);
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
        // console.log('internal serve Error', response);
      }

    }
    );
  }
  SearchByShopCategory(event: any) {
    if (event) {
      this.getProductStockByShopCategoryID(event.value);
    }
  }
  getProductStockByShopCategoryID(id: any) {

    const param = { ID: id };
    this.IsSpinner = true;

    this.apiService.GetAllStockByShopCategoryID(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllStockList = response.AllProductVariantList;
        this.totalRecords = response.AllProductVariantList.length;
        this.IsSpinner = false;
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
        // console.log('internal server error ! not getting api data');
      }
    },
    );
  }

  AddToWishlist(ProductVariantID: number, Product: string) {
    this.selectedVariantIDforWishlist = ProductVariantID;
    this.selectedProductNameforWishlist = Product;
    this.isAddToWishlist = true;
  }
  CloseDialog(newValue: any) {
    this.isAddToWishlist = false;
    this.selectedVariantIDforWishlist = 0;
    this.selectedProductNameforWishlist = '';
    // console.log(newValue.IsDone);
    this.wishList.clearData();
  }
  close() {
    this.selectedVariantIDforWishlist = -1;
    this.selectedProductNameforWishlist = '';
    this.wishList.clearData();
  }

  popUpImageFuction(imgSrc) {
    this.imgSrc = imgSrc;
    this.displayImage = true;
  }

  search(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (const item of this.ShopCategoryDropdown) {
      const shopCategory = item;
      if (shopCategory.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(shopCategory);
      }
    }

    this.filteredShopCategories = filtered;

  }

}

