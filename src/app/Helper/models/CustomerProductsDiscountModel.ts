export class CustomerProductsDiscountModel {

    ID:number;
    ProductID?:number;
    Product:string;
    CustomerID?:number;
    Customer:string;
    bShowForShop?:boolean;
    nMaxShopQuantity?:number;
    nDailyQuota?:number;
    nMonthlyQuota?:number;
    fMinDiscPrec?:number;
    fMaxDiscPerc?:number;
    CreatedByUserID?:number;
    CreatedAt:Date;
    UpdatedAt:Date;
    IsActive:boolean;
    ActiveDiscountTypeID?:number;
    ActiveDiscountType:string;

    UpdatePermission:string;
}