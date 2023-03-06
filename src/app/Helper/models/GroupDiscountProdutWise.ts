export class GroupDiscountProductWise {
    ID: number;
    DiscountGroupID?: number;
    DiscountGroup: string;
    Product: string;
    ProductID?: number;
    CreatedAt?: Date;
    UpdatedAt?: Date;
    CreatedByUserID?: number;
    IsActive?: boolean;
    MinDiscountPerc?: number;
    MaxDiscountPerc?: number;
    UpdatePermission: string;
}
