import { TrackableProductsSaleDetailModel } from "./TrackableProductsSaleDetailModel";
import { SaleDetailNonTrackableLocationModel } from "./SaleDetailNonTrackableLocationModel";

export class SaleDetailModel{

        ID:number;
        SaleID?:number;
        ProductID?:number;
        ProductVariantID?:number;
        Quantity?:number;
        TaxAmount?:number; //Tax amount should be cauclated each product by number of its quantity
        dTotalValue?:number; //Sum of price of All products selected (discount and tax is not added yet)
        dTotalDiscount?:number; //Sum of all discount percentage of single product -> number of quantity
        ReturnedTyped?:number;
        IsReturned?:boolean;
        ReturnedQuantity?:number;

        TaxPer?:number; // Tax percentage of single product
        dTotalUnitValue?:number; //price of single product selected (discount and tax is not added yet)
        dDiscountPer?:number; // Discount percentage of single product

        Product:string;
        ProductVariant:string;
        ProductPrice?:number;
        ProductPriceString:string;
        isReturnProductChecked:boolean;
        ProductVarientBarCode:string;

        TrackableProductsSaleDetails:TrackableProductsSaleDetailModel[];
        SaleDetailNonTrackableLocations:SaleDetailNonTrackableLocationModel[];
        dTotalAmount?:number; //grand total not included in model
        OriginalQuantity?:number;

}