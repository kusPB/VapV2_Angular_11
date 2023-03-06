export class Department {
    ID: number;
    Name: string;
    Description: string;
    CreatedAt?:Date;
    UpdatedAt?: Date;
    CreatedByUserID?: number;
    IsActive?: boolean;
    ClassificationID?: number;
    Classification: string;
    UpdatePermission: string;
    
}
