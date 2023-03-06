export class DiscountGroup {
    ID: number;
    Name: string;
    Description: string;
    CreatedAt?:Date;
    UpdatedAt?: Date;
    CreatedByUserID?: number;
    IsActive?: boolean;
    UpdatePermission: string;
    ViewProductDiscountsPermission: string;
}
