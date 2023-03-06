export class PurchaseModel {
    public OpenPurchaseID?: number;
    public CreatedAt?: Date;
    public CreatedByUserID?: number;
    public CurrentExchangeRate?: number;
    public dDiscountPercentage?: number;
    public dDiscountValue?: number;
    public dDiscountValueFC?: number;
    public dDiscountValueString: string;
    public dTotalPaidValue?: number;
    public dTotalPaidValueFC?: number;
    public dTotalPaidValueString: string;
    public dTotalPurchaseValue?: number;
    public dTotalPurchaseValueFC?: number;
    public dTotalPurchaseValueString: string;
    public DueDate?: Date;
    public DueDateString: string;
    public ExchangeRate: string;
    public ExchangeRateID?: number;
    public ID: number;
    public IsReceived?: boolean;
    public IsReturned?: boolean;
    public IsHoldPurchase?: boolean;

    public isReturnVisible: string;
    public Outlet: string;
    public OutletID?: number;
    public PaymentMode: string;
    public PaymentModeID?: number;
    public PurchaseDate?: Date;
    public PurchaseDateString: string;
    public PurchasesDetails: PurchaseDetailModel[]=[];
    public PurchaseTaxDetails: PurchaseTaxDetailModel;
    public ReturnedTyped?: number;
    public sRemarks: string;
    public StockHistories: StockHistoryModel[]=[];
    public SuppierInvoiceNo: string;
    public Supplier: string;
    public SupplierID?: number;
    public UpdatedAt?: Date;
}
export class PurchaseDetailModel {
    public Description: string;
    public dTotalAmount?: number;
    public dTotalAmountFC?: number;
    public dTotalAmountString: string;
    public dTotalDiscount?: number;
    public dTotalDiscountFC?: number;
    public dTotalDiscountValue?: number;
    public dTotalDiscountValueFC?: number;
    public dTotalDiscountValueString: string;
    public ID: number;
    public IsActive?: boolean;
    public IsReturned?: boolean;
    public isReturnProductChecked: boolean;
    public IsTrackableVisibility: string;
    public OriginalQuantity?: number;
    public Product: string;
    public ProductID?: number;
    public ProductPrice: number;
    public ProductPriceString: string;
    public ProductUnitPrice: number;
    public ProductUnitPriceString?: string;
    public ProductVariant: string;
    public ProductVariantID?: number;
    public PurchaseID?: number;
    public Quantity?: number;
    public ReturnedQuantity?: number;
    public ReturnedTyped?: number;
    public TaxAmount?: number;
    public TaxAmountFC?: number;
    public TaxAmountString: string;
    public  TrackableProductsPurchaseDetails: TrackableProductsPurchaseDetailModel[]=[];
}
export class TrackableProductsPurchaseDetailModel {
    public CreatedAt?: Date;
    public ID: number;
    public IsReturned?: boolean;
    public IsReturnedItem?: boolean;
    public Product: string;
    public ProductID?: number;
    public ProductVariant: string;
    public ProductVariantID?: number;
    public PurchaseDetailID?: number;
    public TrackableCode: string;
}
export class PurchaseTaxDetailModel {
    public CreatedAt?: number;
    public dTotalTaxAmount?: number;
    public ID: number;
    public IsWithHolding?: boolean;
    public PurchaseID: number;
}
export class StockHistoryModel {

    public By: string;
    public CreateAt?: Date;
    public HoldStock?: number;
    public ID: number;
    public IsActive?: boolean;
    public Product: string;
    public ProductID?: number;
    public ProductVariant: string;
    public ProductVariantID?: number;
    public PurchaseDate?: Date;
    public PurchaseDateString: string;
    public PurchaseID?: number;
    public PurchasePrice?: number;
    public PurchasePriceString: string;
    public RemainingStock?: number;
    public SalePrice?: number;
    public SalePriceString: string;
    public TotalStock?: number;
    public UpdatedAt?: Date;
}