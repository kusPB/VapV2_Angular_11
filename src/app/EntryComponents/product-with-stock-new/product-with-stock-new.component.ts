import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Table } from 'primeng/table';
import { ProductVariant } from 'src/app/Helper/models/Product';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { LazyLoadEvent } from 'primeng/api/primeng-api';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { CustomerProductsDiscountModel } from 'src/app/Helper/models/CustomerProductsDiscountModel';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-with-stock-new',
  templateUrl: './product-with-stock-new.component.html',
  styleUrls: ['./product-with-stock-new.component.scss']
})
export class ProductWithStockNewComponent implements OnInit {
  // AllProductList: ProductVariant[]=[];
  // CustomerDiscountList:CustomerProductsDiscountModel[]=[];
  // product:ProductVariant;
  // selectedProductDiscount:CustomerProductsDiscountModel;
  // usermodel: UserModel;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // totalRecords = 0;
  IsSpinner = false;
  imageBasePath;
  imgSrc = '';
  displayImage = false;
  currencySign: string;

  @Output() onSelectValue = new EventEmitter<{ selectedProduct: any }>();
  // @Input() OrderByID: any;
  @Input() AllProductList: ProductVariant[];
  @Input() totalRecords: number;

  selectedProduct: any = {};
  constructor(private vapLongApiService: vaplongapi) {
    this.imageBasePath = this.vapLongApiService.imageBasePath;
    // this.currencySign = environment.currencySign;
    this.currencySign = '€';

  }

  ngOnInit(): void {
    // this.GetCustomerDiscount(this.OrderByID.value);
    // this.usermodel = this.storageService.getItem('UserModel');;
    // this.GetAllProductStockCount();
    // this.GetAllProductStockList();
  }


  // GetAllProductStockCount(){

  //   let params = {
  //     PageNo :  0,
  //     PageSize:10000000,
  //     IsGetAll:true,
  //     IsAllProduct:true,
  //     OutletID:this.usermodel.OutletID,
  //     Search:''

  // };

  // this.vapLongApiService.GetAllProductStockForSaleCount(params).subscribe((response: any) => {
  //     if (response.ResponseCode === 0) {
  //         this.totalRecords = response.TotalRowCount;
  //   }
  //   else {
  //     console.log('internal server error ! GetAllProductPagination not getting api data');
  //   }
  // },
  // );

  // }

  // GetAllProductStockList(){

  //   let params = {
  //     PageNo :  0,
  //     PageSize:10000000,
  //     IsGetAll:true,
  //     IsAllProduct:true,
  //     OutletID:this.usermodel.OutletID,
  //     Search:''

  // };

  // this.vapLongApiService.GetAllProductStockListForSale(params).subscribe((response: any) => {

  //   if (response.ResponseCode === 0) {
  //     let minDisc = 0;
  //     let maxDisc = 0;
  //     let minDiscValue = 0;
  //     let maxDiscValue = 0;
  //     response.AllProductVariantList.forEach(item => {
  //       this.selectedProductDiscount =  this.CustomerDiscountList.filter(x => x.ProductID == item.ProductID)[0];
  //       if (this.selectedProductDiscount == null)
  //       {
  //           minDisc = 0;
  //           maxDisc = 0;
  //       }
  //       else
  //       {
  //           minDisc = this.selectedProductDiscount.fMinDiscPrec.valueOf() ? this.selectedProductDiscount.fMinDiscPrec.valueOf()  : 0;
  //           maxDisc = this.selectedProductDiscount.fMaxDiscPerc.valueOf()  ? this.selectedProductDiscount.fMaxDiscPerc.valueOf()  : 0;
  //       }
  //        minDiscValue = (minDisc * (item.Price.HasValue ? item.Price.Value : 0)) / 100;
  //        maxDiscValue = (maxDisc * (item.Price.HasValue ? item.Price.Value : 0)) / 100;
  //        //imageSrc = "http://" + host + "/Content/" + item.ProductImage;

  //        this.product= {
  //         ID:item.ID,
  //         Product:(item.ColorID == 1 && item.SizeID == 1) ? item.Product :
  // (item.ColorID != 1 && item.SizeID == 1) ? item.Product + "<br>Color: " + item.Color :
  // (item.ColorID == 1 && item.SizeID != 1) ? item.Product + "<br>Size: " +
  // item.Size:item.Product + "<br>Color: " + item.Color + ", Size:" + item.Size,
  //         Price:item.Price,RemainingStock:item.RemainingStock,PurchasePrice:item.PurchasePrice,
  //         ProductID:item.ProductID,BLabel:item.BLabel,ArticalNo:item.ArticalNo,SizeID:item.SizeID,minDisc:minDisc,
  //         maxDisc:maxDisc,minDiscValue:minDiscValue,maxDiscValue:maxDiscValue,ColorID:item.ColorID,ProductImage:item.ProductImage,
  //         PriceString:item.Price
  //        };
  //        this.AllProductList.push(this.product);
  //   });
  //   }
  //   else {
  //     console.log('internal server error ! GetAllProductPagination not getting api data');
  //   }
  // },
  // );

  // }

  SelectRow(product: any) {

    this.onSelectValue.emit({ selectedProduct: product });
  }

  popUpImageFuction(imgSrc) {
    this.imgSrc = imgSrc;
    this.displayImage = true;
  }

  //  GetCustomerDiscount(customerId:number){
  //   let id = {
  //     ID :  customerId
  //   };

  //   this.vapLongApiService.GetAllCustomerProductsDiscountByCustomerID(id).subscribe((response: any) => {
  //
  //     if (response.ResponseCode === 0){
  //       this.CustomerDiscountList = response.AllCustomerProductsDiscountList;
  //     }
  //     else{

  //       console.log('internal serve Error' , response);
  //     }

  //   }
  //   );

  //  }
}
