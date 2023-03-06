export class Zone {
    ID: number;
    WareHouseID?: number;
    Name: string;
    WareHouse: string;
    Description: string;
    CreatedAt?:Date;
    UpdatedAt?: Date;
    CreatedByUserID?: number;
    IsActive?: boolean;
    UpdatePermission: string;
}
