import { SystemConfigModel } from "../../../Helper/models/SystemConfigModel";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import {
  LazyLoadEvent,
  MenuItem,
  ConfirmationService,
  SelectItem,
} from "primeng/api";
import { ActivatedRoute } from "@angular/router";

import { DatePipe } from "@angular/common";
import {
  AllProductList,
} from "../../../Helper/models/Product";
import { FilterRequestModel } from "../../../Helper/models/FilterRequestModel";
import { UserModel } from "../../../Helper/models/UserModel";
import { vaplongapi } from "../../../Service/vaplongapi.service";
import { NotificationEnum } from "src/app/shared/Enum/notification.enum";
import { TableColumnEnum } from "src/app/shared/Enum/table-column.enum";
import { GenericMenuItems } from "src/app/shared/Model/genric-menu-items.model";
import { Columns } from "src/app/shared/Model/columns.model";
import { StorageService } from "src/app/shared/services/storage.service";
import { NotificationService } from "../../shell/services/notification.service";
import { untilDestroyed } from "src/app/shared/services/until-destroy";
import { AddIncomingQuantityDialogComponent } from "src/app/EntryComponents/addincomingquantity-dialog/addincomingquantity-dialog.component";
import { datefilter } from "src/app/Helper/datefilter";
import { customSearchFn } from "src/app/shared/constant/product-search";

@Component({
  selector: "app-product-incoming-quantity-listing",
  templateUrl: "./product-incoming-quantity-listing.component.html",
  styles: [],
  providers: [DatePipe, ConfirmationService],
})
export class ProductIncomingQuantityListingComponent implements OnInit, OnDestroy {
  imageBasePath;

  @ViewChild("incomingList") incomingList: AddIncomingQuantityDialogComponent;
  //selectedProduct: AllProductList;
  AllProductList: Array<AllProductList> = [];
  PaginationData: any = [];
  filterRequestModel: FilterRequestModel;
  usermodel: UserModel;
  SystemConfigModel: SystemConfigModel;
  selectedFilter = 1;
  selectedFilterImage = 1;

  selectedProductIDforincomingQuantitylist: number;
  selectedProductNameforincomingQuantitylist: string;
  isAddToIncomingOrder = false;
  ExistedQuantity = 0;
  imgSrc = "";
  valCheck = "";
  ProductSearch = "";
  ProductID;
  bChangeBarcode = false;
  barcodechange = true;

  items: MenuItem[];
  
  IsSpinner = false;
  displayImage = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  totalRecords = 0;
  filterGlobal = true;
 
  Products: any[] = [];
  ShopProducts: any[] = [];

  genericMenuItems: GenericMenuItems[] = [
    
    { label: "Incoming Quantity", icon: "fas fa-shopping-cart", dependedProperty: "ID" },
    
  ];
 
  columns: Columns[] = [
    {
      field: "DisplayImage",
      header: "Image",
      sorting: "",
      placeholder: "",
      isImage: true,
      type: TableColumnEnum.MULTIPLEIMAGES,
      translateCol: "SSGENERIC.IMAGE",
    },
    {
      field: "Product",
      header: "Product",
      sorting: "Name",
      placeholder: "",
      translateCol: "SSGENERIC.PRODUCT",
    },
    {
      field: "Supplier",
      header: "Supplier",
      sorting: "Supplier",
      placeholder: "",
      translateCol: "SSGENERIC.SUPPLIER",
    },
    {
      field: "ArticalNo",
      header: "SKU",
      sorting: "ArticalNo",
      placeholder: "",
      translateCol: "SSGENERIC.SKU",
    },
    {
      field: "BLabel",
      header: "Model",
      sorting: "BLabel",
      placeholder: "",
      translateCol: "SSGENERIC.MODEL",
    },
    {
      field: "Quantity",
      header: "Incoming Quantity",
      sorting: "BLabel",
      placeholder: "",
      translateCol: "SSGENERIC.IncomingQuantity",
    },
    {
      field: "ReceivedQuantity",
      header: "Received Quantity",
      sorting: "BLabel",
      placeholder: "",
      translateCol: "SSGENERIC.ReceivedQuantity",
    },
    {
      field: "RemainingQuantity",
      header: "Remaining Quantity",
      sorting: "BLabel",
      placeholder: "",
      translateCol: "RemainingQuantity",
    },
  ];

  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  selectedOrderBy: any={ value: '0', label: 'All'};
  filteredOrderBy: any[];
  orderByDropdown: any[];
  AllSupplierList: any[] = [];

  ProductDropdown: SelectItem[];
  filteredProduct: any[];
  selectedProduct: any={ value: '0', label: 'All'};
  selectedProductID: any;
  SearchByDateDropdown: SelectItem[];
  selectedSearchByDateID = '';
  dataFunc: any = customSearchFn;

  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  // tslint:disable-next-line: max-line-length
  constructor(
    private vapLongApiService: vaplongapi,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private storageService: StorageService
  ) {
    // this.breadcrumbService.setItems([
    //   { label: 'Managed Products' }
    // ]);
    this.imageBasePath = this.vapLongApiService.imageBasePath;
    this.AllProductList = new Array<AllProductList>();
    this.usermodel = this.storageService.getItem("UserModel");
    const obj = {
      Action: "View",
      Description: `View Product Incoming Quantity Listing`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID,
    };
    this.vapLongApiService
      .SaveActivityLog(obj)
      .toPromise()
      .then((x) => {});
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem("UserModel");
    this.SystemConfigModel = JSON.parse(localStorage.getItem("SystemConfig"));
    this.totalRecords = this.route.snapshot.data.val;
    this.GetSuppliersDropDownLists(); // Bind customers in order by and deliver to dropdownlist
    this.GetSearchByDateDropDownList();
    this.GetProductDropDownList();
    this.FilterRequestModelInilizationFunction();
    this.GetAllProductTotalCountProductFunction();
    
  }
 
  ngOnDestroy(): void {}
 
  emitAction(event) {
    if (event.forLabel === "Incoming Quantity") {
      this.AddToIncomingQuantity(
        Number(event.selectedRowData.ProductID),
        event.selectedRowData.Name,event.selectedRowData.Quantity
      );
    } 
  }
 
  SearchByDate(event: any) {
    if (event.value === '7') {
      this.isCustomDate = true;
    }
  }

  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    // console.log(this.fromDate);

  }

  GetProductDropDownList() {

    this.ProductDropdown = [];
    this.vapLongApiService.GetProductDropDownDatawithVariantInfo().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.ProductDropdown.push({ value: '0', label: 'All' });
        for (const item of response.DropDownData) {
          this.ProductDropdown.push({
            value: item.ProductID,
            label: item.ProductName,
          });
        }
        this.filteredProduct = this.ProductDropdown;
        if (this.ProductDropdown.length > 0) {
          this.selectedProductID = 0;
          //this.GetProductVariantDropDownList(this.selectedProductID);
        }
        this.selectedProduct = { value: '0', label: 'All'};
      } else {
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'Internal Server Error! not getting api data');
        // console.log('internal serve Error', response);
      }

    }
    );
  }

  GetSearchByDateDropDownList() {

    this.SearchByDateDropdown = [];

    this.SearchByDateDropdown.push({ value: '0', label: 'Today' });
    this.SearchByDateDropdown.push({ value: '1', label: 'Yesterday' });
    this.SearchByDateDropdown.push({ value: '2', label: 'Last7Days' });
    this.SearchByDateDropdown.push({ value: '3', label: 'Last30Days' });
    this.SearchByDateDropdown.push({ value: '4', label: 'ThisMonth' });
    this.SearchByDateDropdown.push({ value: '5', label: 'LastMonth' });
    this.SearchByDateDropdown.push({ value: '6', label: 'All' });
    this.SearchByDateDropdown.push({ value: '7', label: 'Custom' });
    this.selectedSearchByDateID = '6';

  }
  FilterRequestModelInilizationFunction(): void {
    this.filterRequestModel = new FilterRequestModel(
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      new Date(),
      new Date(),
      150000,
      0,
      true,
      false,
      -1,
      -1,
      -1,
      false,
      false,
      false,
      "",
      "",
      false,
      false,
      -1,
      -1,
      false,
      false,
      "",
      "",
      "",
      0,
      true
    );
  }

  GetAllProductTotalCountProductFunction() {
    this.vapLongApiService
      .GetAllIncomingQuantityTotalCount(this.filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.totalRecords = response.TotalRowCount;
        } else {
          console.log(
            "internal server error ! GetAllProductPagination not getting api data"
          );
        }
      });
  }


  ViewProductFunction(product: any) {
    this.notificationService.notify(
      NotificationEnum.INFO,
      "Product Selected",
      product.name
    );
  }

  ProductSearchFunction(value) {
    this.filterRequestModel.Product = value;
  }

  filterReport() {

    this.AllProductList = [];
    this.totalRecords = 0;

    this.GetAllProductWithLazyLoadinFunction(this.filterRequestModel);
  }
  LazyLoadProductFunction(event: LazyLoadEvent): void {
    this.loading = true;
    const start = event.first / event.rows;
    const product = "";
    if (event.globalFilter) {
      this.filterRequestModel.Product = event.globalFilter;
    } else {
      this.filterRequestModel.Product = product;
    }

    this.filterRequestModel.PageNo = start;
    this.filterRequestModel.PageSize = event.rows;
    this.GetAllProductWithLazyLoadinFunction(this.filterRequestModel);
  }

  GetAllProductWithLazyLoadinFunction(fiterRM: FilterRequestModel) {
    this.filterRequestModel.PageNo = fiterRM.PageNo;
    this.filterRequestModel.PageSize = fiterRM.PageSize;
    this.filterRequestModel.Product = fiterRM.Product;
    
    if (Number(this.selectedSearchByDateID) !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(Number(this.selectedSearchByDateID) );
      this.filterRequestModel.IsGetAll = daterequest.IsGetAll;
      this.filterRequestModel.ToDate = new Date(this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss'));
      this.filterRequestModel.FromDate = new Date(this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss'));
    }
    else {
      this.filterRequestModel.IsGetAll = false;
      this.filterRequestModel.ToDate = new Date(this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss'));
      this.filterRequestModel.FromDate = new Date(this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss'));
    }
    this.filterRequestModel.ProductID = Number(this.selectedProduct.value);
    this.filterRequestModel.ID = Number(this.selectedOrderBy.value);
      
    this.GetAllProductTotalCountProductFunction();
    this.vapLongApiService
      .GetAllIncomingQuantity(this.filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {

          this.AllProductList = response.ProductIncomingQuantityList;
          for (const item of this.AllProductList) {
            var RemainingQuantity = Number(item.Quantity)-Number(item.ReceivedQuantity);
            // if(RemainingQuantity>=0){
            //     item.RemainingQuantity = RemainingQuantity;             
            // }
            item.RemainingQuantity = RemainingQuantity;
            
            if (item.Image != null && item.Image != "") {
              //item.DisplayImage = item.Image.split('|')[0];
              item.DisplayImage = item.Image;
            } else {
              item.DisplayImage = null;
            }
          }
        } else {
          this.IsSpinner = false;
          console.log("internal server error ! not getting api data");
        }
      });
  }
  popUpImageFuction(imgSrc) {
    this.imgSrc = imgSrc;
    this.displayImage = true;
  }

  AddToIncomingQuantity(ProductID: number, Product: string, Quantity:number) {

    this.selectedProductIDforincomingQuantitylist = ProductID;
    this.selectedProductNameforincomingQuantitylist = Product;
    this.ExistedQuantity = Quantity;
    this.isAddToIncomingOrder = true;
  }
  CloseDialog(newValue: any) {
    this.isAddToIncomingOrder = false;
    this.selectedProductIDforincomingQuantitylist = 0;
    this.selectedProductNameforincomingQuantitylist = "";
    // console.log(newValue.IsDone);
    this.incomingList.clearData();
    this.filterReport();

  }
  close() {
    this.selectedProductIDforincomingQuantitylist = -1;
    this.selectedProductNameforincomingQuantitylist = "";
    this.incomingList.clearData();
  }

  GetSuppliersDropDownLists() {
    this.IsSpinner = true;
    this.orderByDropdown = [];
    this.vapLongApiService.GetAllSupplier().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        response.AllSupplierList = response.AllSupplierList.filter(x => x.IsActiveForSupplier === true);
        this.orderByDropdown.push({ value: '0', label: 'All' });
        for (const item of response.AllSupplierList) {
          item.FirstName = item.FirstName != null ? item.FirstName : '';
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
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal serve Error');
        // console.log('internal serve Error', response);
      }
      this.selectedOrderBy = { value: '0', label: 'All'};

    });
  }
}
