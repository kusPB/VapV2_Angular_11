export class GetProductStockHistoryRequest{
    constructor(
        public  ProductID?: number,
        public  ProductVariantID?: number,
        public  OutletID?: number,
        public  ToDate?: string,
        public  FromDate?: string,
        public  PageSize?: number,
        public  PageNo?: number,
        public  IsGetAll?: boolean,
        public  IsAllProduct?: boolean,
        public  DepartmentID?: number,
        public  ClassificationID?: number,
        public  Search ?: string,
        public  CategoryID?: number,
        public  SubCategoryID?: number,
    ){}
}
