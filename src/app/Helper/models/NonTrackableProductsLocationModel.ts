export class NonTrackableProductsLocationModel{

    ID:number;
    ProductID?:number;
    ProductVariantID?:number;
    LevelID?:number;
    Product:string;
    ProductVariant:string;
    Location:string;
    Image:string;
    Barcode:string;
    ArticalNo:string;
    Quantity?:number;
    IsActive?:boolean;
    CreatedByUserID?:number;
    productChecked:boolean;

    selectedProductQuantity:number;

}
