export class TrackableProductLocationModel {
    TrackableForShoppingID:number;
    ProductID?:number;
    ProductVariantID?:number;

    Product:string;
    ProductVariant:string;
    TrackableCode:string;
    Location:string;
    Image:string;
    Barcode:string;
    ArticalNo:string;

    IsForHold?:boolean;
    LevelID?:number;
    productChecked:boolean;
}
