export class ExpenseWage {
    ID: number;
    ExpenseTypeID?: number;
    ExpenseType: string;
    UserID?: number;
    User: string;
    dAmount?: number;
    dAmountString: string;
    Description: string;
    CreatedAt?:Date;
    CreatedAtString?: string;
    UpdatedAtString: string;
    UpdatedAt?: Date;
    CreatedByUserID?: number;
    IsActive?: boolean;
    CashRegisterHistoryID?: number;
    UpdatePermission: string;
    
}

