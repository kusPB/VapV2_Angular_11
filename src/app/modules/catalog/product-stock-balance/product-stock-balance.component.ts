import { SystemConfigModel } from "../../../Helper/models/SystemConfigModel";
import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  LazyLoadEvent,
  MenuItem,
  ConfirmationService,
} from "primeng/api";
import { ActivatedRoute } from "@angular/router";

import { DatePipe } from "@angular/common";

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

@Component({
  selector: "app-product-stock-balance",
  templateUrl: "./product-stock-balance.component.html",
  styles: [],
  providers: [DatePipe, ConfirmationService],
})
export class ProducStockBalanceComponent implements OnInit, OnDestroy {
  imageBasePath;
  AllProductList:any = [];
  PaginationData: any = [];
  filterRequestModel: FilterRequestModel;
  usermodel: UserModel;
  SystemConfigModel: SystemConfigModel;
  selectedFilter = 1;
  selectedFilterImage = 1;

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
    {
      label: "Sync Stock",
      icon: "fas fa-image",
      dependedProperty: "ID",
    },
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
      field: "Name",
      header: "Product",
      sorting: "Name",
      placeholder: "",
      translateCol: "SSGENERIC.PRODUCT",
    }, 
    {
      field: "BLabel",
      header: "Model",
      sorting: "BLabel",
      placeholder: "",
      translateCol: "SSGENERIC.MODEL",
    },
    {
      field: "MaximumStock",
      header: "Actual Stock",
      sorting: "MaximumStock",
      placeholder: "",
      translateCol: "SSGENERIC.ActualStock",
    },
    {
      field: "RemainingStock",
      header: "Display Stock",
      sorting: "RemainingStock",
      placeholder: "",
      translateCol: "SSGENERIC.DisplayStock",
    },
    
  ];

  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  globalFilterFields = ['Name','BLabel'];
  // tslint:disable-next-line: max-line-length
  constructor(
    private vapLongApiService: vaplongapi,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private storageService: StorageService
  ) {
    // this.breadcrumbService.setItems([
    //   { label: 'Managed Products' }
    // ]);
    this.imageBasePath = this.vapLongApiService.imageBasePath;
    this.usermodel = this.storageService.getItem("UserModel");
    // const obj = {
    //   Action: "View",
    //   Description: `View Product Image Listing`,
    //   PerformedAt: new Date().toISOString(),
    //   UserID: this.usermodel.ID,
    // };
    // this.vapLongApiService
    //   .SaveActivityLog(obj)
    //   .toPromise()
    //   .then((x) => {});
  }

  ngOnInit(): void {
    this.usermodel = this.storageService.getItem("UserModel");
    this.SystemConfigModel = JSON.parse(localStorage.getItem("SystemConfig"));
    this.totalRecords = this.route.snapshot.data.val;
    this.GetAllProductWithStockDifference();
  }
 
  ngOnDestroy(): void {}
 
  emitAction(event) {
    debugger;
    if (event.forLabel === "Sync Stock") {
      this.SyncProductStocks(event.selectedRowData.ID);
    } 
  }

  SyncProductStocks(para) {
    this.confirmationService.confirm({
      message: "Are you sure that you want to Sync Stock?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.SyncStocks(para);
      },
    });
  }
  SyncStocks(para) {
    this.loading = true;
    const id = {
      ID: para,
      RequestedUserID: this.usermodel.ID,
    };
    this.vapLongApiService
      .SyncProductStock(id)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.notificationService.notify(
            NotificationEnum.SUCCESS,
            "success",
            "Product Stock Sync Successfully"
          );
          this.GetAllProductWithStockDifference();
        } else if (response.ResponseCode === -1) {
          this.loading = false;
          this.notificationService.notify(
            NotificationEnum.ERROR,
            "error",
            response.ResponseText
          );
        } else {
          this.loading = false;
          console.log("internal server error !  not getting api data");
          this.notificationService.notify(
            NotificationEnum.ERROR,
            "error",
            "internal server Error ! try again"
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

  GetAllProductWithStockDifference() {  
    this.vapLongApiService
      .GetAllProductWithDifferentStock()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseText === "success") {
          this.AllProductList = response.AllProductList;
          for (const item of this.AllProductList) {
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
}
