export class NonTrackableStockDetailsItem {
    NonTrackableProductsLocationID: number;
    LevelID?: number;
    ProductID?: number;
    ProductVariantID?: number;
    Product: string;
    ProductVariant: string;
    Location: string;
    Quantity?: number;
    //Not included in the model
    
    SelectedQuantity: number;
    isProductSelected: boolean;
    isQuantityChangeable: boolean;
    
}
