export class TrackableProductsSaleDetailModel{

    ID:number;
    ProductID?:number;
    ProductVariantID?:number;
    SaleDetailID?:number;
    TrackableCode:string;
    IsReturned?:boolean;

    CreatedAt?:Date;
    Product:string;
    ProductVariant:string;
}