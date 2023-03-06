export class FilterRequestModel{

    constructor(
        public ProductID ?: number ,
        public ProductVariantID ?: number ,
        public UserID ?: number ,
        public SubCategoryID ?: number ,
        public CashRegisterID ?: number ,
        public OutletID ?: number ,
        public CustomerID ?: number ,
        public ClientAddressID ?: number ,
       
        public BrandID ?: number ,
        public ColorID ?: number ,
        public QualityLabelID ?: number ,
       
        public BrandTypeID ?: number ,
        public SizeID ?: number ,
        public ConnecterTypeID?: number ,
        public CapacityID ?: number ,
        public PackagingID ?: number ,
        public PowerID ?: number ,
        public PrintID ?: number ,

        public  ToDate? : Date ,
        public  FromDate? : Date ,

        public  PageSize ?: number ,
        public  PageNo ?: number ,
        public  IsGetAll ?: boolean ,

        public  ByCustomer ?: boolean ,
        public  DayOfWeekID ?: number ,
        public AreaID ?: number ,
        public ID ?: number ,
        public  ByUser ?: boolean ,
        public  IsForGraph ?: boolean ,
        public  IsAppRequest ?: boolean ,
        public  Customer ?: string ,
        public  Product ?: string ,
        public  IsReceived ?: boolean ,
        public  IsIncomingOrder ?: boolean ,


        public  PermissionLevel ?: number ,
        public  Type ?: number ,

        public  IsAproved ?: boolean ,
        public  IsPurchased ?: boolean ,
        public  EmailAddress ?: string ,
        public  ContactNo ?: string ,
        public  ColumnName ?:string,
        public SeriesID ?: number ,
        public  IsImageAttached ?: boolean ,
        public ResellerID ?: number ,
        public  IsReseller ?: boolean ,
        public  Status ?: number ,

     ){}
}

// export class SearchColumnFilter
// {
//     constructor(
//     public ColumnName ?: string,
//     public Value ?: string,
//     public MatchMode ?: string,
//     ){}
// }