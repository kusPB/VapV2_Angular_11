import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { FilterRequestModel } from '../../../Helper/models/FilterRequestModel';
import { ProductVariant } from '../../../Helper/models/Product';
import { vaplongapi } from '../../../Service/vaplongapi.service';
import { datefilter } from 'src/app/Helper/datefilter';
import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { NotificationService } from '../../shell/services/notification.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { StorageService } from 'src/app/shared/services/storage.service';


@Component({
  selector: 'app-post-to-shop',
  templateUrl: './post-to-shop.component.html',
  styleUrls: ['./post-to-shop.component.scss'],
  styles: [
  ],
  providers: [DatePipe]
})
export class PostToShopComponent implements OnInit, OnDestroy {

  // @ViewChild('dt') table: Table;
  dateForDD: any;
  SearchByDateDropdown: SelectItem[];
  selectedSearchByDateID = '';
  totalRecords = 0;
  rows = 25;
  first = 0;
  IsSpinner = false;
  ProductVariants: any[] = [];
  filterRequestModel: FilterRequestModel;
  mySearch: any;
  dateId = 6;
  filterModel = {
    PageNo: 0,
    PageSize: 25,
    Product: '',
  };
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  password='';
  displayPasswordPopup = false;
  selectedForPost:any;
  postType:any;
  genericMenuItems: GenericMenuItems[] = [
    { label: 'Post To Shop', icon: 'fas fa-paper-plane', dependedProperty: 'ID' },
  ];
  columns: Columns[] = [

    {
      field: 'productChecked', header: 'Select', sorting: '', placeholder: '',
      type: TableColumnEnum.CHECKBOX_COLUMN, translateCol: 'SSGENERIC.SELECT'
    },
    { field: 'ID', header: 'SKU', sorting: 'ID', searching: true, placeholder: '', translateCol: 'SSGENERIC.SKU' },
    { field: 'Product', header: 'Product', sorting: 'Product', searching: true, placeholder: '', translateCol: 'SSGENERIC.PRODUCT' },
    // tslint:disable-next-line: max-line-length
    { field: 'DisplayImage', header: 'Product Image', sorting: '', searching: true, placeholder: '', isImage: true, type: TableColumnEnum.IMAGE, translateCol: 'SSGENERIC.PRODUCTIMAGE' },
    { field: 'ShopSalePrice', header: 'Shop Sale Price', sorting: 'ShopSalePrice', searching: true, placeholder: '', type:TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.SHOPSALEP' },
    { field: 'Barcode', header: 'EAN', sorting: 'Barcode', searching: true, placeholder: '', translateCol: 'SSGENERIC.EAN' },
    {
      field: 'RemainingStock', header: 'Stock', sorting: 'RemainingStock', searching: true, placeholder: '',
      translateCol: 'SSGENERIC.STOCK'
    },
  ];

  globalFilterFields = ['ID', 'Product', 'Color', 'Size', 'Barcode', 'RemainingStock'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  usermodel: any;


  constructor(
    private route: ActivatedRoute, private datepipe: DatePipe, private router: Router,
    private vapLongApiService: vaplongapi,private storageService: StorageService, private notificationService: NotificationService) {
    this.totalRecords = this.route.snapshot.data.val;
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'Update',
      Description: `Post Product to Shop`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
    }
    this.vapLongApiService.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    this.GetSearchByDateDropDownList();
  }
  emitAction(event) {
    if (event.forLabel === 'Post To Shop') {
      this.PostTOShopOrAddProductToOpenCartFunction(event.selectedRowData.ID);
    }

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
  onChangeDate(event: any) {
    if (event.value === '7') {
      this.isCustomDate = true;
    }
    else {

      // this.getAllSaleList(this.selectedSearchByDateID);
      this.dateId = Number(this.selectedSearchByDateID);
      this.GetAllPostTableWithLazyLoadinFunction(this.filterModel);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;

    // this.getAllSaleList(7);
    this.dateId = 7;
    this.GetAllPostTableWithLazyLoadinFunction(this.filterModel);
  }


  GetAllPostTableWithLazyLoadinFunction(filterRM: any) {
    this.ProductVariants = [];
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.ToDate = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.Product = filterRM.Product;


    if (this.dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(this.dateId);
      filterRequestModel.IsGetAll = daterequest.IsGetAll;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss'));
      filterRequestModel.FromDate = new Date(this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss'));
    }
    else {
      filterRequestModel.IsGetAll = false;
      filterRequestModel.ToDate = new Date(this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss'));
      filterRequestModel.FromDate = new Date(this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss'));
    }
    this.vapLongApiService.GetAllPostableTotalCount(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseText === 'success') {
        this.totalRecords = response1.TotalRowCount;
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'internal server error');
      }
    },
    );
    this.vapLongApiService.GetAllPostable(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      
      if (response.ResponseText === 'success') {
        this.ProductVariants = response.AllProductVariantList;
        this.ProductVariants.forEach(element => {
          element.productChecked = false;
          if (element.ProductImage != null && element.ProductImage != '') {
            element.DisplayImage = element.ProductImage.split('|')[0];
          }
          else {
            element.DisplayImage = null;
          }
        });
       
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'internal server error');
      }
    },
    );

  }
  PostToShopPasswordClick(){
    
    if (this.postType==2)  // for Update
    {
      this.PostAllSelectedRows();
    }
    else if(this.postType==1) {
      this.PostTOShopOrAddProductToOpenCartFunction(this.selectedForPost); // for save
    }
  }

  async PostAllSelectedRows() {
    this.postType = 2;
    if (this.password === '' || this.password === null) {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please enter password');
      this.displayPasswordPopup = true;
      return;
    }
    else {
      const res = await this.validatePassword(this.password);
      if (!res) { return; }
    }

    const Ids = this.ProductVariants.filter(x => x.productChecked === true).map(x => x.ID);

    if (Ids.length <= 0) {
      this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please select rows to post');
      return;
    }
    const IDsList = [];
    Ids.forEach(x => {
      const model = { ID: x };
      IDsList.push(model);
    });
    const param = {
      ProductIDs: IDsList,
    };

    this.vapLongApiService.PostTOShopMultiple(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.displayPasswordPopup = false;
        this.password = '';
        this.GetAllPostTableWithLazyLoadinFunction(this.filterModel);
      }
      else if (response.ResponseCode === -1) {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
      error => {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'internal server error');
      }
    );
  }
  async PostTOShopOrAddProductToOpenCartFunction(para: any) {
    this.selectedForPost = para;
    this.postType=1;
    if (this.password === '' || this.password === null) {
      this.notificationService.notify(NotificationEnum.INFO, 'info', 'please enter password');
      this.displayPasswordPopup = true;
      return;
    }
    else {
      const res = await this.validatePassword(this.password);
      if (!res) { return; }
    }
    const ID = {
      ID: para
    };
    this.vapLongApiService.PostTOShopOrAddProductToOpenCart(ID).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success' || response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', response.ResponseText);
        this.displayPasswordPopup = false;
        this.password = '';
        this.GetAllPostTableWithLazyLoadinFunction(this.filterModel);
      }
      else if (response.ResponseCode === -1) {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
      }
    },
      error => {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'internal server error');
      }
    );
  }
  async validatePassword(password) {
    // if (this.usermodel.ID === 1)// Check Password
    // {
      const params = {
        ID:4,
        Password: password,
        Name:'',
        IsActive:true,
        UpdatedByUserID:this.usermodel.ID,
      };
      const response = await this.vapLongApiService.CheckReceivedPaymentPassword(params).toPromise();
      if (response.ResponseCode !== 0) {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Wrong password entered');
        return false;
      }
      else {
        return true;
      }

    // }
    // else {
    //   const params = {
    //     VerificationCode: password,
    //     Type: 2,
    //     UserID: this.usermodel.ID,
    //     Amount: 0,
    //     UsedFor: (this.customer.CustomerID !== 0) ? this.customer.CustomerID : 0
    //   };

    //   const response = await this.vapLongApiService.CheckValidationCode(params).toPromise();
    //   if (response.ResponseCode !== 0) {
    //     this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Wrong password entered to add payment.');
    //     return false;
    //   }
    //   else {
    //     return true;
    //   }
    // }
  }
}
