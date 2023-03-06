import { IImageModel } from "./ImageModel";

export class UserModel {
    Address: string;
    CreatedAt: Date;
    EmailAddress: string;
    FirstName: string;
    ID: number;
    Image: string;
    ImageStatus: string;
    IsActive: boolean;
    IsDeliveryPerson: boolean;
    Language: string;
    LastName: string;
    Outlet: string;
    OutletID: number;
    ParentUserID: number;
    CashRegisterID: number;
    AttachedImage?: IImageModel;
    PassResetterCode: string;
    Password: string;
    PhoneNo: string;
    RelatedCustomerID: number;
    Role: string;
    RoleID: number;
    UpdatePasswordPermission: boolean;
    UpdatePermission: boolean;
    UpdatedAt: Date;
    UpdatedByUserID: number;
    UserName: string;
    IsReseller: boolean;
}

