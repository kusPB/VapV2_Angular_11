import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NonTrackableProductsLocationModel } from 'src/app/Helper/models/NonTrackableProductsLocationModel';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-product-locations',
  templateUrl: './product-locations.component.html',
  styleUrls: ['./product-locations.component.scss']
})
export class ProductLocationsComponent implements OnInit, OnDestroy {

  AllProductLocationList: NonTrackableProductsLocationModel[];
  first = 0;
  rows = 25;
  totalRecords = 0;
  OutleId: any;
  @Input() selectedProduct: any;
  @Input() isAdded: any;
  @Input() isLocationChangedByField: any;
  @Input() quantityField: any;
  @Input() productLocations: any;
  @Input() details: any;
  @Input() autoAssignLocationWhenProduct: any;


  trackableCode: string;
  constructor(private apiService: vaplongapi) {
  }
  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    this.GetProductLocationsByID();
  }

  GetProductLocationsByID() {
    const params = {
      ProductVariantID: this.selectedProduct,
      PageNo: 0,
      PageSize: 10000000,
      IsLocationAssigned: false
    };

    this.apiService.GetProductLocationByID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllProductLocationList = response.AllNonTrackableProductsLocationModelList;
        let qty = 0;
        let location;
        let checkQty = 0;
        let total = this.quantityField;
        for (const item in this.AllProductLocationList) {
          if (this.isAdded) {

            if (this.isLocationChangedByField === 'true') {
              const locations = this.details.filter(x => x.ProductVariantID === this.AllProductLocationList[item].ProductVariantID).shift();
              if (this.AllProductLocationList[item].LevelID === null) {
                location = locations.SaleDetailNonTrackableLocations.filter(x =>
                  x.NonTrackableProductsLocationID === this.AllProductLocationList[item].ID).shift();
              } else {
                location = locations.SaleDetailNonTrackableLocations.filter(x =>
                  x.LevelID === this.AllProductLocationList[item].LevelID).shift();
              }

              if (location != null) {
                qty = location.Quantity;
              } else {
                qty = 0;
              }
            }
            else {
              if (this.AllProductLocationList[item].Quantity != null) {

                if (total === 0) {
                  qty = 0;
                }
                else if (total > 0) {
                  checkQty = total - this.AllProductLocationList[item].Quantity;
                  if (checkQty >= 0) {
                    total = checkQty;
                    qty = this.AllProductLocationList[item].Quantity;
                  }
                  else {
                    qty = total;
                    total = 0;
                  }
                }
              } else {
                qty = 0;
              }
            }
          }
          else if (this.isLocationChangedByField) {
            if (!this.AllProductLocationList[item].LevelID) {
              location = this.productLocations.filter(x =>
                x.NonTrackableProductsLocationID === this.AllProductLocationList[item].ID).shift();
            } else {
              location = this.productLocations.filter(x => x.LevelID === this.AllProductLocationList[item].LevelID).shift();
            }
            if (location != null) {
              this.AllProductLocationList[item].selectedProductQuantity = location.Quantity;
            } else {
              this.AllProductLocationList[item].selectedProductQuantity = 0;
            }

          }
          else {
            if (this.AllProductLocationList[item].Quantity != null) {
              if (total === 0) {
                this.AllProductLocationList[item].selectedProductQuantity = 0;
              }
              else if (total > 0) {
                checkQty = total - this.AllProductLocationList[item].Quantity;
                if (checkQty >= 0) {
                  total = checkQty;
                  this.AllProductLocationList[item].selectedProductQuantity = this.AllProductLocationList[item].Quantity;
                }
                else {
                  this.AllProductLocationList[item].selectedProductQuantity = total;
                  total = 0;
                }
              }
            }
            else {
              this.AllProductLocationList[item].selectedProductQuantity = 0;
            }
          }
        }

        if (this.AllProductLocationList.length !== 0) {
          if (this.isAdded === 'false' && this.autoAssignLocationWhenProduct) {
            this.saveLocations();
          }
        }
      }
      else {
        console.log('internal serve Error', response);
      }

    });

  }
  onChangeSelectedProductQuantity() {


  }
  saveLocations() {

    let id = 0;
    let levelID = 0;
    let quantity = 0;
    let location;
    const variantID = this.selectedProduct.value;
    let dd;
    let loc;
    let indexno;
    let locationName;

    // for (let i = 0; i < this.AllProductLocationList.length; i++) {
    for (const item of this.AllProductLocationList) {
      id = item.ID;
      levelID = item.LevelID;
      quantity = item.selectedProductQuantity;

      locationName = item.Location;
      location = {
        NonTrackableProductsLocationID: id,
        LevelID: (levelID == null) ? null : levelID,
        Quantity: quantity,
        locationName: `${locationName}`,
      };

      if (this.isAdded === 'true') {
        dd = this.details.filter(x => x.ProductVariantID === variantID).shift();

        loc = dd.SaleDetailNonTrackableLocations.filter(x =>
          x.NonTrackableProductsLocationID === location.NonTrackableProductsLocationID && x.LevelID === location.LevelID).shift();
        // tslint:disable-next-line: deprecation
        if (!isNullOrUndefined(loc)) {
          // if (loc !== null  || '' + loc !== undefined || loc !== 'undefined' ) {
          loc.Quantity = location.Quantity;
        }
        else {
          dd.SaleDetailNonTrackableLocations.push(location);
        }

        if (location.Quantity < 0) {
          indexno = dd.SaleDetailNonTrackableLocations.indexOf(x =>
            x.NonTrackableProductsLocationID === location.NonTrackableProductsLocationID && x.LevelID === location.LevelID);
          dd.SaleDetailNonTrackableLocations.splice(indexno, 1);
        }
      }
      else {
        loc = this.productLocations.filter(x =>
          x.NonTrackableProductsLocationID === location.NonTrackableProductsLocationID && x.LevelID === location.LevelID).shift();
        // tslint:disable-next-line: deprecation
        if (!isNullOrUndefined(loc)) {
          // if (loc != null || '' + loc !== undefined || loc !== 'undefined') {
          loc.Quantity = location.Quantity;
        } else {
          this.productLocations.push(location);
        }

        // if(location.Quantity < 0){
        //     indexno = this.productLocations.indexOf(x=>
        // x.NonTrackableProductsLocationID == location.NonTrackableProductsLocationID && x.LevelID == location.LevelID);
        //     addedProductLocations.splice(indexno, 1);
        // }
      }
    }
  }
}
