export class Expense {
    ID: number;
    ExpenseTypeID?: number;
    ExpenseType: string;
    ExpenseDate?:Date;
    dAmount?: number;
    dAmountString: string;
    Description: string;
    CreatedAt?:Date;
    CreatedAtString?: string;
    UpdatedAt?: Date;
    CreatedByUserID?: number;
    IsActive?: boolean;
    VoucherCode?: number;
    CashRegisterHistoryID?: number;
    UpdatePermission: string;
    
}
