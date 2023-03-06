import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';


import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { ShipmentDocuments, ShipmentModel } from './../../../../Helper/models/ShipmentModel';
import { Router } from '@angular/router';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { DatePipe } from '@angular/common';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { FormBuilder } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ShippingMethodModel } from 'src/app/Helper/models/ShippingMethodModel';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { StorageService } from 'src/app/shared/services/storage.service';
import { isNullOrUndefined } from 'util';
import { IImageModel } from 'src/app/Helper/models/ImageModel';
import { randomNumber } from 'src/app/Helper/randomNumber';


@Component({
  selector: 'app-add-shipping-transfer',
  templateUrl: './add-shipping-transfer.component.html',
  styleUrls: ['./add-shipping-transfer.component.scss'],
  providers: [DatePipe]
})


export class AddShippingTransferComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  IsSpinner = false;
  loading: boolean;
  first = 0;
  rows = 25;
  totalRecords = 0;
  dataFunc: any = customSearchFn;
  productsColumn: Columns[] = [
    { field: 'ID', header: 'SKU', sorting: 'ID', placeholder: '' },
    { field: 'Image', header: 'Image', sorting: '', placeholder: '', isImage: true, type: TableColumnEnum.IMAGE },
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '' },
    { field: 'BLabel', header: 'Model', sorting: 'BLabel', placeholder: '' },
    { field: 'Barcode', header: 'EAN', sorting: 'Barcode', placeholder: '' },
    { field: 'PurchasePrice', header: 'PurchasePrice', sorting: 'PurchasePrice', placeholder: '' },
  ];

  outLetColumns: Columns[] = [
    { field: 'Name', header: 'Outlet', sorting: 'Name', placeholder: '' },
    { field: 'EmailAddress', header: 'Email', sorting: 'EmailAddress', placeholder: '' },
    { field: 'PhoneNo', header: 'Phone No', sorting: 'PhoneNo', placeholder: '' },
    { field: 'Address', header: 'Address', sorting: 'Address', placeholder: '' },
  ];
  documentsColumns: Columns[] = [
    { field: 'sDocument', header: 'File Name', sorting: 'sDocument', placeholder: '' },
  ];

  globalFilterFields = ['Product', 'Quantity', 'ReceivedQuantity'];
  documentGlobalFilterFields = ['sDocument'];
  OutletGlobalFilterFields = ['Name'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];

  selectedshipping: any = {};
  ShipmentDetails: any[] = [];
  ToOutLetData: any = {};
  FromOutLetData: any = {};
  ShipmentDocuments: [ShipmentDocuments];
  IsDocumentDialog = false;

  NewReceivedQuantity = 0;
  totalQuantity = 0;
  mySearch: any;
  // ToDate = new Date().toISOString();
  ShippingDate: Date;
  OutletData: any[] = [];
  OutletDropDown: any[] = [];
  OutletFilteredOrderBy: any[] = [];
  addShipping = {
    OutletID: null,
    ToOutletID: null,
    dtDate: new Date(),
    TrackingCode: null,
    TrackingWebsite: null,
    ShippingMethodID: null,
    sRemarks: null,
    deliveryMethod: null,
    documents: null,
    details: [],
  };
  totalData = {
    totalQuantity: 0,
    totalRMB: 0,
    totalDollar: 0,
    totalEuro: 0
  };
  outLetFromContact: any;
  outLetFromAddress: any;
  IsOpenFromOutLetDialog = false;
  outLetToContact: any;
  outLetToAddress: any;
  IsOpenToOutLetDialog = false;
  CurrencyData = [
    { id: 1, currency: 'RMD' },
    { id: 2, currency: 'Dollar' },
    { id: 3, currency: 'Euro' },
  ];
  abc: any;
  ProductDropdown: any[] = [];
  ProductData: any[] = [];
  filteredProduct: any[] = [];
  productInfo: any[] = [];
  isAdded = false;
  selectedRow: any;
  detailsID = 0;
  products: any[] = [];
  rowIndex = 0;
  @ViewChild('focus') focus: NgSelectComponent;
  IsOpenProductDialog = false;
  items: MenuItem[];
  displayDeliveryMethod = false;
  filteredDeliveryMethod: any[] = [];
  deliveryMethodDropdown: any[] = [];
  AllDeliverMethodList: ShippingMethodModel[];
  shipmentCost = 0;
  selectedDeliveryMethod: { value: any; label: any; };
  IsOpenMultiProductDialog = false;
  uploadedFiles: any[] = [];
  OutLetFrom: { value: any; label: any; };
  ToOutLet: { value: any; label: any; };
  TrackingCode: any;
  TrackingWebsite: any;
  usermodel: UserModel;
  base64textString: IImageModel[] = [];

  isCaptchaDisplayed = false;
  isCapchaValidated = false;
  firstNumber=0;
  secondNumber=0;
  ActionType=1;

  constructor(
    private apiService: vaplongapi, private notificationService: NotificationService,
    private datepipe: DatePipe, private storageService: StorageService, public router: Router
  ) {
    this.usermodel = this.storageService.getItem('UserModel');

  }

  ngOnInit(): void {
    this.ShippingDate = new Date();
    this.GetProductDropDownList();
    this.GetDeliveryMethodDropDownList();
    this.GetOutlet();
    this.productInfo.push({ ProductID: 0, ProductVariantID: 0, selectedProduct: null, currency: 1, Quantity: 0, Price: 0, });
    this.selectedRow = this.products;
    this.items = [
      { label: 'Add', icon: 'pi pi-plus', command: () => this.AddProductToList() },
    ];
  }

  GetDeliveryMethodDropDownList() {
    this.IsSpinner = true;
    this.deliveryMethodDropdown = [];

    this.apiService.GetAllDeliveryMethod().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllDeliverMethodList = response.AllShippingMethodsList.filter(x => x.IsActive !== false);
        for (const item of this.AllDeliverMethodList) {
          this.deliveryMethodDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
        this.filteredDeliveryMethod = this.deliveryMethodDropdown;
        this.IsSpinner = false;
      } else {
        this.IsSpinner = false;
        console.log('internal serve Error', response);
      }
    });
  }
  onUpload(event, form) {
    if (this.base64textString.length > 0) {
      form.clear();
      this.base64textString = [];
    }
    for (const file of event.files) {
      if (file) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        const self = this;
        // tslint:disable-next-line: only-arrow-functions
        reader.onload = function (e) {
          self.base64textString.push({ Base64String: reader.result.toString(), Extention: file.type.split('/')[1] });
        };
      }

    }
  }
  searchDeliveryMethod(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (const item of this.deliveryMethodDropdown) {
      const deliveryMethod = item;
      if (
        deliveryMethod.label.toLowerCase().indexOf(query.toLowerCase()) === 0
      ) {
        filtered.push(deliveryMethod);
      }
    }
    this.filteredDeliveryMethod = filtered;
  }

  BindShipmentCost(event: any) {
    const deliveryMethod = this.AllDeliverMethodList.find(
      (x) => x.ID === event.value
    );
    this.shipmentCost = deliveryMethod.Cost;
  }

  GetOutlet() {
    this.apiService.GetAllOutlet().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.OutletData = [...response.AllOutletList.filter(x => x.IsActive !== false)];
        for (const item of this.OutletData) {
          item.Address = item.Address + ', ' + item.City;
          this.OutletDropDown.push({
            value: item.ID,
            label: item.Name,
          });
        }
        this.OutletFilteredOrderBy = this.OutletDropDown;
      }
    });
  }

  GetProductDropDownList() {
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
      }
      else {
        console.log('internal serve Error', response);
      }

    });
  }

  searchOutLetOrderBy(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (const item of this.OutletDropDown) {
      const orderBy = item;
      if (orderBy.label != null) {
        if (orderBy.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
          filtered.push(orderBy);
        }
      }
    }
    this.OutletFilteredOrderBy = filtered;
  }

  BindOutLetFrom(event: any) {
    this.BindFromOutLetByDetails(event.value);
    this.BindOutLetTo(event);
  }

  BindFromOutLetByDetails(orderByID: any) {
    const outlet = this.OutletData.filter(x => x.ID === orderByID).shift();
    this.OutLetFrom = { value: outlet.ID, label: outlet.Name };
    this.outLetFromContact = outlet.PhoneNo;
    this.outLetFromAddress = outlet.Address;
  }

  BindOutLetTo(event: any) {
    this.BindToOutLetByDetails(event.value);
  }

  BindToOutLetByDetails(orderByID: any) {
    const outlet = this.OutletData.filter(x => x.ID === orderByID).shift();
    this.ToOutLet = { value: outlet.ID, label: outlet.Name };
    this.outLetToContact = outlet.PhoneNo;
    this.outLetToAddress = outlet.Address;
  }

  OpenFromOutLetDialog() {
    this.IsOpenFromOutLetDialog = true;
  }

  OpenToOutLetDialog() {
    this.IsOpenToOutLetDialog = true;
  }

  SelectFromOuletOrderBy(orderBy: any) {
    this.IsOpenFromOutLetDialog = false;
    this.OutLetFrom = { value: orderBy.ID, label: orderBy.Name };
    // this.addShipping.toOutLet = { value: orderBy.ID, label: orderBy.Name };
    this.BindFromOutLetByDetails(this.OutLetFrom.value);
    this.SelectToOuletOrderBy(orderBy);
  }

  SelectToOuletOrderBy(orderBy: any) {
    this.IsOpenToOutLetDialog = false;
    this.ToOutLet = { value: orderBy.ID, label: orderBy.Name };
    this.BindToOutLetByDetails(this.ToOutLet.value);
  }

  GetShipmentTransfersDetailsById(id) {
    const obj = {
      ID: id
    };
    this.apiService.GetShipmentTransfersDetailsById(obj).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.selectedshipping = response.ShipmentModel;
        this.ShippingDate = new Date(this.datepipe.transform(this.ShippingDate, 'MM-dd-yyyy')),

          this.ShipmentDetails = [...this.selectedshipping.ShipmentDetails];
        this.ShipmentDetails.forEach(element => {
          this.totalQuantity += element.Quantity;
          element.ReceivedQuantity = element.ReceivedQuantity > 0 ? element.ReceivedQuantity : element.Quantity;
          this.NewReceivedQuantity += element.ReceivedQuantity > 0 ? element.ReceivedQuantity : element.Quantity;
        });
        this.ShipmentDocuments = this.selectedshipping.ShipmentDocuments;
        this.GetOutLetFromById(this.selectedshipping.OutletID);
        this.GetOutLetToById(this.selectedshipping.ToOutletID);
      }
    });
  }

  GetOutLetFromById(OutletID) {
    const outLetFrom = {
      ID: OutletID
    };
    this.apiService.GetOutLetById(outLetFrom).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.FromOutLetData = response.OutletModel;
      }
    });
  }

  GetOutLetToById(ToOutletID) {
    const toOutLet = {
      ID: ToOutletID
    };
    this.apiService.GetOutLetById(toOutLet).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.ToOutLetData = response.OutletModel;
      }
    });
  }

  ngOnDestroy(): void {

  }

  viewDocuments() {
    this.IsDocumentDialog = true;
  }

  selectValue(newValue: any) {
    window.open(`http://85.214.36.134:1947/Content/ShipmentDocuments/${newValue.sDocument}`, '_blank');
  }

  validateFields() {
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.OutLetFrom.value)) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please provide from');
      return false;
    }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.ToOutLet.value)) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please provide to');
      return false;
    }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.selectedDeliveryMethod)) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please provide shipment method');
      return false;
    }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.ShippingDate)) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please provide shipment date');
      return false;
    }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.TrackingWebsite) || this.TrackingWebsite === '') {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please provide tracking website');
      return false;
    }
    // tslint:disable-next-line: deprecation
    if (isNullOrUndefined(this.TrackingCode) || this.TrackingCode === '') {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please provide tracking code');
      return false;
    }

    if (this.products.length === 0) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please add products to cart');
      return false;
    }

    return true;
  }


  
ValidateCaptcha(newValue: any) {
  this.isCaptchaDisplayed = false;
  // console.log(newValue.IsDone);
  this.isCapchaValidated = newValue.IsDone;
  if(this.isCapchaValidated)
  {
if(this.ActionType==1)
    this.Save();
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



  Save() {

    if (!this.validateFields()) {
      return;
    }

    
 if(!this.isCapchaValidated)
 {
   this.openCaptcha();
this.ActionType =1;
   return;
} 

    const model = {
      ID: 0,
      CreatedByUserID: this.usermodel.ID,
      dtDate: new Date(this.ShippingDate),
      IsActive: true,
      IsReceived: false,
      OutletID: this.OutLetFrom.value,
      ReceivedDate: new Date(this.ShippingDate),
      ShippingMethodID: this.selectedDeliveryMethod.value,
      sRemarks: this.addShipping.sRemarks,
      ToOutletID: this.ToOutLet.value,
      TrackingCode: this.TrackingCode,
      TrackingWebsite: this.TrackingWebsite,
      ShipmentDocuments: [],
      ShipmentDetails: [],
      Attachments :this.base64textString
    };

    this.products.forEach(x => {
      const obj = {
        ID: 0,
        ArticalNo: '',
        CurrencyID: x.currency,
        IsTrackable: false,
        Price: x.Price,
        Product: '',
        ProductID: x.ProductID,
        ProductModel: '',
        ProductVariant: '',
        ProductVariantID: x.ProductVariantID,
        Quantity: x.Quantity,
        ReceivedQuantity: 0,
        ShipmentID: 0,
      };
      model.ShipmentDetails.push(obj);
    });
    this.apiService.AddShipment(model).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.router.navigate(['/orders/shipping-transfer']);
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.message);
      }
    }, (err: any) => {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', err.message);
    });


    // this.addShipping.details = this.products;
    // this.addShipping.documents = this.uploadedFiles;
  }

  addMultipleProduct(event) {
    event.forEach((element, index) => {
      const params = { ID: element.ProductID };
      //this.apiService.GetProductByProductID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
        this.apiService.GetProductByID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          const prod: any = {};
          prod.Quantity = 1;
          prod.ProductID = element.ProductID;
          prod.ProductVariantID = element.ID;
          prod.Price = response.ProductModel.PurchasePrice;
          prod.SalePrice = response.ProductModel.SalePrice;
          prod.ShopSalePrice = response.ProductModel.ShopSalePrice;
          prod.currency = 1;
          prod.Name = response.ProductModel.Name;
          prod.selectedProduct = {
            label: response.ProductModel.Name,
            value: element.ID
          };
          prod.TrackableCodes = [];
          this.OnChangeText(prod);
          this.products.push(prod);
        }
        else {
          console.log('internal server error ! fillFields ');
        }
      },
        error => {
          console.log('internal server error ! fillFields');
        }
      );
    });
    this.IsOpenMultiProductDialog = false;
  }

  AddProductToList() {
    if (!this.productInfo[0].selectedProduct) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please Select Product');
      return;
    }
    if ((this.productInfo[0].currency === 0) || this.productInfo[0].currency <= 0) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please select currency');
      return;
    }
    if ((this.productInfo[0].Quantity === 0) || this.productInfo[0].Quantity <= 0) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please enter quantity');
      return;
    }
    this.isAdded = true;
    this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'Added To List');
    this.AddNewRow();
    this.CalculateCartTotals();
  }

  AddNewRow(isValidate = false, rowIndex = null) {
    const prod = this.products[rowIndex === null ? this.rowIndex : rowIndex];
    if (isValidate && (prod.Quantity === 0 || prod.selectedProduct === null)) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Product,Quantity is required');
      return;
    }
    const ahs = JSON.parse(JSON.stringify(this.productInfo[0]));
    this.products.push(ahs);
    this.productInfo[0] = { ProductID: 0, ProductVariantID: 0, selectedProduct: null, currency: 1, Quantity: 0, Price: 0, };
    setTimeout(() => {

      this.focus.focus();
    }, 0);
  }

  OpenProductDialog(product: any, index: number = null) {
    if (index != null) {
      this.rowIndex = index;
    } else {
      this.rowIndex = null;
    }
    this.IsOpenProductDialog = true;
  }

  productSelectValue(newValue: any) {
    this.IsOpenProductDialog = false;
    this.CheckProductTrackability(newValue.ID, this.rowIndex === null ? null : this.products[this.rowIndex]);
  }

  BindProductDetails(event: any, product: any) {
    this.CheckProductTrackability(event.value, product);
  }

  CheckProductTrackability(productVariantID: number, product: any = null) {
    const productID = this.ProductData.filter(x => x.ID === productVariantID)[0].ProductID;
    const params = { ID: productID };
    //this.apiService.GetProductByProductID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.apiService.GetProductByID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.setValueToRow(response, productID, productVariantID, product != null ? product : this.productInfo[0]);
      }
      else {
        console.log('internal server error ! fillFields ');
      }
    },
      error => {
        console.log('internal server error ! fillFields');
      }
    );
  }

  setValueToRow(response: any, productID: any, productVariantID: any, productInfo) {
    productInfo.ProductID = productID;
    productInfo.ProductVariantID = productVariantID;
    productInfo.Quantity = 1;
    productInfo.Price = response.ProductModel.PurchasePrice;
    productInfo.SalePrice = response.ProductModel.SalePrice;
    productInfo.ShopSalePrice = response.ProductModel.ShopSalePrice;
    productInfo.Name = response.ProductModel.Name;
    productInfo.selectedProduct = {
      label: response.ProductModel.Name,
      value: productVariantID
    };
  }
  deleteItemFromProductArr(rowIndex) {
    this.products.splice(rowIndex, 1);
    this.CalculateCartTotals();
  }
  OnChangeText(product: any) {
    if (product.Quantity <= 0) {
      product.Quantity = 1;
    }
    const total = (product.Quantity * product.Price);
    product.NetPrice = total.toFixed(2);
    if (this.products.length > 0) {
      this.CalculateCartTotals();
    }
  }

  CalculateCartTotals() {
    this.totalData.totalQuantity = 0;
    this.totalData.totalRMB = 0;
    this.totalData.totalDollar = 0;
    this.totalData.totalEuro = 0;
    for (const item of this.products) {
      const row = item;

      this.totalData.totalQuantity += row.Quantity;
      if (row.NetPrice == undefined) {
        row.NetPrice = +row.Price * +row.Quantity;
      }
      if (row.currency === 1) {
        this.totalData.totalRMB += +row.NetPrice;
      }
      if (row.currency === 2) {
        this.totalData.totalDollar += +row.NetPrice;
      }
      if (row.currency === 3) {
        this.totalData.totalEuro += +row.NetPrice;
      }
    }
  }
  changePrice(product) {
    const price = product.Price * 1.2;
    product.SalePrice = price.toFixed(2);
    product.ShopSalePrice = price.toFixed(2);
  }
  OpenDeliveryMethodDialog() {
    this.displayDeliveryMethod = true;
  }
  // emit event of delivery method popup
  onDeliveryMethodSelectValue(newValue: any) {
    this.displayDeliveryMethod = false;
    this.selectedDeliveryMethod = {
      value: newValue.selectedDeliveryMethod.ID,
      label: newValue.selectedDeliveryMethod.Name,
    };
    const deliveryMethod = this.AllDeliverMethodList.find(
      (x) => x.ID === newValue.selectedDeliveryMethod.ID
    );
    this.shipmentCost = deliveryMethod.Cost;
    this.CalculateCartTotals();
  }
}

