import { ClientModel } from "./ClientModel"
import { IImageModel } from "./ImageModel"

export class CustomerModel extends ClientModel{
    IsOrderCreater?:boolean;
    CustomerID:number;
    FirstName:string;
    CreatedAtForCustomer?:Date;
    UpdatedAtForCustomer?:Date;
    CreatedByUserIDForCustomer?:number;
    IsActiveForCustomer?:boolean;
    IsActive:boolean;
    DiscountGroupID?:number;
    DiscountGroup:string;
    DeliveryPersonID?:number;
    CustomerDataButton:string;
    CurrentBalance?:number;
    CurrentBalanceString:string;
    PhoneNo :string;
    customerEmail:string;
    City:string;
    Address:string;
    ShippingMethodID:number;
    Attachments :IImageModel;
}

