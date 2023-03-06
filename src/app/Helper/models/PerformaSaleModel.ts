import { PerformaSaleDetailModel } from '../models/PerformaSaleDetailModel';

export class PerformaSaleModel
{
         CreatedAt ? :Date;
         CreatedByUserID ? :number;
         Customer :string;
         CustomerID ? :number;
         dDiscountPercentage ? :number;
         dDiscountValue ?:number;
         dDiscountValueString :string;
         DeliveredTo :string;
         DeliveredToID ?:number;
         dtDate ?:Date;
         dTotalSaleValue ?:number;
         dTotalSaleValueString :string;
         ID :number;
         IsInComingOrder ?:boolean;
         IsPerfomaInvoiceRequired ?:boolean;
         Outlet :string;
         OutletID ?:number;
          PaymentCondition ?:string;
         PaymentConditionID ?:number;
         PaymentMode ?:string;
         PaymentModeID ?:number;
         PerfomaSaleDetails :Array<PerformaSaleDetailModel> ;
         SaleDate ?:Date;
         ShippingCost ?:number;
         ShippingMethod :string;
         ShippingMethodID ?:number;
         sRemarks :string;
         Type :string;
         TypeID ?:number;
         UpdatedAt ?:Date;
         IsConvertedToSale?:boolean;
        ConvertedDate?:Date;
        SaleID?:Number ;
        bShowBtn?:boolean;
        bShowDeleteBtn?:boolean;
        bShowSaleDetailBtn?:boolean;
}