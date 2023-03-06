export class TrackableStockDetailsItem {
    TrackableForShoppingID: number;
    StockHistoryID?: number;
    OutletStockHistoryID?: number;
    LevelID?: number;
    ProductID?: number;
    ProductVariantID?: number;
    Product: string;
    ProductVariant: string;
    TrackableCode: string;
    Location: string;

    //Not included in the model
    
    SelectedQuantity: number;
    isProductSelected: boolean;
    isQuantityChangeable: boolean;
    
}
