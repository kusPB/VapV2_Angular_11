import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TrackableCodeDetailModel } from 'src/app/Helper/models/TrackableCodeDetailModel';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { Columns } from 'src/app/shared/Model/columns.model';
import { PurchaseModel } from 'src/app/Helper/models/PurchaseModel';

import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { PurchasePermissionEnum } from 'src/app/shared/constant/purchase-permission';
import { NgSelectComponent } from '@ng-select/ng-select';
import { StorageService } from 'src/app/shared/services/storage.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { SalesPermissionEnum } from 'src/app/shared/constant/sales-permission';
import { randomNumber } from 'src/app/Helper/randomNumber';

@Component({
  selector: 'app-add-back-order',
  templateUrl: './add-back-order.component.html',
  styleUrls: ['./add-back-order.component.scss'],
  providers: [DatePipe]

})
export class AddBackOrderComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  PurchasePermission = PurchasePermissionEnum;

  IsDisplayed = false;

  selectedOrderBy: any;
  filteredOrderBy: any[];
  orderByDropdown: any[];
  IsSpinner = false;
  AllSupplierList: any[] = [];
  totalRecords = 0;
  displayOrderByDialog = false;
  deliverDate: Date = new Date();
  addPurchase = {
    supplier: null,
    receiptDate: new Date(),
    orderDate: new Date(),
    type: 'Cash',
    remarks: '',
    outlet: null,
    payment: 0,
    password: ''
  };

  @ViewChild('takeInput', { static: false }) InputVar: ElementRef;
  columns: Columns[] = [

    { field: 'FullName', header: 'Supplier', sorting: 'FullName', placeholder: '', },
    { field: 'sCompanyName', header: 'Company', sorting: 'sCompanyName', placeholder: '' },
    { field: 'Address', header: 'Address', sorting: 'Address', placeholder: '', },
    { field: 'Phone', header: 'Phone', sorting: 'Phone', placeholder: '', },
    { field: 'CurrentBalance', header: 'CurrentBalance', sorting: 'CurrentBalance',permission:PurchasePermissionEnum.CurrentBalanceColumninBackOrderCreate, placeholder: '', },
  ];
  trackableColumns: Columns[] = [

    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '', },
    { field: 'TrackableCode', header: 'TrackableCode', sorting: 'TrackableCode', placeholder: '' },
    { field: '', header: 'Action', sorting: '', placeholder: '', },
  ];

  // productColumns: Columns[] = [

  //   // { field: 'Action', header: 'Action', sorting: 'Action', placeholder: '', },
  //   { field: 'Product', header: 'Product', sorting: 'sCompanyName', placeholder: '' },
  //   { field: 'Address', header: 'Address', sorting: 'Address', placeholder: '', },
  //   { field: 'Phone', header: 'Phone', sorting: 'Phone', placeholder: '', },
  //   { field: 'CurrentBalance', header: 'CurrentBalance', sorting: 'CurrentBalance', placeholder: '', },
  // ];
  globalFilterFields = ['Supplier'];
  // globalProductFilterFields = '['Product']'
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  creditlimit: any;
  orderByContact: any;
  deliverToContact: any;
  supplierEmail: any;
  supplierAddress: any;
  OutletData: any[];
  outlet: any = {};
  ProductDropdown: any[] = [];
  filteredProduct: any[];
  rowIndex = 0;
  products: any[] = [];
  isTrackable: boolean;
  selectedRow: any;
  selectedProduct: any = {};
  AllProductTracablesList: TrackableCodeDetailModel[];
  productTracablesList: TrackableCodeDetailModel[];
  trackablePopupHeading: string;
  usermodel: UserModel;
  displayProductTrackables = false;
  isAdded = false;
  details: any[] = [];
  trackables: any[];
  IsOpenProductDialog = false;
  displaySelectedProductTrackables = false;
  selectedProductTrackables: any[];
  latAvgPriceDetails: any;
  displayLastAvgPrice = false;
  productsColumn: Columns[] = [
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '' },
    { field: 'Color', header: 'Color', sorting: 'Color', placeholder: '' },
    { field: 'PurchasePrice', header: 'PurchasePrice', sorting: 'PurchasePrice', placeholder: '', type: TableColumnEnum.CURRENCY_SYMBOL }
  ];
  @ViewChild('focus') focus: NgSelectComponent;
  // @ViewChild('autoCompleteObject') private autoCompleteObject: AutoComplete ;
  items: MenuItem[];
  detailsID = 0;
  grandTotal: any = 0;
  subTotal: any = 0;
  totalDiscount: any = 0;
  currencySign = '';
  displayAddPaymentPopup = false;
  isPaymentButtonDisable = false;
  payment = 0;
  isLocationChangedByField: any;
  displayTrackableProduct = false;
  supplierPreviousBalance: any = 0;
  ProductData: any = [];
  productTable: any[] = [];
  IsOpenMultiProductDialog = false;
  productInfo: any = [];
  trackableIndex: any = null;
  selectedColumns: any[];
  dataFunc: any = customSearchFn;
  supplierName: string;

  isCaptchaDisplayed = false;
  isCapchaValidated = false;
  firstNumber=0;
  secondNumber=0;

  constructor(
    private apiService: vaplongapi, private notificationService: NotificationService,
    private datepipe: DatePipe, private router: Router, private storageService: StorageService) {
    this.currencySign = '€';

    this.usermodel = this.storageService.getItem('UserModel');
  //   const obj = {
  //     Action: 'Add New',
  //     Description: `Add New Back Order`,
  //     PerformedAt: new Date().toISOString(),
  //     UserID: this.usermodel.ID
  // }
  // this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
    // const request = { ID: this.usermodel.ID };
    // this.apiService.GetUserAuthorization(request).pipe(untilDestroyed(this)).subscribe(x => {
    //   console.log(x);
    // });
  }

  ngOnInit(): void {
    this.selectedColumns = this.trackableColumns;
    this.GetSuppliersDropDownLists(); // Bind customers in order by and deliver to dropdownlist
    this.GetOutlet();
    this.GetProductDropDownList();
    // this.AddNewRow();

    this.productInfo.push({
      ProductID: 0,
      ProductVariantID: 0,
      selectedProduct: null,
      Quantity: 0,
      Price: 0,
      DiscPer: 0,
      DiscVal: 0,
      NetPrice: 0,
      IsQtyDisable: false,
      IsTrackable: false,
      IsLastAvgPrice: false,
      IsSelectedTrackables: false,
      IsAddToWishList: false,
      CartDetailsID: 0,
      IsLocation: false,
      TrackableCodes: []
    });
    // this.apiService.GetProductForPurchase().subscribe(x => {
    //
    //   if (x.ResponseCode === 0) {
    //     this.productTable = x.AllProductVariantList;
    //   }
    // });
    this.selectedRow = this.products;
    this.items = [
      { label: 'Add', icon: 'pi pi-plus', command: () => this.AddProductToList() },
      { label: 'Remove', icon: 'pi pi-times', visible: this.isAdded },
    ];
  }
  ngOnDestroy(): void {
  }
  GetProductDropDownList() {
    this.IsSpinner = true;
    this.ProductDropdown = [];
    this.apiService.GetPurchaseProduct().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        response.AllProductVariantList = response.AllProductVariantList.filter(x => x.IsActive === true);
        this.ProductData = response.AllProductVariantList;
        for (const item of response.AllProductVariantList) {
          this.ProductDropdown.push({
            value: item.ID,
            label: item.Product,
          });
        }
        this.filteredProduct = this.ProductDropdown;
        // if (this.ProductDropdown.length > 0) {
        //   this.selectedProduct = this.ProductDropdown[0];
        //   this.CheckProductTrackability(this.selectedProduct.value);
        //   this.IsSpinner = false;
        // }

      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'internal serve Error');
        // console.log('internal serve Error', response);
      }

    }
    );
  }
  addMultipleProduct(event) {
    event.forEach((element, index) => {
      const params = { ID: element.ProductID };
      //this.apiService.GetProductByProductID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
        this.apiService.GetProductByID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          const prod: any = {};
          prod.ProductID = element.ProductID;
          prod.ProductVariantID = element.ID;
          prod.Quantity = 1;
          prod.Price = response.ProductModel.PurchasePrice;
          prod.SalePrice = response.ProductModel.SalePrice;
          prod.ShopSalePrice = response.ProductModel.ShopSalePrice;
          
          prod.bShowInShop = response.ProductModel.bShowInShop;
          prod.IsAddedToShop = element.IsAddedToShop;
          prod.disabledShopSalePrice = (response.ProductModel.bShowInShop && element.IsAddedToShop);
         
          prod.DiscPer = 0;
          prod.Name = response.ProductModel.Name;
          prod.selectedProduct = {
            label: response.ProductModel.Name,
            value: element.ID
          };
          // this.products[this.rowIndex].push(this.selectedProduct)
          if (response.ProductModel.IsTrackable) {
            this.isTrackable = true;
            prod.IsQtyDisable = true;
            prod.IsTrackable = true;
            prod.IsSelectedTrackables = true;
            prod.IsLocation = false;
            prod.IsAddToWishList = true;
            prod.IsLastAvgPrice = true;
          } else {
            this.isTrackable = false;
            prod.IsQtyDisable = false;
            prod.IsTrackable = false;
            prod.IsSelectedTrackables = false;
            prod.IsLocation = true;
            prod.IsAddToWishList = true;
            prod.IsLastAvgPrice = true;
          }
          prod.TrackableCodes = [];
          this.OnChangeText(prod);
          this.products.push(prod);

          // if (event.length - 1 === index) {
          //   this.AddNewRow();
          // }
        } else {
          this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'internal serve Error ! fillFields');
          // console.log('internal server error ! fillFields ');

        }
      },
        error => {
          this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'internal serve Error ! fillFields');
          // console.log('internal server error ! fillFields');
        }
      );
    });
    this.IsOpenMultiProductDialog = false;

  }
  deleteItemFromProductArr(rowIndex) {
    this.products.splice(rowIndex, 1);
  }
  change() {

  }
  GetOutlet() {
    this.apiService.GetOutletForDropdown().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.OutletData = response.DropDownData;
        this.addPurchase.outlet = {
          ID: this.usermodel.OutletID,
          Name: [...response.DropDownData].find(x => x.ID === this.usermodel.OutletID).Name
        };
      }
    });

  }
  GetSuppliersDropDownLists() {
    this.IsSpinner = true;
    this.orderByDropdown = [];
    this.apiService.GetAllSupplier().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        response.AllSupplierList = response.AllSupplierList.filter(x => x.IsActiveForSupplier === true);
        for (const item of response.AllSupplierList) {
          item.FirstName = item.FirstName != null ?
            item.FirstName : '';
          item.LastName = item.LastName != null ? item.LastName : '';
          item.FullName = item.FirstName + ' ' + item.LastName;
          this.orderByDropdown.push({
            value: item.SupplierID,
            label: item.sCompanyName,
          });
        }
        if (this.orderByDropdown.length > 0) {
          this.filteredOrderBy = this.orderByDropdown;
          this.IsSpinner = false;
        }
        this.AllSupplierList = response.AllSupplierList;
        this.totalRecords = response.AllSupplierList.length;
      } else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'internal serve Error');
        // console.log('internal serve Error', response);
      }
    });
  }
  OpenOrderByDialog() {
    this.displayOrderByDialog = true;
  }
  searchOrderBy(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (const item of this.orderByDropdown) {
      const orderBy = item;
      if (orderBy.label != null) {
        if (orderBy.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
          filtered.push(orderBy);
        }
      }
    }
    this.filteredOrderBy = filtered;
  }

  BindProductDetails(event: any, product: any) {
    const productDetail = this.ProductData.find(x => x.ID === event.value);
    this.CheckProductTrackability(productDetail.ProductID, event.value, productDetail.IsAddedToShop, product);
  }
  openFile(event) {
    const input = event.target;
    for (const item of input.files) {

      const reader = new FileReader();
      reader.onload = () => {
        // this 'text' is the content of the file
        const trackableCodes = reader.result;
        this.getTrackableFromFile(trackableCodes);
        this.InputVar.nativeElement.value = '';
      };
      reader.readAsText(item);
    }
  }
  getTrackableFromFile(trackableCodes) {
    const code = trackableCodes.split('\n');
    const code1 = trackableCodes.split('\n');
    const codesLength = [... new Set(code1)];
    if (code.length !== codesLength.length) {
      this.TrackableError();
      return;
    }
    let found = false;
    for (const item of code) {
      if (this.isTrackableExsist(item)) {
        found = true;
        break;
      }
    }
    for (let i = 0; i < code.length; i++) {
      if (!found) {
        this.addTrackable(code[i], i + 1);
      }
    }
    setTimeout(() => {
      this.focus.focus();
    }, 0);
  }
  deleteTrackable(ri) {
    const prod = this.trackableIndex != null ? this.products[this.trackableIndex] : this.productInfo[0];
    prod.TrackableCodes.splice(ri, 1);
    prod.Quantity = prod.TrackableCodes.length;
  }

  TrackableError() {
    this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'One or more trackable codes already exsist');
  }

  isTrackableExsist(code) {
    let isTrackableFound = false;
    this.products.forEach(element => {
      if (element.TrackableCodes.find(x => x.TrackableCode === code)) {
        isTrackableFound = true;
        this.TrackableError();
        return isTrackableFound;
      }
    });

    if (this.productInfo[0].TrackableCodes.find(x => x.TrackableCode === code)) {
      this.TrackableError();
      isTrackableFound = true;
    }
    if (this.trackableIndex === null && isTrackableFound) {
      this.productInfo[0].TrackableCodes = [];
    } else if (isTrackableFound) {
      // this.productInfo[0].TrackableCodes = [];
    }
    return isTrackableFound;
  }
  addTrackable(code, trackablesID, fromInput = false) {
    if (fromInput) {
      let isTrackableFound = false;
      this.products.forEach(element => {
        if (element.TrackableCodes.find(x => x.TrackableCode === code)) {
          isTrackableFound = true;
          this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'One or more trackable codes already exsist');
          return isTrackableFound;
        }
      });

      if (this.productInfo[0].TrackableCodes.find(x => x.TrackableCode === code)) {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'One or more trackable codes already exsist');
        isTrackableFound = true;
      }
      if (isTrackableFound) {
        return;
      }
    }
    if (this.isTrackableExsist(code)) {
      return;
    }
    let product;
    if (this.trackableIndex != null) {
      product = this.ProductData.find(x => x.ID === this.products[this.trackableIndex].selectedProduct.value);
    } else {
      product = this.ProductData.find(x => x.ID === this.productInfo[0].selectedProduct.value);
    }

    // let productText = document.getElementsByClassName('txtCartProduct')[selectedRowForProductTrackableSelectionID].value;

    // let productID = $('#cmbProduct').val();
    // let variantID = document.getElementsByClassName('txtCartProdVariantID')[selectedRowForProductTrackableSelectionID].value;
    // let variant = productText.split('(')[1].split(')')[0];
    const variant = '';

    // if (productText.split('(').length > 1) {
    //     variant = productText.split('(')[1].split(')')[0];
    // }

    const trackableObj = {
      TrackablesID: trackablesID,
      Product: product.Product,
      ProductVariant: product.ProducVariantName,
      TrackableCode: code,
      // ProductID: productID,
      ProductVariantID: product.ID
    };

    if (this.trackableIndex != null) {
      this.products[this.trackableIndex].TrackableCodes.push(trackableObj);
      this.products[this.trackableIndex].Quantity = this.products[this.trackableIndex].TrackableCodes.length;
    } else {
      this.productInfo[0].TrackableCodes.push(trackableObj);
      this.productInfo[0].Quantity = this.productInfo[0].TrackableCodes.length;
    }

  }
  OpenProductTrackables(index: any = null) {

    this.displayTrackableProduct = true;
    this.trackableIndex = index;
  }

  BindDeliveryAddress(event: any) {
    this.BindOrderByDetails(event.value);
  }

  BindOrderByDetails(orderByID: any) {
    const supplier = this.AllSupplierList.filter(x => x.SupplierID === orderByID).shift();
    this.supplierPreviousBalance = this.currencySign + ' ' + supplier.CurrentBalance;
    this.creditlimit = supplier.dCreditLimit;
    this.orderByContact = supplier.PhoneNo;
    this.deliverToContact = supplier.PhoneNo;
    this.supplierEmail = supplier.customerEmail;
    this.supplierAddress = supplier.Address;
    this.supplierName = supplier.FirstName + ' ' + supplier.LastName;
    // this.GetDeliveryAddress(orderByID);
    // this.selectedDeliverTo = {value:supplier.SupplierID,label:supplier.FirstName};
    // this.selectedDeliveryMethod = this.deliveryMethodDropdown[0];
    // this.selectedPaymentCondition = this.paymentConditionDropdown[0];

  }

  // emit event of order by popup
  SelectRowOrderBy(orderBy: any) {
    this.displayOrderByDialog = false;
    this.addPurchase.supplier = { value: orderBy.SupplierID, label: orderBy.sCompanyName };
    this.BindOrderByDetails(this.addPurchase.supplier.value);

  }
  changePrice(product) {
    const price = product.Price * 1.2;
    product.SalePrice = price.toFixed(2);
    product.ShopSalePrice = price.toFixed(2);
  }
  // Check Product Trackability
  CheckProductTrackability(productID: number, productVariantID: number, IsAddedToShop: boolean, product: any = null) {

    const params = { ID: productID };
    //this.apiService.GetProductByProductID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.apiService.GetProductByID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.setValueToRow(response, productID, productVariantID, IsAddedToShop, product != null ? product : this.productInfo[0]);
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'internal serve Error ! fillFields');
        // console.log('internal server error ! fillFields ');
      }
    },
      error => {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'internal serve Error ! fillFields');
        // console.log('internal server error ! fillFields');
      });
  }

  setValueToRow(response: any, productID: any, productVariantID, IsAddedToShop: boolean, productInfo) {
    productInfo.Quantity = 1;
    productInfo.ProductID = productID;
    productInfo.ProductVariantID = productVariantID;
    productInfo.Price = response.ProductModel.PurchasePrice;
    productInfo.SalePrice = response.ProductModel.SalePrice;
    productInfo.ShopSalePrice = response.ProductModel.ShopSalePrice;
    productInfo.Name = response.ProductModel.Name;
    productInfo.selectedProduct = {
      label: response.ProductModel.Name,
      value: productVariantID
    };
    // this.products[this.rowIndex].push(this.selectedProduct)
    this.OnChangeText(this.productInfo[0]);
    if (response.ProductModel.IsTrackable) {
      this.isTrackable = true;
      productInfo.IsQtyDisable = true;
      productInfo.Quantity = 0;
      productInfo.IsTrackable = true;
      productInfo.IsSelectedTrackables = true;
      productInfo.IsLocation = false;
      productInfo.IsAddToWishList = true;
      productInfo.IsLastAvgPrice = true;
    }
    else {
      this.isTrackable = false;
      productInfo.IsQtyDisable = false;
      productInfo.IsTrackable = false;
      productInfo.IsSelectedTrackables = false;
      productInfo.IsLocation = true;
      productInfo.IsAddToWishList = true;
      productInfo.IsLastAvgPrice = true;
    }
  }

  OpenProductDialog(product: any, index: number = null) {
    if (index != null) {
      this.rowIndex = index;
    } else {
      this.rowIndex = null;
    }
    this.IsOpenProductDialog = true;
  }

  // emit event on product popup
  selectValue(newValue: any) {

    this.IsOpenProductDialog = false;

    this.CheckProductTrackability(
      newValue.ProductID,
      newValue.ID,
      newValue.IsAddedToShop, 
      this.rowIndex === null ? null : this.products[this.rowIndex]);

  }
  OnChangeText(product: any) {
    if (product.IsTrackable) {
      product.Quantity = product.TrackableCodes.length;
    }
    const discValue = product.DiscPer * product.Price / 100;
    const totaldiscount = discValue * product.Quantity;
    product.DiscVal = totaldiscount.toFixed(2);
    const total = (product.Quantity * product.Price) - totaldiscount;
    product.NetPrice = total.toFixed(2);
    if (this.products.length > 0) {
      this.CalculateCartTotals();
    }
  }


  AddNewRow(isValidate = false, rowIndex = null) {

    const prod = this.products[rowIndex === null ? this.rowIndex : rowIndex];
    if (isValidate && (prod.Quantity === 0 || prod.selectedProduct === null)) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Product,Quantity is required');
      return;
    }
    const ahs = JSON.parse(JSON.stringify(this.productInfo[0]));
    this.products.push(ahs);
    this.productInfo[0] = {
      ProductID: 0,
      ProductVariantID: 0,
      selectedProduct: null,
      Quantity: 0,
      Price: 0,
      DiscPer: 0,
      DiscVal: 0,
      NetPrice: 0,
      IsQtyDisable: false,
      IsTrackable: false,
      IsLastAvgPrice: false,
      IsSelectedTrackables: false,
      IsAddToWishList: false,
      CartDetailsID: 0,
      IsLocation: false,
      TrackableCodes: []
    };
    setTimeout(() => {

      this.focus.focus();
    }, 0);
  }


  ValidateCaptcha(newValue: any) {
    this.isCaptchaDisplayed = false;
    // console.log(newValue.IsDone);
    this.isCapchaValidated = newValue.IsDone;
    if(this.isCapchaValidated)
    {
      this.savePurchase();
    }
  }

  close() {
    this.isCaptchaDisplayed = false;
    this.isCapchaValidated =  false;
  }

  openCaptcha(){
    this.firstNumber = randomNumber.generate(1);
    this.secondNumber = randomNumber.generate(1);
    this.isCaptchaDisplayed = true;

  }




  validatePurchase() {
    if (!this.addPurchase.supplier || !this.addPurchase.outlet || !this.addPurchase.receiptDate
      || !this.addPurchase.orderDate || !this.addPurchase.type) {
      return false;
    }

    return true;
  }

  async savePurchase() {
    if (!this.validatePurchase()) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Required field must be entered');
      return;
    }

    // if (this.addPurchase.type === 'Cash' && this.addPurchase.payment <= 0) {
    //   this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Add payment greater than 0');
    //   return false;
    // }
    // if (this.addPurchase.password === '' || this.addPurchase.password === null) {
    //   this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please specify password');
    //   return;
    // }
    // else {
    //   const res = await this.validatePassword(5, this.addPurchase.password);
    //   if (!res) { return; }
    // }
    // else {
    //   if (this.validatePassword(5, this.addPurchase.password)) { return; }
    // }

    if (this.products.length === 0) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please add item in purchase list');
      return;
    }
    if (this.products.filter(y => y.Quantity <= 0 || y.selectedProduct).length === 0) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Quantity should not be less or equal to 0');
      return;
    }

    
 if(!this.isCapchaValidated)
 {
   this.openCaptcha();
   return;
}

    const detailss = [];
    this.products.filter(y => y.Quantity !== 0 || y.selectedProduct != null).forEach((x, index) => {

      const detObj = {
        DetailsID: index + 1,
        Product: x.Name,
        ProductID: x.ProductID,
        ProductVariant: '',
        ProductVariantID:x.ProductVariantID,
        Quantity: x.Quantity,
        dTotalAmount: Number(x.NetPrice),
        dTotalDiscount: Number(x.DiscVal),
        TaxAmount: 0,
        SubTotal: Number(x.Price * x.Quantity),
        ProductUnitPrice: Number(x.Price),
        dTotalAmountFC: Number(x.SalePrice),
        dTotalDiscountValueFC: Number(x.ShopSalePrice),
        ID: 0,
        isReturnProductChecked: false,
        TrackableProductsPurchaseDetails: [],
      };
      if (x.IsTrackable) {
        detObj.TrackableProductsPurchaseDetails = x.TrackableCodes.map(res => {
          return {
            Product: x.Name,
            ProductVariant: '',
            TrackableCode: res.TrackableCode,
            ProductVariantID: x.selectedProduct.value,
            ID: 0,
          };
        });
      }
      detailss.push(detObj);
    });

    const obj = {
      dTotalPaidValue: this.addPurchase.payment,
      details: detailss
    };

    this.AddPurchaseApiCall(obj);

  }
  AddPurchaseApiCall(data) {
    this.IsSpinner = true;
    const grandTotal = data.details.reduce((sum, current) => sum + Number(current.dTotalAmount), 0);
    const totalDiscount = data.details.reduce((sum, current) => sum + Number(current.dTotalDiscount), 0);

    const obj = new PurchaseModel();
    obj.ID = 0,
      obj.SuppierInvoiceNo = '0',
      obj.dTotalPurchaseValue = Number(grandTotal),
      obj.dDiscountValue = Number(totalDiscount),
      obj.dTotalPaidValue = this.addPurchase.payment,
      obj.PurchaseDate = new Date(this.datepipe.transform(this.addPurchase.receiptDate, 'yyyy-MM-ddTHH:mm:ss')),
      obj.DueDate = new Date(this.datepipe.transform(this.addPurchase.orderDate, 'yyyy-MM-ddTHH:mm:ss')),
      obj.sRemarks = this.addPurchase.remarks,
      obj.CreatedByUserID = this.usermodel.ID,
      obj.SupplierID = this.addPurchase.supplier.value,
      obj.PaymentModeID = 1,
      obj.IsReceived = false,
      obj.ExchangeRateID = 1,
      obj.CurrentExchangeRate = 1.0,
      // obj.OutletID = this.addPurchase.outlet.ID,
      obj.OutletID = 1,
      obj.PurchasesDetails = data.details;
    obj.PurchaseTaxDetails = {
      ID: 0,
      PurchaseID: 0,
      dTotalTaxAmount: 0,
      IsWithHolding: false,
    };
    // let myJSON = JSON.stringify(obj);

    this.apiService.AddPurchase(obj).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Purchase Added Successfull');
        this.router.navigate(['/purchase/back-order-report']);
        // this.ngOnInit();
        // this.resetPurchase();
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
        // console.log('internal serve Error', response);
      }
    });
  }
  resetPurchase() {
    this.addPurchase = {
      supplier: null,
      receiptDate: new Date(),
      orderDate: new Date(),
      type: 'Cash',
      remarks: '',
      outlet: null,
      payment: 0,
      password: ''
    };
    this.products = [];
    this.productInfo[0] = {
      selectedProduct: null,
      Quantity: 0,
      Price: 0,
      DiscPer: 0,
      DiscVal: 0,
      NetPrice: 0,
      IsQtyDisable: false,
      IsTrackable: false,
      IsLastAvgPrice: false,
      IsSelectedTrackables: false,
      IsAddToWishList: false,
      CartDetailsID: 0,
      IsLocation: false,
      TrackableCodes: []
    };
  }
  async validatePassword(type, password) {
    if (this.usermodel.ID === 1)// Check Password
    {
      const params = {
        Password: password
      };
      const response = await this.apiService.CheckReceivedPaymentPassword(params).toPromise();
      if (response.ResponseCode !== 0) {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Wrong password entered to add payment.');
        return false;
      }
      else {
        return true;
      }
    } else {
      const params = {
        VerificationCode: password,
        Type: type,
        UserID: this.usermodel.ID,
        Amount: 0,
        UsedFor: null
      };

      const response = await this.apiService.CheckValidationCode(params).toPromise();
      if (response.ResponseCode !== 0) {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Wrong password entered to add payment.');
        return false;
      } else {
        return true;
      }
    }
  }

  // validatePassword(Type, password): any {
  //   if (this.usermodel.ID === 1)//Check Password
  //   {
  //     let params = {
  //       Password: password
  //     }
  //     this.apiService.CheckReceivedPaymentPassword(params).subscribe((response: any) => {
  //       if (response.ResponseCode != 0) {
  //         this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Wrong password entered to add payment.');
  //         return false;
  //       }
  //       else {
  //         return true;
  //       }
  //     }
  //     );

  //   }
  //   else {
  //     let params = {
  //       VerificationCode: password,
  //       Type: Type,
  //       UserID: this.usermodel.ID,
  //       Amount: 0,
  //       UsedFor: null
  //     }

  //     this.apiService.CheckValidationCode(params).subscribe((response: any) => {
  //       if (response.ResponseCode != 0) {
  //         this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Wrong password entered to add payment.');
  //         return false;
  //       }
  //       else {
  //         return true;
  //       }
  //     }
  //     );

  //   }
  // }
  // Add record to cart
  AddProductToList() {

    if (!this.productInfo[0].selectedProduct) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please Select Product');
      return;
    }
    if (this.productInfo[0].IsTrackable) {
      this.productInfo[0].Quantity = this.productInfo[0].TrackableCodes.length;
    }

    if ((this.productInfo[0].IsTrackable && this.productInfo[0].Quantity === 0) || this.productInfo[0].Quantity <= 0) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please enter quantity');
      return;
    }
    // this.detailsID++;
    // if (!this.isTrackable) {

    //   const detail = {
    //     DetailsID: this.detailsID,
    //     ProductVariantID: this.selectedRow.selectedProduct.value,
    //     TrackableProductsSaleDetails: new Array(),
    //   };

    //   this.details.push(detail);

    // }
    // else {

    //   const detail = {
    //     DetailsID: this.detailsID,
    //     ProductVariantID: this.selectedRow.selectedProduct.value,
    //     TrackableProductsSaleDetails: this.trackables,
    //     SaleDetailNonTrackableLocations: new Array()
    //   };

    //   this.details.push(detail);

    // }
    this.isAdded = true;
    this.selectedRow.CartDetailsID = this.detailsID;
    this.CalculateCartTotals();
    this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Added To List');
    this.AddNewRow();
  }

  // Calculate Cart Total
  CalculateCartTotals() {
    let totalsubtotal = 0;
    let totaldiscount = 0;
    for (const item of this.products) {
      const row = item;
      totalsubtotal = totalsubtotal + (row.Quantity * row.Price);  // calculate subtotal
      if (row.DiscVal > 0) {
        totaldiscount = totaldiscount + Number(row.DiscVal); // calculate discount
      }
    }
    const totalgrandTotal = totalsubtotal - (totaldiscount);
    this.grandTotal = totalgrandTotal.toFixed(2);
    this.subTotal = +totalsubtotal.toFixed(2);
    if (totaldiscount > 0) {
      this.totalDiscount = totaldiscount.toFixed(2);
    }
  }
  OpenAddPaymentPopup() {
    if (this.addPurchase.payment <= 0) {
      this.addPurchase.payment = this.grandTotal;
    }
    this.displayAddPaymentPopup = true;
  }
  ClosePaymentPopup() {

    this.displayAddPaymentPopup = false;
  }

  // Product autocomplete item on Change Event

}
