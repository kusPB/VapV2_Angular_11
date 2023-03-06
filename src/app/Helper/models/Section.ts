export class Section {
    ID: number;
    WareHouseID?: number;
    WareHouse: string;
    ZoneID?: number;
    Zone: string;
    Name: string;
    Description: string;
    CreatedAt?:Date;
    UpdatedAt?: Date;
    CreatedByUserID?: number;
    IsActive?: boolean;
    UpdatePermission: string;
}
