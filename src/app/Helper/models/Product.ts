export class AllProductModel {
  // allProductFromAPI: AllProductList;
  constructor(
    public ResponseCode?: number,
    public ResponseText?: string,
    // tslint:disable-next-line: no-shadowed-variable
    public AllProductList?: Array<AllProductList>
  ) { }
}

export class AllProductList {
  constructor(
    public ID?: number,
    public Name?: string,
    public Description?: string,
    public ClassificationID?: number,
    public DepartmentID?: number,
    public CategoryID?: number,
    public SubCategoryID?: number,
    public SubCategory?: string,
    public Barcode?: string,
    public BLabel?: string,
    public ArticalNo?: string,
    public PurchasePrice?: number,
    public SalePrice?: number,
    public ShopSalePrice?: string, // change number to string
    public ShopAdvicePrice?: number,
    public bShopAllowDiscount?: boolean,
    public MaxDiscPer?: number,
    public MinDiscPer?: number,
    public Image?: string,
    public ImageStatus?: number,
    public DisplayOrder?: number,
    public bShowInShop?: boolean,
    public nMaxShop?: number,
    public Tags?: string,
    public IsTrackable?: boolean,
    public IsActive?: boolean,
    public TaxTypeID?: number,
    public TaxType?: string,
    public QualityID?: number,
    public Quality?: string,
    public StandardTaxPercentage?: number,
    public IsLuxuryTax?: boolean,
    public LuxuryTaxValue?: number,
    public ActiveFrom?: Date,
    public ActiveTo?: Date,
    public ReorderPoint?: number,
    public MaximumStock?: number,
    public CreatedAt?: Date,
    public UpdatedAt?: Date,
    public CreatedByUserID?: number,
    public UpdatePermission?: string,
    public PurchasePriceString?: string,
    public SalePriceString?: string,
    public ShopAdvicePriceString?: string,
    public MeasuringUnitID?: number,
    public MeasuringUnit?: string,
    public DisplayImage ?: string,
    // tslint:disable-next-line: no-shadowed-variable
    public ProductCategoryDetails?: Array<ProductCategoryDetails>,
    public AssignLocation?: string,
    public AvailibleQuantity?: number,

    public SizeID?: number,
    public ConnecterTypeID?: number,
    public CapacityID?: number,
    public PackagingID?: number,
    public PowerID?: number,
    public PrintID?: number,
    public QRCode?: string,

    public Quantity?: number,
    public ReceivedQuantity?: number,
    public RemainingQuantity?: number,
    public IsObselete?: boolean,
    public NotIsObselete?: boolean,

  ) { }
}


export class ProductCategoryDetails {
  constructor(
    public ID?: number,
    public Type?: number,
    public CategoryID?: number,
    public ShopCategoryID?: string,
    public Name?: string,
  ) { }
}


// alread used this  but  next code used below model
export class ProductVariantModel {
  AllProductVariantList: [
    {
      ID: number,
      ProductImage: string,
      ProductID: number,
      Product: string,
      SizeID: number,
      Size: string,
      ColorID: number,
      Color: string,
      Price: number,
      PurchasePrice: number,
      SalePrice: number,
      PriceString: string,
      RemainingStock: number,
      HoldStock: number,
      CreatedAt: Date,
      UpdatedAt: Date,
      CreatedByUserID: number,
      IsActive: boolean,
      IsAddedToShop: boolean,
      Barcode: string,
      BLabel: string,
      ArticalNo: string,
      MeasuringUnit: string,
    }
  ];
}


export class ProductVariant {
  constructor(
    public ID?: number,
    public ProductImage?: string,
    public ProductID?: number,
    public Product?: string,
    public SizeID?: number,
    public Size?: string,
    public ColorID?: number,
    public Color?: string,
    public Price?: number,
    public PurchasePrice?: number,
    public SalePrice?: number,
    public PriceString?: string,
    public RemainingStock?: number,
    public HoldStock?: number,
    public CreatedAt?: Date,
    public UpdatedAt?: Date,
    public CreatedByUserID?: number,
    public IsActive?: boolean,
    public IsAddedToShop?: boolean,
    public Barcode?: string,
    public BLabel?: string,
    public ArticalNo?: string,
    public MeasuringUnit?: string,
    public minDiscValue?: number,
    public maxDiscValue?: number,
    public maxDisc?: number,
    public minDisc?: number,
    public QualityLabel?: string,

  ) { }
}



export interface IProductModel {
  ID?: number;
  Name?: string;
  Description?: string;
  ClassificationID?: number;
  DepartmentID?: number;
  CategoryID?: number;
  SubCategoryID?: number;
  SubCategory?: string;
  Barcode?: string;
  BLabel?: string;
  ArticalNo?: string;
  PurchasePrice?: number;
  SalePrice?: number;
  ShopSalePrice?: string; // change number to string
  ShopAdvicePrice?: number;
  bShopAllowDiscount?: boolean;
  MaxDiscPer?: number;
  MinDiscPer?: number;
  Image?: string;
  ImageStatus?: number;
  DisplayOrder?: number;
  bShowInShop?: boolean;
  bShowForReseller?: boolean;
  IsAutoAddToWishlist?: boolean;
  nMaxShop?: number;
  Tags?: string;
  IsTrackable?: boolean;
  IsActive?: boolean;
  TaxTypeID?: number;
  TaxType?: string;
  QualityID?: number;
  Quality?: string;
  StandardTaxPercentage?: number;
  IsLuxuryTax?: boolean;
  LuxuryTaxValue?: number;
  ActiveFrom?: Date;
  ActiveTo?: Date;
  ReorderPoint?: number;
  ReorderQuantity?: number;
  ReservedQuantity?: number;
  MaximumStock?: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  CreatedByUserID?: number;
  UpdatePermission?: string;
  PurchasePriceString?: string;
  SalePriceString?: string;
  ShopAdvicePriceString?: string;
  MeasuringUnitID?: number;
  MeasuringUnit?: string;
  ColorID?: number;
  TypeID?: number;
  Color?: string;
  BrandID?: number;
  Brand?: string;
  BrandTypeID?: number;
  BrandType?: string;
  ModelID?: number;
  Model?: string;
  SeriesID?: number;
  Series?: string;
  ProductCategoryDetails?: Array<ProductCategoryDetails>;
  SizeID?: number,
  ConnecterTypeID?: number,
  CapacityID?: number,
  PackagingID?: number,
  PowerID?: number,
  PrintID?: number,
  QRCode?: string,
  IsObselete?: boolean;


}