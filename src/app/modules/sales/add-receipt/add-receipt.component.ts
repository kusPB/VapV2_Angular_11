import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MenuItem, SelectItem, ConfirmationService } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { CustomerModel } from 'src/app/Helper/models/CustomerModel';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TrackableCodeDetailModel } from 'src/app/Helper/models/TrackableCodeDetailModel';
import { ShippingMethodModel } from 'src/app/Helper/models/ShippingMethodModel';
import { ProductPricesDetailModel } from 'src/app/Helper/models/ProductPricesDetailModel';
import { StorageService } from 'src/app/shared/services/storage.service';
import { NotificationService } from '../../shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';


@Component({
  selector: 'app-add-receipt',
  templateUrl: './add-receipt.component.html',
  styleUrls: ['./add-receipt.component.scss'],
  providers: [DatePipe, ConfirmationService]
})
export class AddReceiptComponent implements OnInit, OnDestroy {
  products: any[];
  AllProductTracablesList: TrackableCodeDetailModel[];
  productTracablesList: TrackableCodeDetailModel[];
  prodtrackables: any[];
  AllCustomersList: CustomerModel[];
  AllDeliverMethodList: ShippingMethodModel[];
  orderDate: Date = new Date();
  deliverDate: Date = new Date();
  type = 'Cash';
  usermodel: UserModel;
  orderByDropdown: SelectItem[];
  filteredOrderBy: any[];
  selectedOrderBy: any;
  deliverToDropdown: SelectItem[];
  filteredDeliverTo: any[];
  selectedDeliverTo: any;
  deliveryMethodDropdown: SelectItem[];
  filteredDeliveryMethod: any[];
  selectedDeliveryMethod: any;
  paymentConditionDropdown: SelectItem[];
  filteredPaymentCondition: any[];
  selectedPaymentCondition: any;
  deliveryAddressDropdown: SelectItem[];
  selectedDeliveryAddressID = '';
  selectedDeliveryAddress: any;
  displayOrderByDialog = false;
  displayDeliverToDialog = false;
  displayDeliveryMethod = false;
  displayPaymentCondition = false;
  displayCustomerPreviousInvoice = false;
  displayProductTrackables = false;
  displayProductLocations = false;
  IsOpenProductDialog = false;
  displaySelectedProductTrackables = false;
  displayAddToWishlist = false;
  displayLastAvgPrice = false;
  displayAddPaymentPopup = false;
  displayReview = false;
  ProductDropdown: SelectItem[];
  filteredProduct: any[];
  selectedProduct: any;
  selectedRow: any;
  customerPreviousBalance: any;
  customerEmail: any;
  currencySign: string;
  IsSpinner = false;
  loading: boolean;
  disabled = true;
  isPaymentButtonDisable = false;
  first = 0;
  rows = 25;
  totalRecords = 0;
  isAdded = false;
  isLocationChangedByField: any;
  items: MenuItem[];
  isTrackable: boolean;
  details: any[];
  trackables: any[];
  productLocations: any[];
  selectedProductTrackables: any[];
  trackablePopupHeading: string;
  latAvgPriceDetails: ProductPricesDetailModel;
  detailsID = 0;
  shipmentCost = 0;
  subTotal: any = 0;
  grandTotal: any = 0;
  totalDiscount: any = 0;
  paidPayment: any = 0;
  customerCurrentBalance: any = 0;
  payment = 0;
  password: any;
  creditlimit: any;
  orderByContact: any;
  deliverToContact: any;
  deliverToAddress: any;
  remarks: string;
  rowIndex = 0;
  invoiceNo: any;
  salePrintDetails = new Array();
  restAmount: any;
  deliverToName: string;
  OpenSaleID = 0;

  autoAssignLocationWhenProduct = true;

  constructor(
    private apiService: vaplongapi, private storageService: StorageService, private notificationService: NotificationService,
    private datepipe: DatePipe, public router: Router, private confirmationService: ConfirmationService) {

    // this.currencySign =environment.currencySign;
    this.currencySign = '€';
    this.usermodel = this.storageService.getItem('UserModel');

  }
  ngOnDestroy(): void {

  }
  ngOnInit(): void {

    this.products = [];
    this.trackables = [];
    this.details = [];
    this.AddNewRow();
    this.selectedRow = this.products;
    this.items = [
      { label: 'Add', icon: 'pi pi-plus', command: () => this.AddProductToList(this.products[this.rowIndex]) },
      { label: 'Remove', icon: 'pi pi-times', visible: this.isAdded },
    ];
    this.GetCustomersDropDownLists(); // Bind customers in order by and deliver to dropdownlist
    this.GetDeliveryMethodDropDownList(); // Bind delivery methods to dropdownlist
    this.GetPaymentConditionDropDownList(); // Bind payment conditions to dropdownlist
    this.GetProductDropDownList(); // Get product autocomplete data
  }

  //#region  Product Autocomplete

  GetProductDropDownList() {
    this.IsSpinner = true;
    this.ProductDropdown = [];
    this.apiService.GetProductDropDownDatawithVariantInfo().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        for (const item of response.DropDownData) {
          this.ProductDropdown.push({
            value: item.ProductVariantID,
            label: item.ProducVariantName,
          });
        }
        if (this.ProductDropdown.length > 0) {
          // this.selectedProduct = this.ProductDropdown[0];
          // this.CheckProductTrackability(this.selectedProduct.value);
          this.IsSpinner = false;
        }
      } else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    });
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

  //#endregion


  //#region  OrderBy and Deliver to Autocomplete

  GetCustomersDropDownLists() {
    this.IsSpinner = true;
    this.orderByDropdown = [];
    this.deliverToDropdown = [];
    this.apiService.GetAllCustomer().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        for (const item of response.AllCustomerList) {
          this.orderByDropdown.push({
            value: item.CustomerID,
            label: item.FirstName,
          });
          this.deliverToDropdown.push({
            value: item.CustomerID,
            label: item.FirstName,
          });
        }
        if (this.orderByDropdown.length > 0) {
          this.IsSpinner = false;
        }

        this.AllCustomersList = response.AllCustomerList;
        this.totalRecords = response.AllCustomerList.length;

      } else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    });
  }

  searchOrderBy(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (const item of this.orderByDropdown) {
      const orderBy = item;

      if (orderBy.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(orderBy);
      }
    }

    this.filteredOrderBy = filtered;

  }

  searchDeliverTo(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (const item of this.deliverToDropdown) {
      const deliver = item;

      if (deliver.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(deliver);
      }
    }

    this.filteredDeliverTo = filtered;

  }

  // Order By on cahnge event
  BindDeliveryAddress(event: any) {

    this.BindOrderByDetails(event.value);

  }

  BindOrderByDetails(orderByID: any) {

    const customer = this.AllCustomersList.filter(x => x.CustomerID === orderByID).shift();

    this.customerPreviousBalance = this.currencySign + ' ' + customer.CurrentBalance;
    this.creditlimit = customer.dCreditLimit;
    this.orderByContact = customer.PhoneNo;
    this.deliverToContact = customer.PhoneNo;
    this.customerEmail = customer.customerEmail;
    this.GetDeliveryAddress(orderByID);
    this.selectedDeliverTo = { value: customer.CustomerID, label: customer.FirstName };
    if (customer.FirstName === 'Retail Customer') {
      const ship = this.deliveryMethodDropdown.find(x => x.label.includes('Self'));
      this.selectedDeliveryMethod = ship;
    } else {
      const deliveryMethod = this.deliveryMethodDropdown.filter(x => x.value === customer.ShippingMethodID).shift();
      this.selectedDeliveryMethod = deliveryMethod;
    }
    this.selectedPaymentCondition = this.paymentConditionDropdown[0];
  }

  // Deliver To on change event

  BindDeliveryToDetails(event: any) {
    const customer = this.AllCustomersList.filter(x => x.CustomerID === this.selectedDeliverTo.value).shift();
    this.deliverToContact = customer.PhoneNo;
    this.deliverToAddress = customer.City === null ? customer.Address : customer.Address + ', ' + customer.City;
  }

  //#endregion

  //#region   Payment Condition Autocomplete
  GetPaymentConditionDropDownList() {
    this.IsSpinner = true;
    this.paymentConditionDropdown = [];

    this.apiService.GetAllPaymentCondition().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        for (const item of response.AllPaymentConditionList) {
          this.paymentConditionDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
        this.IsSpinner = false;
      } else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    });
  }

  searchPaymentCondition(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (const item of this.paymentConditionDropdown) {
      const paymentCondition = item;

      if (paymentCondition.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(paymentCondition);
      }
    }

    this.filteredPaymentCondition = filtered;

  }

  //#endregion

  //#region   Delivery Method Autocomplete
  GetDeliveryMethodDropDownList() {
    this.IsSpinner = true;
    this.deliveryMethodDropdown = [];

    this.apiService.GetAllDeliveryMethod().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.AllDeliverMethodList = response.AllShippingMethodsList;
        for (const item of response.AllShippingMethodsList) {
          this.deliveryMethodDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
        this.IsSpinner = false;
      } else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    });
  }

  searchDeliveryMethod(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (const item of this.deliveryMethodDropdown) {
      const deliveryMethod = item;

      if (deliveryMethod.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(deliveryMethod);
      }
    }
    this.filteredDeliveryMethod = filtered;
  }

  BindShipmentCost(event: any) {
    const deliveryMethod = this.AllDeliverMethodList.find(x => x.ID === event.value);
    this.shipmentCost = deliveryMethod.Cost;
  }

  //#endregion

  //#region  Delivery Address dropdownlist

  GetDeliveryAddress(customerId) {

    this.deliveryAddressDropdown = [];
    const id = {
      ID: customerId
    };
    this.apiService.GetCustomerbyID(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {

        this.deliveryAddressDropdown.push({
          value: response.CustomerModel.CustomerID,
          label: response.CustomerModel.City === null ? response.CustomerModel.Address :
            response.CustomerModel.Address + ', ' + response.CustomerModel.City,
        });
        if (this.deliveryAddressDropdown.length > 0) {
          this.selectedDeliveryAddress = { value: this.deliveryAddressDropdown[0].value, label: this.deliveryAddressDropdown[0].label };
          this.deliverToAddress = this.deliveryAddressDropdown[0].label;
          this.IsSpinner = false;
        }
      } else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    });
  }
  //#endregion

  //#region  Open Dialog functions

  OpenOrderByDialog() {
    this.displayOrderByDialog = true;
  }
  OpenDeliveryToDialog() {
    this.displayDeliverToDialog = true;
  }
  OpenDeliveryMethodDialog() {
    this.displayDeliveryMethod = true;
  }
  OpenPaymentConditionDialog() {
    if (!this.disabled) {
      this.displayPaymentCondition = true;
    } else {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'payment condition is disabled please change payment type.');
    }
  }
  OpenCustomerPreviousInvoiceDialog() {
    this.displayCustomerPreviousInvoice = true;
  }

  OpenProductDialog(product: any) {
    this.selectedRow = product;
    this.IsOpenProductDialog = true;
  }

  // Open Product trackables popup for cart table
  OpenProductTrackables(rowindex: any) {

    if (this.selectedProduct === null) {
      this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Please select a product.');
      return;
    }
    this.GetProductTrackablesList(this.products[rowindex].selectedProduct.value);

    this.trackablePopupHeading = this.products[rowindex].selectedProduct.label;
    this.selectedRow.selectedProduct = this.products[rowindex].selectedProduct;
  }

  // Open Product Selected Trackables Popup for cart table
  OpenSelectedProductTrackables(rowindex: any) {

    if (this.details.length > 0) {
      const selectedtrackables = this.details.filter(x => x.ProductVariantID === Number(this.selectedRow.selectedProduct.value)).shift();
      this.selectedProductTrackables = selectedtrackables.TrackableProductsSaleDetails;
    }
    else {
      this.selectedProductTrackables = this.trackables;
    }
    this.trackablePopupHeading = this.selectedRow.selectedProduct.label;
    this.rowIndex = rowindex;
    this.displaySelectedProductTrackables = true;

  }

  OpenProductLocations(rowindex: any) {
    this.displayProductLocations = true;
    this.selectedRow.selectedProduct = this.products[rowindex].selectedProduct;
    this.selectedRow.Quantity = this.products[rowindex].Quantity;
  }

  // Get Last Avarage Purchase price details for cart table
  GetLastAvaragePrice(rowindex: any) {

    const params = {
      ProductID: this.products[rowindex].selectedProduct.value,
      ProductVariantID: this.products[rowindex].selectedProduct.value,
      OutletID: this.usermodel.OutletID,
      DepartmentID: -1,
      CategoryID: -1,
      SubCategoryID: 0,
      ClassificationID: -1,
      IsAllProduct: false,
      FromDate: this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
      ToDate: this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
      PageNo: 0,
      PageSize: 100,
      IsGetAll: true,
      Search: ''
    };

    this.apiService.GetAllProductStockOverall(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {

        if (response.AllStockList.length > 0) {

          let Quantity = this.products[rowindex].Quantity;
          if (Quantity === 0) {
            Quantity = 1;
          }
          const profit = ((this.products[rowindex].Price - response.AllStockList[0].PurchasePrice.toFixed(2))
            * Quantity) - this.products[rowindex].DiscVal;
          this.SetProductPriceVariable(
            response.AllStockList[0].RemainingStock,
            response.AllStockList[0].AvgPurchasePrice.toFixed(2),
            response.AllStockList[0].PurchasePrice.toFixed(2),
            profit.toFixed(2)
          );
        } else {
          this.SetProductPriceVariable('0', '0', '0', '0');
        }
      } else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    });
    this.displayLastAvgPrice = true;
  }

  // Open Add to wishlist popup for cart table
  OpenAddToWishlistPopup(rowinex: any) {
    this.selectedRow.selectedProduct = this.products[rowinex].selectedProduct;
    this.displayAddToWishlist = true;
  }

  // OPen Payment popup to add payment and password
  OpenAddPaymentPopup() {
    this.displayAddPaymentPopup = true;
  }

  // Close Add to Wishlist popup
  CloseDialog(newValue: any) {
    this.displayAddToWishlist = false;
  }

  //#endregion

  //#region emit events

  // emit event of delivery method popup
  onDeliveryMethodSelectValue(newValue: any) {

    this.displayDeliveryMethod = false;
    this.selectedDeliveryMethod = {
      value: newValue.selectedDeliveryMethod.ID,
      label: newValue.selectedDeliveryMethod.Name
    };
    const deliveryMethod = this.AllDeliverMethodList.find(x => x.ID === newValue.selectedDeliveryMethod.ID);
    this.shipmentCost = deliveryMethod.Cost;

  }

  // emit event of payment condition popup
  onPaymentConditionSelectValue(newValue: any) {
    this.displayPaymentCondition = false;
    this.selectedPaymentCondition = { value: newValue.selectedPaymentCondition.ID, label: newValue.selectedPaymentCondition.Name };
  }

  // emit event of order by popup
  SelectRowOrderBy(orderBy: any) {
    this.displayOrderByDialog = false;
    this.selectedOrderBy = { value: orderBy.CustomerID, label: orderBy.FirstName };
    this.BindOrderByDetails(this.selectedOrderBy.value);
    this.GetDeliveryAddress(this.selectedOrderBy.value);
  }

  // emit event of deliver to  popup
  SelectRow(deliverTo: any) {
    this.displayDeliverToDialog = false;
    this.selectedDeliverTo = { value: deliverTo.CustomerID, label: deliverTo.FirstName };
    const customer = this.AllCustomersList.filter(x => x.CustomerID === this.selectedDeliverTo.value).shift();
    this.deliverToContact = customer.PhoneNo;
    this.deliverToAddress = customer.City === null ? customer.Address : customer.Address + ', ' + customer.City;
  }

  // emit event on product popup
  selectValue(newValue: any) {

    this.IsOpenProductDialog = false;
    this.CheckProductTrackability(newValue.selectedProduct.ID);
    this.selectedProduct = {
      value: newValue.selectedProduct.ID,
      label: newValue.selectedProduct.Product
    };
    this.selectedRow.selectedProduct = {
      value: newValue.selectedProduct.ID,
      label: newValue.selectedProduct.Product
    };

    // this.selectedProduct.value= newValue.selectedProduct.ID;
    // this.selectedProduct.label= newValue.selectedProduct.Name;
    if (this.isTrackable) {
      // document.getElementsByClassName('btnTrackables')[selectedRowForProductSelectionID].disabled = false;
      // document.getElementsByClassName('txtCartQuantity')[selectedRowForProductSelectionID].disabled = true;
      // document.getElementsByClassName('btnShowTrackableDetails')[selectedRowForProductSelectionID].classList.remove('display-none');
      // document.getElementsByClassName('btnProductLocation')[selectedRowForProductSelectionID].classList.add('display-none');
      // document.getElementsByClassName('txtCartQuantity')[selectedRowForProductSelectionID].value = 0;
    }
    else {
      //  document.getElementsByClassName('btnTrackables')[selectedRowForProductSelectionID].disabled = true;
      //  document.getElementsByClassName('txtCartQuantity')[selectedRowForProductSelectionID].disabled = false;
      //  document.getElementsByClassName('btnShowTrackableDetails')[selectedRowForProductSelectionID].classList.add('display-none');
      //  document.getElementsByClassName('btnProductLocation')[selectedRowForProductSelectionID].classList.remove('display-none');
      //  document.getElementsByClassName('txtCartQuantity')[selectedRowForProductSelectionID].value = 1;
    }
    this.selectedRow.Price = newValue.selectedProduct.Price;
  }

  // Emit Event on select trackables for cart table
  onTrackableSelectValue(newValue: any) {

    const saleDetailTrackable = {
      TrackableCode: newValue.trackableCode,
      ProductVariantID: this.selectedRow.selectedProduct.value
    };
    if (this.isAdded) {
      const detailsIndex = this.details.findIndex(x => x.ProductVariantID === this.selectedRow.selectedProduct.value);
      this.prodtrackables = this.details[detailsIndex].TrackableProductsSaleDetails;
      this.prodtrackables.push(saleDetailTrackable);
    } else {
      this.trackables.push(saleDetailTrackable);
    }

    this.products[this.rowIndex].Quantity = this.products[this.rowIndex].Quantity + 1;
    this.OnChangeText(this.products[this.rowIndex]);
    this.refreshSelectedProductTrackables(this.rowIndex);
    this.displayProductTrackables = false;
  }

  onRemoveSelectedTrackable(newValue: any) {

    this.details = newValue.dataAfterRemove.details;
    this.products[this.rowIndex].Quantity = this.products[this.rowIndex].Quantity - 1;
    this.OnChangeText(this.products[this.rowIndex]);
    this.refreshSelectedProductTrackables(this.rowIndex);
  }

  refreshSelectedProductTrackables(rowindex: any) {
    this.productTracablesList = [];
    let code;
    if (this.isAdded) {
      const detailsIndex = this.details.findIndex(x => x.ProductconstiantID === this.products[this.rowIndex].selectedProduct.value);
      const prodtrackables = this.details[detailsIndex].TrackableProductsSaleDetails;
      for (const item of this.AllProductTracablesList) {
        code = prodtrackables.filter(x => x.TrackableCode === item.TrackableCode).shift();
        if (!code) {
          const trackableCode = item.TrackableCode;
          this.productTracablesList.push(item);
        }
      }

    }
    else {
      for (const item of this.AllProductTracablesList) {
        code = this.trackables.filter(x => x.TrackableCode === item.TrackableCode).shift();
        if (!code) {
          const trackableCode = item.TrackableCode;
          this.productTracablesList.push(item);
        }
      }
    }
  }

  //#endregion

  // calculation on cart value change event
  OnChangeText(product: any) {
    const discValue = product.DiscPer * product.Price / 100;
    const totaldiscount = discValue * product.Quantity;
    product.DiscVal = totaldiscount.toFixed(2);
    const total = (product.Quantity * product.Price) - totaldiscount;
    product.NetPrice = total.toFixed(2);
  }

  // radio button on cange event
  onChange() {
    if (this.type === 'Credit') {
      this.disabled = false;
      this.isPaymentButtonDisable = true;
    } else {
      this.disabled = true;
      this.isPaymentButtonDisable = false;
    }
  }

  // Add record to cart
  AddProductToList(product: any) {

    if (!this.validateDetailFields(product, false)) {
      return;
    }
    this.detailsID++;
    if (!this.isTrackable) {
      const detail = {
        DetailsID: this.detailsID,
        ProductVariantID: this.selectedRow.selectedProduct.value,
        TrackableProductsSaleDetails: new Array(),
        SaleDetailNonTrackableLocations: this.productLocations
      };
      this.details.push(detail);
    } else {
      const detail = {
        DetailsID: this.detailsID,
        ProductVariantID: this.selectedRow.selectedProduct.value,
        TrackableProductsSaleDetails: this.trackables,
        SaleDetailNonTrackableLocations: new Array()
      };
      this.details.push(detail);
    }
    this.isAdded = true;
    this.selectedRow.CartDetailsID = this.detailsID;
    this.selectedRow.IsAdded = true;
    this.CalculateCartTotals();
    this.notificationService.notify(NotificationEnum.SUCCESS, 'success', 'Added To List');
    this.AddNewRow();
  }

  RemoveCartProduct(rowindex: any) {

    this.confirmationService.confirm({
      message: 'Do you want to remove the selected product from cart?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const detailsID = this.products[rowindex].CartDetailsID;
        const indexDetails = this.details.findIndex(x => x.DetailsID === detailsID);
        if (indexDetails) {
          this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Selected product is not included in the cart');
        } else {
          this.details.splice(indexDetails, 1);
          this.products.splice(rowindex, 1);
          this.CalculateCartTotals();
          this.notificationService.notify(NotificationEnum.SUCCESS, 'success', 'Product removed successfully');
        }
      }
    });
  }

  // Product autocomplete item on Change Event
  BindProductDetails(event: any, rowindex: number) {
    this.rowIndex = rowindex;
    this.CheckProductTrackability(event.value);
  }

  // Close button function
  Close() {
    this.router.navigate(['/sale/sale-index']);
  }

  //#region Save Sale Order

  AddSale(IsB: boolean) {

    if (!this.ValidateSaleSaveDetails()) {
      return;
    }

    if (!this.payment) {
      this.payment = 0;
    }

    if (this.type === 'Cash' && this.payment === 0) {
      if (!this.password) {
        this.password = '';
        this.displayAddPaymentPopup = true;
        return;
      }

    }

    if (this.usermodel.ID === 1)// Check Password
    {
      const password = {
        Password: this.password
      };
      this.apiService.CheckReceivedPaymentPassword(password).pipe(untilDestroyed(this)).subscribe((response: any) => {
        if (response.ResponseCode !== 0) {
          this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Wrong password entered to add payment.');
          return;
        }
      });
    } else {
      const param = {
        VerificationCode: this.password,
        Type: 1,
        UserID: this.usermodel.ID,
        Amount: (this.selectedOrderBy.value === '1') ? this.grandTotal : this.payment,
        UsedFor: this.selectedOrderBy.value
      };
      this.apiService.CheckValidationCode(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
        if (response.ResponseCode !== 0) {
          this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Wrong password entered to add payment.');
          return;
        }
      });
    }
    let typeId = 0;
    if (this.type === 'Cash') {
      typeId = 1;
    } else {
      typeId = 2;
    }

    let detail;
    let singleDetail;
    let detailsID;
    let productText;
    let detailsIndex;
    let isInvoiceCreated;
    let isTraceable;
    let isRefundable;
    const saleDetails = new Array();
    let product;
    let quantity;
    let unitPrice;
    let discount;
    let subtotal;
    let grandTotal;
    for (let i = 0; i < this.products.length - 1; i++) {

      detailsID = this.products[i].CartDetailsID;

      detailsIndex = this.details.findIndex(x => x.DetailsID === detailsID);
      if (!detailsIndex) {
        singleDetail = this.details[detailsIndex];
      }

      productText = this.products[i].selectedProduct.label;
      product = productText.split('(')[0];
      quantity = this.products[i].Quantity;
      unitPrice = this.products[i].Price;
      discount = this.products[i].DiscVal;

      subtotal = (quantity * unitPrice);
      grandTotal = subtotal - discount;

      detail = {
        DetailsID: singleDetail.DetailsID,
        Product: product,
        // ProductVariant: variant,
        ProductVariantID: singleDetail.ProductVariantID,

        Quantity: quantity,
        dTotalAmount: grandTotal,
        dTotalDiscount: discount,
        TaxAmount: 0,
        TaxPer: 0,
        dTotalValue: subtotal,
        dTotalUnitValue: unitPrice,
        TrackableProductsSaleDetails: singleDetail.TrackableProductsSaleDetails,
        SaleDetailNonTrackableLocations: singleDetail.SaleDetailNonTrackableLocations
      };
      saleDetails.push(detail);
    }
    if (IsB) {
      isInvoiceCreated = false;
      isTraceable = false;
      isRefundable = false;
    } else {
      isInvoiceCreated = true;
      isTraceable = true;
      isRefundable = true;
    }
    const discoutPercentage = (this.totalDiscount / this.subTotal) + this.totalDiscount;

    if (this.selectedOrderBy.value === '1') {
      this.payment = this.grandTotal;
    } else {
      const remainingAmount = this.grandTotal - this.payment;
      if ((remainingAmount + this.customerCurrentBalance) > this.creditlimit) {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Remaining amount (including current balance of selected customer) is greater than credit limit.');
        return;
      }
    }

    // Delete Sale Details if exists already
    if (this.OpenSaleID > 0) {
      this.DeleteSaleDetails();
    }

    const params = {
      CustomerID: this.selectedOrderBy.value,
      Customer: this.selectedOrderBy.label,
      DeliveredToID: this.selectedDeliverTo.value,
      DeliveredTo: this.selectedDeliverTo.label,
      DeliveryAddressID: this.selectedDeliverTo.value,
      sRemarks: this.remarks,
      dtDate: this.deliverDate,
      SaleDate: this.orderDate,
      PaymentConditionID: this.selectedPaymentCondition.value,
      ShippingMethodID: this.selectedDeliveryMethod.value,
      ShippingCost: this.shipmentCost,
      dTotalPaidValue: this.payment,
      dDiscountValueString: this.customerCurrentBalance,
      CustomerCreditLimit: this.creditlimit,
      Password: this.password,
      PaymentModeID: 1,
      isB: IsB,
      SaleDetails: saleDetails,
      IsInvoiceCreated: isInvoiceCreated,
      IsTraceable: isTraceable,
      IsRefundable: isRefundable,
      dTotalSaleValue: this.grandTotal,
      dDiscountValue: this.totalDiscount,
      dDiscountPercentage: discoutPercentage,
      CreatedByUserID: this.usermodel.ID,
      OutletID: this.usermodel.OutletID,
      CashRegisterHistoryID: Number(this.storageService.getItem('CashRegisterHistoryID')),
    };
    this.deliverToName = this.selectedDeliverTo.label;
    this.selectedDeliveryAddressID = this.deliverToAddress;
    this.apiService.SaveSaleDetails(params).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseCode === 0) {
        this.router.navigate(['/sale/add-receipt']);
        this.notificationService.notify(NotificationEnum.SUCCESS, 'success', response.message);
      }
      else if (response.ResponseCode === 99) {
        if (typeId === 1 && this.payment === 0) {
          this.payment = 0;
          this.displayAddPaymentPopup = true;
        }
      } else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.message);
      }
    });
  }

  ValidateSaleSaveDetails() {
    if (!this.selectedOrderBy) {
      this.notificationService.notify(NotificationEnum.ERROR, 'error', 'please provide order by');
      return false;
    }
    if (!this.selectedDeliverTo) {
      this.notificationService.notify(NotificationEnum.ERROR, 'error', 'please provide deliver to');
      return false;
    }
    if (!this.selectedPaymentCondition) {
      this.notificationService.notify(NotificationEnum.ERROR, 'error', 'please provide payment condition');
      return false;
    }
    if (!this.selectedDeliveryMethod) {
      this.notificationService.notify(NotificationEnum.ERROR, 'error', 'please provide delivery method');
      return false;
    }
    if (!this.selectedDeliveryAddress) {
      this.notificationService.notify(NotificationEnum.ERROR, 'error', 'please provide delivery address');
      return false;
    }
    if (this.type === 'Cash') {
      if (this.payment < 1) {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Please add payment greater than 0');
        return false;
      }
    } else {
      if (!this.selectedPaymentCondition) {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'please provide payment condition');
        return false;
      }
    }
    if (this.details === null || this.details.length === 0) {
      this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Please add products to cart');
      return false;
    }
    if (this.payment > this.grandTotal) {
      this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Entered payment is more than grand total');
      return false;
    }
    return true;
  }

  DeleteSaleDetails() {

    const params = {
      ID: this.OpenSaleID
    };

    this.apiService.DeleteOpenSale(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
      } else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.message);
      }
    });
  }
  //#endregion

  //#region Hold Sale Order
  ConfirmHold() {
    this.confirmationService.confirm({
      message: 'Do you want to temporary hold this sale?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.HoldSale();
      }
    });
  }

  HoldSale() {
    if (!this.ValidateOpenSaleSaveDetails()) {
      return;
    }

    if (!Number(this.storageService.getItem('CashRegisterHistoryID'))) {
      this.notificationService.notify(NotificationEnum.ERROR, 'error', 'No cash register is opened yet by current User.');
      return;
    }
    // Delete Sale Details if exists already
    if (this.OpenSaleID > 0) {
      this.DeleteSaleDetails();

    }

    let typeId = 0;
    if (this.type === 'Cash') {
      typeId = 1;
    }
    else {
      typeId = 2;
    }

    let detail;
    let singleDetail;
    let detailsID;
    let productText;
    let detailsIndex;

    const saleDetails = new Array();
    let product;
    let quantity;
    let unitPrice;
    let discount;
    let subtotal;
    let grandTotal;
    for (let i = 0; i < this.products.length - 1; i++) {

      detailsID = this.products[i].CartDetailsID;

      detailsIndex = this.details.findIndex(x => x.DetailsID === detailsID);
      if (!detailsIndex) {
        singleDetail = this.details[detailsIndex];
      }

      productText = this.products[i].selectedProduct.label;

      product = productText.split('(')[0];
      quantity = this.products[i].Quantity;
      unitPrice = this.products[i].Price;
      discount = this.products[i].DiscVal;

      subtotal = (quantity * unitPrice);
      grandTotal = subtotal - discount;

      detail = {
        DetailsID: singleDetail.DetailsID,
        Product: product,
        // ProductVariant: variant,
        ProductVariantID: singleDetail.ProductVariantID,

        Quantity: quantity,
        dTotalAmount: grandTotal,
        dTotalDiscount: discount,
        TaxAmount: 0,
        TaxPer: 0,
        dTotalValue: subtotal,
        dTotalUnitValue: unitPrice,
        TrackableProductsSaleDetails: singleDetail.TrackableProductsSaleDetails,
        SaleDetailNonTrackableLocations: singleDetail.SaleDetailNonTrackableLocations
      };

      saleDetails.push(detail);

    }

    const discoutPercentage = (this.totalDiscount / this.subTotal) + this.totalDiscount;

    const params = {
      CustomerID: this.selectedOrderBy.value,
      Customer: this.selectedOrderBy.label,
      DeliveredToID: this.selectedDeliverTo.value,
      DeliveredTo: this.selectedDeliverTo.label,
      DeliveryAddressID: this.selectedDeliverTo.value,
      sRemarks: this.remarks,
      dtDate: this.deliverDate,
      SaleDate: this.orderDate,
      PaymentConditionID: this.selectedPaymentCondition.value,
      ShippingMethodID: this.selectedDeliveryMethod.value,
      ShippingCost: this.shipmentCost,
      dTotalPaidValue: this.payment,
      dDiscountValueString: this.customerCurrentBalance,
      CustomerCreditLimit: this.creditlimit,
      PaymentModeID: 1,
      OpenSaleDetails: saleDetails,
      dTotalSaleValue: this.grandTotal,
      dDiscountValue: this.totalDiscount,
      dDiscountPercentage: discoutPercentage,
      CreatedByUserID: this.usermodel.ID,
      OutletID: this.usermodel.OutletID,
      CashRegisterHistoryID: Number(this.storageService.getItem('CashRegisterHistoryID')),
    };

    this.apiService.SaveOpenSaleDetails(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.router.navigate(['/sale/sale-index']);
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.message);
      } else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.message);
      }
    });
  }

  ValidateOpenSaleSaveDetails() {

    if (!this.selectedOrderBy) {
      this.notificationService.notify(NotificationEnum.ERROR, 'error', 'please provide order by');
      return false;
    }

    if (this.details === null || this.details.length === 0) {
      this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Please add products to cart');
      return false;
    }

    return true;

  }

  //#endregion

  //#region Save And Send Email

  SaveAndEmail() {
    if (!this.ValidateSaleSaveDetails()) {
      return;
    }

    if (!this.payment) {
      this.payment = 0;
    }

    if (this.type === 'Cash' && this.payment === 0) {
      if (!this.password) {
        this.password = '';
        this.displayAddPaymentPopup = true;
        return;
      }

    }

    if (this.usermodel.ID === 1)// Check Password
    {
      const passowrd = {
        Password: this.password
      };

      this.apiService.CheckReceivedPaymentPassword(passowrd).pipe(untilDestroyed(this)).subscribe((response: any) => {

        if (response.ResponseCode !== 0) {
          this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Wrong password entered to add payment.');
          return;
        }
      });
    } else {
      const param = {
        VerificationCode: this.password,
        Type: 1,
        UserID: this.usermodel.ID,
        Amount: (this.selectedOrderBy.value === '1') ? this.grandTotal : this.payment,
        UsedFor: this.selectedOrderBy.value
      };

      this.apiService.CheckValidationCode(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
        if (response.ResponseCode !== 0) {
          this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Wrong password entered to add payment.');
          return;
        }
      });
    }

    // Delete Sale Details if exists already
    if (this.OpenSaleID > 0) {
      this.DeleteSaleDetails();
    }

    let typeId = 0;
    if (this.type === 'Cash') {
      typeId = 1;
    }
    else {
      typeId = 2;
    }

    let detail;
    let singleDetail;
    let detailsID;
    let productText;
    let detailsIndex;
    let isInvoiceCreated;
    let isTraceable;
    let isRefundable;


    const saleDetails = new Array();
    let product;
    let quantity;
    let unitPrice;
    let discount;
    let subtotal;
    let grandTotal;
    for (let i = 0; i < this.products.length - 1; i++) {
      detailsID = this.products[i].CartDetailsID;
      detailsIndex = this.details.findIndex(x => x.DetailsID === detailsID);
      if (!detailsIndex) {
        singleDetail = this.details[detailsIndex];
      }

      productText = this.products[i].selectedProduct.label;

      product = productText.split('(')[0];
      quantity = this.products[i].Quantity;
      unitPrice = this.products[i].Price;
      discount = this.products[i].DiscVal;

      subtotal = (quantity * unitPrice);
      grandTotal = subtotal - discount;

      detail = {
        DetailsID: singleDetail.DetailsID,
        Product: product,
        // ProductVariant: variant,
        ProductVariantID: singleDetail.ProductVariantID,

        Quantity: quantity,
        dTotalAmount: grandTotal,
        dTotalDiscount: discount,
        TaxAmount: 0,
        TaxPer: 0,
        dTotalValue: subtotal,
        dTotalUnitValue: unitPrice,
        TrackableProductsSaleDetails: singleDetail.TrackableProductsSaleDetails,
        SaleDetailNonTrackableLocations: singleDetail.SaleDetailNonTrackableLocations
      };
      saleDetails.push(detail);
    }
    this.salePrintDetails = saleDetails;
    isInvoiceCreated = true;
    isTraceable = true;
    isRefundable = true;

    const discoutPercentage = (this.totalDiscount / this.subTotal) + this.totalDiscount;

    if (this.selectedOrderBy.value === '1') {
      this.payment = this.grandTotal;
    } else {
      const remainingAmount = this.grandTotal - this.payment;
      if ((remainingAmount + this.customerCurrentBalance) > this.creditlimit) {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Remaining amount (including current balance of selected customer) is greater than credit limit.');
        return;
      }
    }
    this.BindHTMLTableData(false);
    const params = {
      CustomerID: this.selectedOrderBy.value,
      Customer: this.selectedOrderBy.label,
      DeliveredToID: this.selectedDeliverTo.value,
      DeliveredTo: this.selectedDeliverTo.label,
      DeliveryAddressID: this.selectedDeliverTo.value,
      sRemarks: this.remarks,
      dtDate: this.deliverDate,
      SaleDate: this.orderDate,
      PaymentConditionID: this.selectedPaymentCondition.value,
      ShippingMethodID: this.selectedDeliveryMethod.value,
      ShippingCost: this.shipmentCost,
      dTotalPaidValue: this.payment,
      dDiscountValueString: this.customerCurrentBalance,
      CustomerCreditLimit: this.creditlimit,
      Password: this.password,
      PaymentModeID: 1,
      isB: false,
      SaleDetails: saleDetails,
      IsInvoiceCreated: isInvoiceCreated,
      IsTraceable: isTraceable,
      IsRefundable: isRefundable,
      dTotalSaleValue: this.grandTotal,
      dDiscountValue: this.totalDiscount,
      dDiscountPercentage: discoutPercentage,
      CreatedByUserID: this.usermodel.ID,
      OutletID: this.usermodel.OutletID,
      CashRegisterHistoryID: Number(this.storageService.getItem('CashRegisterHistoryID')),
    };
    this.deliverToName = this.selectedDeliverTo.label;
    this.selectedDeliveryAddressID = this.deliverToAddress;
    this.apiService.SaveSaleDetails(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.invoiceNo = response.Sale.ID;
        const body = document.getElementById('printable');
        this.SendSaleOrderEmail(body);
      } else if (response.ResponseCode === 99) {
        if (typeId === 1 && this.payment === 0) {
          this.payment = 0;
          this.displayAddPaymentPopup = true;
        }
      } else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.message);
      }
    });
  }

  SendSaleOrderEmail(body: any) {

    const params = {
      Body: body,
      EmailAddress: this.customerEmail
    };

    this.apiService.SaveSaleDetails(params).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseCode === 0) {

      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.message);
      }
    });
  }

  // Bind data for send email html body
  BindHTMLTableData(isReview: any) {

    const tableBody = document.getElementById('printbody');
    for (const item of this.salePrintDetails) {
      const tr = document.createElement('tr');
      const tdproduct = document.createElement('td');
      tdproduct.appendChild(document.createTextNode(item.ProductVariantID));
      tr.appendChild(tdproduct);
      const tdName = document.createElement('td');
      tdName.appendChild(document.createTextNode(item.Product));
      tr.appendChild(tdName);
      const tdQuantity = document.createElement('td');
      tdQuantity.appendChild(document.createTextNode(item.Quantity));
      tr.appendChild(tdQuantity);
      const tdUnitPrice = document.createElement('td');
      tdUnitPrice.appendChild(document.createTextNode(this.currencySign + '' + item.dTotalUnitValue));
      tr.appendChild(tdUnitPrice);
      const tdTotal = document.createElement('td');
      const total = item.dTotalValue - item.dTotalDiscount;
      tdTotal.appendChild(document.createTextNode(this.currencySign + '' + total.toString()));
      tr.appendChild(tdTotal);
      tableBody.appendChild(tr);
    }

  }

  //#endregion


  //#region  Save and Print

  SaveAndPrint() {

    if (!this.ValidateSaleSaveDetails()) {
      return;
    }

    if (!this.payment) {
      this.payment = 0;
    }

    if (this.type === 'Cash' && this.payment === 0) {
      if (!this.password) {
        this.password = '';
        this.displayAddPaymentPopup = true;
        return;
      }

    }

    if (this.usermodel.ID === 1)// Check Password
    {
      const password = {
        Password: this.password
      };

      this.apiService.CheckReceivedPaymentPassword(password).pipe(untilDestroyed(this)).subscribe((response: any) => {
        if (response.ResponseCode !== 0) {
          this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Wrong password entered to add payment.');
          return;
        }
      });
    } else {
      const param = {
        VerificationCode: this.password,
        Type: 1,
        UserID: this.usermodel.ID,
        Amount: (this.selectedOrderBy.value === '1') ? this.grandTotal : this.payment,
        UsedFor: this.selectedOrderBy.value
      };

      this.apiService.CheckValidationCode(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
        if (response.ResponseCode !== 0) {
          this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Wrong password entered to add payment.');
          return;
        }
      });
    }

    // Delete Sale Details if exists already
    if (this.OpenSaleID > 0) {
      this.DeleteSaleDetails();
    }

    let typeId = 0;
    if (this.type === 'Cash') {
      typeId = 1;
      this.restAmount = this.grandTotal - this.payment;
    }
    else {
      this.restAmount = this.grandTotal;
      typeId = 2;
    }

    let detail;
    let singleDetail;
    let detailsID;
    let productText;
    let detailsIndex;
    let isInvoiceCreated;
    let isTraceable;
    let isRefundable;


    const saleDetails = new Array();
    let product;
    let quantity;
    let unitPrice;
    let discount;
    let subtotal;
    let grandTotal;
    for (let i = 0; i < this.products.length - 1; i++) {

      detailsID = this.products[i].CartDetailsID;

      detailsIndex = this.details.findIndex(x => x.DetailsID === detailsID);
      if (!detailsIndex) {
        singleDetail = this.details[detailsIndex];
      }

      productText = this.products[i].selectedProduct.label;

      product = productText.split('(')[0];
      quantity = this.products[i].Quantity;
      unitPrice = this.products[i].Price;
      discount = this.products[i].DiscVal;

      subtotal = (quantity * unitPrice);
      grandTotal = subtotal - discount;

      detail = {
        DetailsID: singleDetail.DetailsID,
        Product: product,
        // ProductVariant: variant,
        ProductVariantID: singleDetail.ProductVariantID,

        Quantity: quantity,
        dTotalAmount: grandTotal,
        dTotalDiscount: discount,
        TaxAmount: 0,
        TaxPer: 0,
        dTotalValue: subtotal,
        dTotalUnitValue: unitPrice,
        TrackableProductsSaleDetails: singleDetail.TrackableProductsSaleDetails,
        SaleDetailNonTrackableLocations: singleDetail.SaleDetailNonTrackableLocations
      };
      saleDetails.push(detail);
    }
    this.salePrintDetails = saleDetails;

    isInvoiceCreated = true;
    isTraceable = true;
    isRefundable = true;

    const discoutPercentage = (this.totalDiscount / this.subTotal) + this.totalDiscount;

    if (this.selectedOrderBy.value === '1') {
      this.payment = this.grandTotal;
    } else {
      const remainingAmount = this.grandTotal - this.payment;
      if ((remainingAmount + this.customerCurrentBalance) > this.creditlimit) {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Remaining amount (including current balance of selected customer) is greater than credit limit.');
        return;
      }
    }

    this.BindHTMLTableData(false);

    const params = {
      CustomerID: this.selectedOrderBy.value,
      Customer: this.selectedOrderBy.label,
      DeliveredToID: this.selectedDeliverTo.value,
      DeliveredTo: this.selectedDeliverTo.label,
      DeliveryAddressID: this.selectedDeliverTo.value,
      sRemarks: this.remarks,
      dtDate: this.deliverDate,
      SaleDate: this.orderDate,
      PaymentConditionID: this.selectedPaymentCondition.value,
      ShippingMethodID: this.selectedDeliveryMethod.value,
      ShippingCost: this.shipmentCost,
      dTotalPaidValue: this.payment,
      dDiscountValueString: this.customerCurrentBalance,
      CustomerCreditLimit: this.creditlimit,
      Password: this.password,
      PaymentModeID: 1,
      isB: false,
      SaleDetails: saleDetails,
      IsInvoiceCreated: isInvoiceCreated,
      IsTraceable: isTraceable,
      IsRefundable: isRefundable,
      dTotalSaleValue: this.grandTotal,
      dDiscountValue: this.totalDiscount,
      dDiscountPercentage: discoutPercentage,
      CreatedByUserID: this.usermodel.ID,
      OutletID: this.usermodel.OutletID,
      CashRegisterHistoryID: Number(this.storageService.getItem('CashRegisterHistoryID')),
    };
    this.deliverToName = this.selectedDeliverTo.label;
    this.selectedDeliveryAddressID = this.deliverToAddress;
    this.apiService.SaveSaleDetails(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {

        this.invoiceNo = response.Sale.ID;
        this.print();
        this.router.navigate(['/sale/add-receipt']);
      } else if (response.ResponseCode === 99) {
        if (typeId === 1 && this.payment === 0) {
          this.payment = 0;
          this.displayAddPaymentPopup = true;
        }
      } else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.message);
      }
    });

  }

  // print div
  print(): void {
    let printContents;
    let popupWin;
    printContents = document.getElementById('printable').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
      <head>
        <title>Print tab</title>
        <style>
        .text-right {
          text-align: right !important;
      }
      .table {
          width: 100%;
          max-width: 100%;
          margin-bottom: 1rem;
          background-color: transparent;
      }
      .table-bordered {
          border-color: #ebeff2;
      }
      .table {
          border-collapse: collapse !important;
        }
        .table td,
        .table th {
          background-color: #fff !important;
        }
        .table-bordered th,
        .table-bordered td {
          border: 1px solid #ddd !important;
        }
        </style>
      </head>
  <body onload='window.print();window.close()'>${printContents}</body>
    </html>`
    );
    popupWin.document.close();
  }

  //#endregion

  //#region  Helpers

  // Check Product Trackability
  CheckProductTrackability(productID: number) {

    const params = { ID: productID };
    //this.apiService.GetProductByProductID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.apiService.GetProductByID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.products[this.rowIndex].Price = response.ProductModel.SalePrice;
        if (response.ProductModel.IsTrackable) {

          this.isTrackable = true;
          this.products[this.rowIndex].IsQtyDisable = true;
          this.products[this.rowIndex].IsTrackable = true;
          this.products[this.rowIndex].IsSelectedTrackables = true;
          this.products[this.rowIndex].IsLocation = false;
          this.products[this.rowIndex].IsAddToWishList = true;
          this.products[this.rowIndex].IsLastAvgPrice = true;
        } else {

          this.isTrackable = false;
          this.products[this.rowIndex].IsQtyDisable = false;
          this.products[this.rowIndex].IsTrackable = false;
          this.products[this.rowIndex].IsSelectedTrackables = false;
          this.products[this.rowIndex].IsLocation = true;
          this.products[this.rowIndex].IsAddToWishList = true;
          this.products[this.rowIndex].IsLastAvgPrice = true;
        }
      } else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server error ! fillFields');
      }
    },
      error => {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal server error ! fillFields');
      });
  }

  // Add new row to cart table
  AddNewRow() {

    this.products.push({
      selectedProduct: this.selectedProduct,
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
      IsAdded: false
    });
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
    const shipmentCost = Number(this.shipmentCost);
    const subtotal = totalsubtotal;
    if (shipmentCost > 0) {
      totalsubtotal = totalsubtotal + shipmentCost;
    }
    const totalgrandTotal = (totalsubtotal - totaldiscount);
    this.grandTotal = totalgrandTotal.toFixed(2);
    this.subTotal = subtotal.toFixed(2);
    if (totaldiscount > 0) {
      this.totalDiscount = totaldiscount.toFixed(2);
    }
  }


  GetProductTrackablesList(productID) {

    const id = {
      ProductVariantID: productID,
      OutletID: this.usermodel.OutletID
    };

    this.apiService.GetProductTrackablesById(id).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'Success') {
        this.AllProductTracablesList = response.TrackableCodesDetailList;
        this.refreshSelectedProductTrackables(this.rowIndex);
        this.displayProductTrackables = true;
      } else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', response.ResponseText);
      }
    });
  }

  SaleOrderReview() {

    if (this.details.length === 0 || this.details.length === null) {
      this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Please add product to cart first.');
      return;
    }

    let typeId = 0;
    if (this.type === 'Cash') {
      typeId = 1;
      this.restAmount = this.grandTotal - this.payment;
    } else {
      this.restAmount = this.grandTotal;
      typeId = 2;
    }

    let detail;
    let singleDetail;
    let detailsID;
    let productText;
    let detailsIndex;

    const saleDetails = new Array();
    let product;
    let quantity;
    let unitPrice;
    let discount;
    let subtotal;
    let grandTotal;
    for (let i = 0; i < this.products.length - 1; i++) {
      detailsID = this.products[i].CartDetailsID;
      detailsIndex = this.details.findIndex(x => x.DetailsID === detailsID);
      if (!detailsIndex) {
        singleDetail = this.details[detailsIndex];
      }

      productText = this.products[i].selectedProduct.label;

      product = productText.split('(')[0];
      quantity = this.products[i].Quantity;
      unitPrice = this.products[i].Price;
      discount = this.products[i].DiscVal;

      subtotal = (quantity * unitPrice);
      grandTotal = subtotal - discount;

      detail = {
        DetailsID: singleDetail.DetailsID,
        Product: product,
        // ProductVariant: variant,
        ProductVariantID: singleDetail.ProductVariantID,

        Quantity: quantity,
        dTotalAmount: grandTotal,
        dTotalDiscount: discount,
        TaxAmount: 0,
        TaxPer: 0,
        dTotalValue: subtotal,
        dTotalUnitValue: unitPrice,
        TrackableProductsSaleDetails: singleDetail.TrackableProductsSaleDetails,
        SaleDetailNonTrackableLocations: singleDetail.SaleDetailNonTrackableLocations,
        dtotal: (subtotal - discount)
      };
      saleDetails.push(detail);
    }
    this.salePrintDetails = saleDetails;
    this.displayReview = true;
  }

  ClosePaymentPopup() {

    this.displayAddPaymentPopup = false;
    this.paidPayment = this.payment;
    let previousBalance = this.customerPreviousBalance.split('€').join('');
    previousBalance = previousBalance.split(' ').join('');
    this.customerCurrentBalance = (Number(previousBalance) + Number(this.grandTotal)) - Number(this.payment);
  }
  //#endregion

  SetProductPriceVariable(
    availableStockValue: string,
    averagePurchasePriceValue: string,
    lastPurchasePriceValue: string,
    profitValue: string) {

    this.latAvgPriceDetails = new ProductPricesDetailModel();
    this.latAvgPriceDetails.AvailableStock = availableStockValue;
    this.latAvgPriceDetails.AveragePurchasePrice = averagePurchasePriceValue;
    this.latAvgPriceDetails.LastPurchasePrice = lastPurchasePriceValue;
    this.latAvgPriceDetails.Profit = profitValue;
  }

  validateDetailFields(product, IsShowAlert) {
    if (product.selectedProduct.value === '' || product.selectedProduct.value === 0) {
      if (IsShowAlert) {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Please select a product');
      } else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Please select a product');
        return false;
      }
    }
    if (product.Quantity === 0) {
      if (IsShowAlert) {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Please enter quantity of product');
      } else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Please enter quantity of product');
      }
      return false;
    }
    if (product.Price === '') {
      if (IsShowAlert) {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Please enter unit price of product');
      } else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Please enter unit price of product');
        return false;
      }

    }
    if (product.DiscVal < 0) {
      if (IsShowAlert) {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Please enter discount for product');
      } else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Please enter discount for product');
        return false;
      }
    }

    if (product.IsTrackable === true) {
      if (product.Quantity !== this.trackables.length) {
        if (IsShowAlert) {
          this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Number of trackable is not equal to number of product quantity entered');
        } else {
          this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Number of trackable is not equal to number of product quantity entered');
          return false;
        }
      }
    }
    return true;
  }
}
