export class ShipmentModel {

    ID: number;
    TrackingCode: string;
    TrackingWebsite: string;
    sRemarks: string;
    CreatedAt: Date;
    UpdatedAt: Date;
    CreatedByUserID: number;
    dtDate: Date;
    dtDateString: string;
    OutletID: number;
    ShippingMethodID: number;
    IsActive: Boolean
    IsReceived: Boolean;
    ToOutletID: number;
    ReceivedDate: Date;
    Outlet: string;
    Outlet1: string;
    ShippingMethod: string;
    ShipmentDetails: [ShipmentDetailModel]
    // None.

    //     ShipmentDocuments
    // Collection of ShipmentDocumentModel
    // None.

}

export class ShipmentDetailModel {
    ArticalNo: string;
    CurrencyID: number;
    ID: number;
    IsTrackable: false;
    Price: number;
    Product: string;
    ProductID: number;
    ProductModel: string;
    ProductVariant: string;
    ProductVariantID: number;
    Quantity: number;
    ReceivedQuantity: number;
    ShipmentID: number;
}

export class ShipmentDocuments {
    ID: number;
    sDocument: string;
    ShipmentID: number;
    IsActive: boolean;
    CreatedAt: Date;
}