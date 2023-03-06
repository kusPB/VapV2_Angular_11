export class RoleActionModel {
    ID: number;
    RoleID?: number;
    ActionID?: number;
    CreatedAt?:Date;
    UpdatedAt?: Date;
    CreatedByUserID?: number;
    IsActive?: boolean;
    Role: string;
    Action: string;
    UpdatePermission: string;
}
