
export class CommonUseForEveryDropDown{
  constructor(
    public ID?: any,
    public Name?: any,
  ){}
}

export class ProductModelDropDownData{

    DropDownData?: [{ID?: number, Name?: string }];
    ResponseCode: number;
    ResponseText?: string;
}

export class CommonUseNameCode{
    code?: any;
    name?: any;
}


export class UpdateProductQualityStatus{

  constructor(
    public ID?: number,
    public Status?: boolean,
    public UpdatedByUserID?: number,
    ) {
  }
}

export class UpdateProductVariantStatus{

  constructor(
    public ID?: number,
    public Status?: boolean,
    public UpdatedByUserID?: number,
    ) {
  }
}
