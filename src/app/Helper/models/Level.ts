export class Level {
    ID: number;
    WareHouseID?: number;
    WareHouse: string;
    ZoneID?: number;
    Zone: string;
    SectionID?: number;
    Section: string;
    Name: string;
    Description: string;
    Location: string;
    CreatedAt?:Date;
    UpdatedAt?: Date;
    CreatedByUserID?: number;
    IsActive?: boolean;
    UpdatePermission: string;
}

