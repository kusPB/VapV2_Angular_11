import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TrackableCodeDetailModel } from 'src/app/Helper/models/TrackableCodeDetailModel';

@Component({
  selector: 'app-selected-product-trackables',
  templateUrl: './selected-product-trackables.component.html',
  styleUrls: ['./selected-product-trackables.component.scss']
})
export class SelectedProductTrackablesComponent implements OnInit {
  AllProductTrackablesList: TrackableCodeDetailModel[];
  first = 0;
  rows = 25;
  totalRecords = 0;
  OutleId: any;
  dataAfterRemove: any;
  @Input() selectedTrackables: any;
  @Input() details: any[];
  @Input() selectedProduct: any;
  @Input() currentQuantity: any;
  @Input() productTrackables: any[];
  @Output() onRemoveSelectedTrackable = new EventEmitter<{ dataAfterRemove: any }>();
  constructor() { }

  ngOnInit(): void {
    this.AllProductTrackablesList = this.selectedTrackables;
  }

  RemoveSelectedTrackable(trackableCode: any) {
    let removed = false;
    if (this.details.length > 0) {

      const selectedtrackables = this.details.filter(x => x.ProductVariantID === this.selectedProduct.value).shift();
      if (!selectedtrackables) {
        const i = selectedtrackables.TrackableProductsSaleDetails.findIndex((obj => obj.TrackableCode === trackableCode));
        if (i != null) {
          selectedtrackables.TrackableProductsSaleDetails.splice(i, 1);
          removed = true;
        }

        if (removed) {

          const detail = {
            DetailsID: selectedtrackables.DetailsID,
            ProductVariantID: selectedtrackables.ProductVariantID,
            TrackableProductsSaleDetails: selectedtrackables.TrackableProductsSaleDetails
          };

          const detailsIndex = this.details.findIndex(x => x.ProductVariantID === this.selectedProduct.value);
          this.details[detailsIndex] = detail;

          // let curentQuantity = this.currentQuantity;

          // this.currentQuantity = curentQuantity - 1;
          // this.dataAfterRemove.currentQuantity = this.currentQuantity;
          this.dataAfterRemove.details = this.details;
          this.onRemoveSelectedTrackable.emit({ dataAfterRemove: this.dataAfterRemove });

          // onCartFieldsChange(selectedRowForProductSelectionID, true);

          // openProductTrackableDetailsDialog(rowID);
          // refreshSelectedProductTrackables(rowID);
          // notiealertsuccess("Trackable code removed from selected product");
        }
        else {
          // notiealerterror("No trackable code found to remove for this product");
        }
      }
      else {

      }
    } else {
      for (let i = 0; i < this.productTrackables.length; i++) {
        if (this.productTrackables[i].TrackableCode === trackableCode) {
          this.productTrackables.splice(i, 1);
          removed = true;
          break;
        }
      }

      if (removed) {
        // let curentQuantity = this.currentQuantity;

        // this.currentQuantity = curentQuantity - 1;
        // this.dataAfterRemove.currentQuantity = this.currentQuantity;
        this.dataAfterRemove.trackables = [];
        this.dataAfterRemove.trackables = this.productTrackables;
        this.onRemoveSelectedTrackable.emit({ dataAfterRemove: this.dataAfterRemove });
        // onCartFieldsChange(selectedRowForProductSelectionID, true);

        // openProductTrackableDetailsDialog(rowID);
        // refreshSelectedProductTrackables(rowID);
        // notiealertsuccess("Trackable code removed from selected product");
      }
      else {
        // notiealerterror("No trackable code found to remove for this product");
      }
    }


  }



}
