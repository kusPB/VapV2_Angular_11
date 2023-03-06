import { NonTrackableStockLocationItem } from "./NonTrackableStockLocationItem";

export class AssignNonTrackableStockToOutletRequest {

    ProductID : number;
    ProductVariantID : number;
    OutletID : number;
    Quantity : number;
    CreatedByUserID : number;
    NonTrackableStockLocationItemList :NonTrackableStockLocationItem[];
}