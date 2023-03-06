import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { TrackableCodeDetailModel } from 'src/app/Helper/models/TrackableCodeDetailModel';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { StorageService } from 'src/app/shared/services/storage.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

@Component({
  selector: 'app-product-trackables',
  templateUrl: './product-trackables.component.html',
  styleUrls: ['./product-trackables.component.scss']
})
export class ProductTrackablesComponent implements OnInit, OnDestroy {
  AllProductTracablesList: TrackableCodeDetailModel[];
  usermodel: UserModel;
  first = 0;
  rows = 25;
  totalRecords = 0;
  OutleId: any;
  @Input() selectedProduct: any;
  @Input() productTrackableList: any;
  trackableCode: string;

  @Output() onTrackableSelectValue = new EventEmitter<{ trackableCode: string }>();
  constructor(private apiService: vaplongapi, private storageService: StorageService) {
    this.usermodel = this.storageService.getItem('UserModel');;
    this.OutleId = this.usermodel.OutletID;
  }

  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    this.AllProductTracablesList = this.productTrackableList;
    // this.GetProductTrackablesList(); //Bind Product Trackables
  }
  GetProductTrackablesList() {

    const id = {
      ProductVariantID: this.selectedProduct.value,
      OutletID: this.OutleId
    };

    this.apiService.GetProductTrackablesById(id).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'Success') {
        this.AllProductTracablesList = response.TrackableCodesDetailList;
      }
      else {
        console.log('internal serve Error', response);
      }

    });



  }

  SelectRow(productTrackable: any) {
    this.onTrackableSelectValue.emit({ trackableCode: productTrackable.TrackableCode });
  }

}
