import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { WishlistModel } from 'src/app/Helper/models/WishlistModel';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';


import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';


@Component({
  selector: 'app-pre-order-history',
  templateUrl: './pre-order-history.component.html',
  styleUrls: ['./pre-order-history.component.scss']
})

export class PreOrderHistoryComponent implements OnInit, OnDestroy {
  @ViewChild('dt') table: Table;
  
  PaginationData: any = [];

  valCheck = '';
 
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
  detailTotalRecords = 0;
  purchaseTotalRecords = 0;
  filterModel = {
    PageNo: 0,
    PageSize: 25,
    Product: '',
  };
  usermodel: UserModel;
  displayDialog = false;
  DialogRemarks = '';

  
  rowGroup: RowGroup = {
    property: 'Date',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  purchaseColumns: Columns[] = [
    { field: 'ID', header: 'Order No', sorting: 'ID', placeholder: '', type: TableColumnEnum.REDIRECTION_COLUMN, translateCol: 'SSGENERIC.ORDERNO' },
    { field: 'Supplier', header: 'Supplier', sorting: 'Supplier', placeholder: '' , translateCol: 'SSGENERIC.SUPPLIER'},
    { field: 'Date', header: 'Date', sorting: 'Date', placeholder: '', type: TableColumnEnum.DATE_FORMAT, translateCol: 'SSGENERIC.DATE'},
  ];
  rowGroup1: RowGroup = {
    property: 'Date',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.DATE
  };
  detailColumn: Columns[] = [
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Quantity', header: 'Quantity', sorting: 'Quantity', placeholder: '', translateCol: 'SSGENERIC.QUANTITY'},
    { field: 'Received', header: 'Received Quantity', sorting: 'Received', placeholder: '' , translateCol: 'SSGENERIC.RECEIVEDQUANTITY'},
  ];
  purchaseGlobalFilterFields = "['ID','Supplier','Date']";
  detailGlobalFilterFields = "['Product','Quantity','Received']";
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000]
  genericMenuItems: GenericMenuItems[] = [];

  dataFunc: any = customSearchFn;
  ProductData: any = [];
  IsOpenProductDialog: boolean = false;
  preOrderHistory: any = {};
  Purchases: any = [];
  PreOrderDetails: any = [];
  isFirstTime = true;
  routeID: any;

  constructor(private apiService: vaplongapi, private storageService: StorageService,private route: ActivatedRoute, private notificationService: NotificationService,
    public router: Router,) {
    
      this.storageService.setItem('PurchaseDetailRoute', this.router.url);
      this.routeID = this.route.snapshot.params.id;

      this.usermodel = this.storageService.getItem('UserModel');
      const obj = {
        Action: 'View',
        Description: `View Pre Order History Report`,
        PerformedAt: new Date().toISOString(),
        UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
    this.GetPreOrderDetailHistoryReport(this.routeID);
    this.isFirstTime = false;
    this.GetAllPurchaseDataWithLazyLoadinFunction(this.filterModel);
  }

  ngOnInit(): void {

    this.usermodel = this.storageService.getItem('UserModel');


  }
  GetPreOrderDetailHistoryReport(PreOrderID) {
    const obj = {
      ID:   PreOrderID
    };
    this.apiService.GetPreOrderDetailHistoryReportDetailsOnly(obj).pipe(untilDestroyed(this)).subscribe((response: any) => {
     if (response.ResponseCode === 0) {
      this.preOrderHistory = response;
      this.PreOrderDetails = response.Details;
      this.detailTotalRecords = response.Details.Length;
   }
   else {
     console.log('internal server error ! not getting api data');
   }
  });
  }
  

  GetAllPurchaseDataWithLazyLoadinFunction(filterRM) {

    if (this.isFirstTime) { return; }
    const filterRequestModel = new FilterRequestModel();  
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.ID = this.routeID;

    this.apiService.GetPreOrderDetailHistoryReportPurchasesOnly(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
         this.Purchases = response1.Purchases;
        this.purchaseTotalRecords = response1.PurchaseQuantity;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    });
  }

  getPurchasesByInvoiceNo(event) {
    this.router.navigate([`/purchase/details/${event.ID}`]);
  }
  
  ngOnDestroy(): void {
  }
}

