import { SaleDetailModel } from "./SaleDetailModel";

export class SaleModel{

    ID:number;
    CustomerID?:number;
    SaleDate?:Date;
    DueDate?:Date;

    PaymentModeID?:number;
    dDiscountPercentage?:number;
    dDiscountValue?:number;
    dTotalSaleValue?:number;
    dTotalPaidValue?:number;
    dDiscountValueString:string;
    dTotalSaleValueString:string;
    dTotalPaidValueString:string;
    ReturnedTyped?:number;
    IsReturned?:boolean;
    IsOnlineOrder?:boolean;
    sRemarks:string;
    CreatedAt?:Date;
    UpdatedAt?:Date;
    CreatedByUserID?:number;
    dtDate?:Date;

    CreatedAtString:string;

    CashRegisterHistoryID?:number;
    OutletID?:number;
    CashRegister:string;
    Outlet:string;
    IsAssignedToDeliveryPerson?:boolean;

    Customer:string;
    PaymentMode:string;
    isReturnVisible:string;
    SaleDetails:SaleDetailModel[];
    IsInvoiceCreated?:boolean;
    IsTraceable?:boolean;
    IsRefundable?:boolean;
    IsShipped?:boolean;
    PaymentConditionID?:number;
    PaymentCondition:string;
    DeliveredToID?:number;
    DeliveredTo:string;
    TypeID?:number;
    Type:string;
    ShippingMethodID?:number;
    ShippingCost?:number;
    ShippingMethod:string;
    SaleInvoiceNo:string;
    DeliveryAddressID?:number;
    SlipUrl:string;
    InvoiceAddressID?:number;
    InvoiceAddress:string;

    DeliveryAddress:string;
    isInvoiceSelected?:boolean;
    


}


