import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Table } from 'primeng/table';
import { ProductVariant } from 'src/app/Helper/models/Product';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { LazyLoadEvent } from 'primeng/api/primeng-api';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/shared/services/storage.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

@Component({
  selector: 'app-productvariant-stock-DD-data',
  templateUrl: './productvariant-stock-DD-data.component.html',
  styleUrls: ['./productvariant-stock-DD-data.component.scss']
})
export class ProductVariantStockDDDataComponent implements OnInit, OnDestroy {

  AllProductVariantDDList: any[] = [];
  selectedItem: any = {};
  product: any = {};
  usermodel: UserModel;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  totalRecords = 0;
  IsSpinner = false;
  currencySign: string;

  @Output() onSelectValue = new EventEmitter<{ selectedItem: any }>();

  constructor(private vapLongApiService: vaplongapi, private storageService: StorageService) {
    // this.currencySign = environment.currencySign;
    this.currencySign = '€';
  }

  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    this.GetAllProductStockCount();
    this.GetAllProductStockList();
  }


  GetAllProductStockCount() {

    const params = {
      PageNo: 0,
      PageSize: 10000000,
      IsGetAll: true,
      // OutletID:this.usermodel.OutletID,
      Product: ''

    };

    this.vapLongApiService.GetAllProductVariantWithStockTotalCount(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
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
      // OutletID:this.usermodel.OutletID,
      Product: ''

    };

    this.vapLongApiService.GetAllProductVariantWithStockPagination(params).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseCode === 0) {
        this.AllProductVariantDDList = response.DropDownData;
      }
      else {
        console.log('internal server error ! GetAllProductPagination not getting api data');
      }
    },
    );

  }

  SelectRow(event: any) {
    this.onSelectValue.emit({ selectedItem: event });
  }

}
