import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { Table } from "primeng/table";
import { ProductVariant } from "src/app/Helper/models/Product";
import { vaplongapi } from "src/app/Service/vaplongapi.service";
import { LazyLoadEvent } from "primeng/api/primeng-api";
import { FilterRequestModel } from "src/app/Helper/models/FilterRequestModel";
import { untilDestroyed } from "src/app/shared/services/until-destroy";

@Component({
  selector: "app-product-dialog",
  templateUrl: "./product-dialog.component.html",
  styleUrls: ["./product-dialog.component.scss"],
})
export class ProductDialogComponent implements OnInit, OnDestroy {
  AllProductList: ProductVariant;
  filterRequestModel: FilterRequestModel;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  totalRecords = 0;
  IsSpinner = false;
  @Output() onSelectValue = new EventEmitter<{ selectedProduct: any }>();
  selectedProduct: any;

  constructor(private vapLongApiService: vaplongapi) {}
  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.FilterRequestModelInilizationFunction();
    this.GetAllProductsTotalCount();
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
      0
    );
  }

  GetAllProductsTotalCount() {
    let params = {
      PageNo: 0,
      PageSize: 10000000,
      Product: "",
    };
    this.vapLongApiService
      .GetAllProductVariantTotalCount(params)
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

  LazyLoad(event: LazyLoadEvent): void {
    this.loading = true;
    const start = event.first / event.rows;
    const product = "";
    if (event.globalFilter) {
      this.filterRequestModel.Product = event.globalFilter;
      // this.filterRequestModel.PageNo = 1;
    } else {
      this.filterRequestModel.Product = product;
    }
    this.filterRequestModel.PageNo = start;
    this.filterRequestModel.PageSize = event.rows;
    this.GetAllProductWithLazyLoading(this.filterRequestModel);
  }

  GetAllProductWithLazyLoading(request: FilterRequestModel) {
    this.vapLongApiService
      .GetAllProductVariantPagination(this.filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        // console.log(response);
        if (response.ResponseText === "success") {
          this.AllProductList = response.DropDownData;
          this.loading = false;
        } else {
          this.loading = false;
          console.log("internal server error ! not getting api data");
        }
      });
  }

  SelectRow(product: any) {
    this.onSelectValue.emit({ selectedProduct: product });
  }
}
