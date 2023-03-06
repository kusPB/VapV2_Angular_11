import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Table } from 'primeng/table';
import { ProductVariant } from 'src/app/Helper/models/Product';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { LazyLoadEvent } from 'primeng/api/primeng-api';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { CustomerProductsDiscountModel } from 'src/app/Helper/models/CustomerProductsDiscountModel';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/shared/services/storage.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

@Component({
  selector: 'app-product-with-stock',
  templateUrl: './product-with-stock.component.html',
  styleUrls: ['./product-with-stock.component.scss']
})
export class ProductWithStockComponent implements OnInit, OnDestroy {
  AllProductList: ProductVariant[] = [];
  CustomerDiscountList: CustomerProductsDiscountModel[] = [];
  product: ProductVariant;
  selectedProductDiscount: CustomerProductsDiscountModel;
  usermodel: UserModel;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  totalRecords = 0;
  IsSpinner = false;
  imageBasePath;
  imgSrc = '';
  displayImage = false;
  currencySign: string;

  @Output() onSelectValue = new EventEmitter<{ selectedProduct: any }>();
  @Input() OrderByID: any;

  selectedProduct: any = {};
  constructor(private vapLongApiService: vaplongapi, private storageService: StorageService) {
    this.imageBasePath = this.vapLongApiService.imageBasePath;
    // this.currencySign = environment.currencySign;
    this.currencySign = '€';

  }
  ngOnDestroy() {

  }
  ngOnInit(): void {
    this.GetCustomerDiscount(this.OrderByID.value);
    this.usermodel = this.storageService.getItem('UserModel');
    this.GetAllProductStockCount();
    this.GetAllProductStockList();
  }


  GetAllProductStockCount() {
    const params = {
      PageNo: 0,
      PageSize: 10000000,
      IsGetAll: true,
      IsAllProduct: true,
      OutletID: this.usermodel.OutletID,
      Search: ''
    };
    this.vapLongApiService.GetAllProductStockForSaleCount(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.totalRecords = response.TotalRowCount;
      }
      else {
        console.log('internal server error ! GetAllProductPagination not getting api data');
      }
    },
    );
  }
  GetAllProductStockList() {

    const params = {
      PageNo: 0,
      PageSize: 10000000,
      IsGetAll: true,
      IsAllProduct: true,
      OutletID: this.usermodel.OutletID,
      Search: ''
    };
    this.vapLongApiService.GetAllProductStockListForSale(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        let minDiscount = 0;
        let maxDiscount = 0;
        let minDiscountValue = 0;
        let maxDiscountValue = 0;
        response.AllProductVariantList.forEach(item => {
          this.selectedProductDiscount = this.CustomerDiscountList.filter(x => x.ProductID === item.ProductID)[0];
          if (this.selectedProductDiscount == null) {
            minDiscount = 0;
            maxDiscount = 0;
          }
          else {
            minDiscount = this.selectedProductDiscount.fMinDiscPrec.valueOf() ? this.selectedProductDiscount.fMinDiscPrec.valueOf() : 0;
            maxDiscount = this.selectedProductDiscount.fMaxDiscPerc.valueOf() ? this.selectedProductDiscount.fMaxDiscPerc.valueOf() : 0;
          }
          minDiscountValue = (minDiscount * (item.Price.HasValue ? item.Price.Value : 0)) / 100;
          maxDiscountValue = (maxDiscount * (item.Price.HasValue ? item.Price.Value : 0)) / 100;
          // imageSrc = "http://" + host + "/Content/" + item.ProductImage;

          this.product = {
            ID: item.ID,
            Product: (item.ColorID === 1 && item.SizeID === 1) ? item.Product : (item.ColorID !== 1 && item.SizeID === 1) ?
              item.Product + '<br>Color: ' + item.Color :
              (item.ColorID === 1 && item.SizeID !== 1) ?
                item.Product + '<br>Size: ' + item.Size :
                item.Product + '<br>Color: ' + item.Color + ', Size:' + item.Size,
            Price: item.Price, RemainingStock: item.RemainingStock, PurchasePrice: item.PurchasePrice,
            ProductID: item.ProductID,
            BLabel: item.BLabel,
            ArticalNo: item.ArticalNo, SizeID: item.SizeID,
            minDisc: minDiscount,
            maxDisc: maxDiscount,
            minDiscValue: minDiscountValue,
            maxDiscValue: maxDiscountValue,
            ColorID: item.ColorID,
            ProductImage: item.ProductImage,
            PriceString: item.Price
          };
          this.AllProductList.push(this.product);
        });
      }
      else {
        console.log('internal server error ! GetAllProductPagination not getting api data');
      }
    },
    );

  }

  SelectRow(product: any) {

    this.onSelectValue.emit({ selectedProduct: product });
  }

  popUpImageFuction(imgSrc) {
    this.imgSrc = imgSrc;
    this.displayImage = true;
  }

  GetCustomerDiscount(customerId: number) {
    const id = {
      ID: customerId
    };

    this.vapLongApiService.GetAllCustomerProductsDiscountByCustomerID(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.CustomerDiscountList = response.AllCustomerProductsDiscountList;
      }
      else {

        console.log('internal serve Error', response);
      }
    }
    );
  }
}
