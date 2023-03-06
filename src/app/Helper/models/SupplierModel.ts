import { ClientModel } from "./ClientModel";
import { IImageModel } from './ImageModel';

export class SupplierModel extends ClientModel {
        public CreatedAtForSupplier :string;
        public CreatedByUserIDForSupplier :number;
        public CurrentBalance? :number;
        public CurrentBalanceString :string;
        public CustomerDataButton :string;
        public IsActive :boolean;
        public IsActiveForSupplier? :boolean;
        public SupplierID :number;
        public UpdatedAtForSupplier? :string;
        Attachments :IImageModel;
}