export class ProductIncomingQuantityModel {
  ID: number;
  IsReceived?: boolean;
  Supplier: string;
  SupplierID?: number;
  Product: string;
  ProductID?: number;
  UpdatedAt?: Date;
  UpdatedAtString: string;
  UpdatedBy: string;
  UpdatedByID?: number;
  Quantity?: number;
  ReceivedQuantity?:number;
}
