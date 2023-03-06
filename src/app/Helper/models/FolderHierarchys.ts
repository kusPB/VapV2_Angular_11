import { IImageModel } from './ImageModel';

export class FolderHierarchys {

  constructor(
    public RequestedUserID?: number,
    public ID?: number,
    public Name?: string,
    public Description?: string,
    public Images?: string,
    public ParentID?: number,
    public IsActive?: boolean,
    public AttachedImages?: IImageModel[]
  ) {
  }
}
