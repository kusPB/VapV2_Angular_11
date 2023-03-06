import { RowGroupTypeEnum } from "../Enum/row-group-type.enum ";

export interface GenericMenuItems {
    label: string;
    icon: string;
    dependedProperty: string;
    permission?:string;
    permissionDisplayProperty?:string;
  }
  export interface RowGroup {
    property: string;
    enableRowGroup: boolean;
    propertyType: RowGroupTypeEnum;
  }


