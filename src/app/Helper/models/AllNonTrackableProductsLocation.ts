export class AllNonTrackableProductsLocationModelList{

    constructor(
            public ID?: number,
            public ProductID ?: number,
            public ProductVariantID?: number,
            public LevelID?: number,
            public Product?: string,
            public ProductVariant?: string,
            public Location?: string,
            public Image?: string,
            public  Barcode?: string,
            public ArticalNo?: string,
            public Quantity?: number,
            public IsActive?: boolean,
            public CreatedByUserID?: Date,
            public productChecked?: boolean
      ) {
    }
}
