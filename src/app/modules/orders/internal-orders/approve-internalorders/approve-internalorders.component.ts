import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { WishlistModel } from '../../../../Helper/models/WishlistModel';
import { vaplongapi } from '../../../../Service/vaplongapi.service';
import { FilterRequestModel } from '../../../../Helper/models/FilterRequestModel';
import { UpdateStatus } from '../../../../Helper/models/UpdateStatus';
import { UserModel } from '../../../../Helper/models/UserModel';

import { Columns } from 'src/app/shared/Model/columns.model';
import { RowGroupTypeEnum } from 'src/app/shared/Enum/row-group-type.enum ';
import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-approve-internalorders',
  templateUrl: './approve-internalorders.component.html',
  styleUrls: ['./approve-internalorders.component.scss']
})
export class ApproveInternalordersComponent implements OnInit, OnDestroy {

  @ViewChild('dt') table: Table;
  AllInternalOrderList: WishlistModel[] = [];
  selectedInternalOrder: WishlistModel;
  public internalOrder: WishlistModel;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedProductID = '';
  Quantity;
  Remarks;
  items: MenuItem[];
  ProductDropdown: SelectItem[];
  alwaysShowPaginator = true;
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  // last = 25;
  totalRecords = 0;

  usermodel: UserModel;

  displayDialog = false;
  DialogRemarks = '';

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Approve', icon: 'fas fa-check', dependedProperty: 'ID' },
    { label: 'Reject', icon: 'fas fa-ban', dependedProperty: 'ID' },
  ];

  rowGroup: RowGroup = {
    property: 'CreatedAtString',
    enableRowGroup: true,
    propertyType: RowGroupTypeEnum.STRING
  };

  columns: Columns[] = [
    { field: 'CreatedBy', header: 'Created By', sorting: 'CreatedBy', placeholder: '', translateCol: 'SSGENERIC.CREATEDBY' },
    { field: 'BLabel', header: 'Model', sorting: 'BLabel', placeholder: '', translateCol: 'SSGENERIC.MODEL' },
    { field: 'Barcode', header: 'EAN', sorting: 'Barcode', placeholder: '', translateCol: 'SSGENERIC.EAN' },
    { field: 'ProductVariant', header: 'Product', sorting: 'ProductVariant', placeholder: '', translateCol: 'SSGENERIC.PRODUCT' },
    { field: 'Quantity', header: 'Quantity', sorting: 'Quantity', placeholder: '', translateCol: 'SSGENERIC.QUANTITY' },
    {
      field: 'CreatedAt', header: 'CreatedAt', sorting: 'CreatedAt', placeholder: '', type: TableColumnEnum.DATE_FORMAT,
      translateCol: 'SSGENERIC.CREATEDAT'
    },
    { field: 'Outlet', header: 'Outlet', sorting: 'Outlet', placeholder: '', translateCol: 'SSGENERIC.OUTLET' },
    { field: 'Remarks', header: 'Remarks', sorting: '', placeholder: '', type: TableColumnEnum.REMARKS, translateCol: 'SSGENERIC.REMARKS' },

  ];

  globalFilterFields = ['CreatedBy', 'ProductVariantID', 'Barcode', 'ProductVariant', 'Quantity', 'CreatedAtString', 'Outlet'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];


  constructor(private apiService: vaplongapi, private storageService: StorageService) {

  }

  ngOnInit(): void {

    this.usermodel = this.storageService.getItem('UserModel');

    this.GetAllInternalOrderList(); // Get All Internal Order List On Page Load

  }
  ngOnDestroy(): void {

  }
  emitAction(event) {
    if (event.forLabel === 'Approve') {
      this.ApproveInternalOrder(event.selectedRowData);
    }
    else if (event.forLabel === 'Reject') {
      this.RejectInternalOrder(event.selectedRowData);
    }

  }
  GetAllInternalOrderList() // Get All Internal Method Get Data from Service
  {

    this.IsSpinner = true;
    const request = new FilterRequestModel();
    request.IsPurchased = false;
    request.IsAproved = false;
    if (this.usermodel.ID === 1) {
      request.IsGetAll = true;
    } else {
      request.ID = this.usermodel.ID;
    }

    this.apiService.GetAllInternalOrderList(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.AllInternalOrderList = response.Wishlists.filter(x => x.IsApproved === false);
        this.totalRecords = this.AllInternalOrderList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }
  ApproveInternalOrder(internalOrder: WishlistModel) {
    const request = new UpdateStatus();
    request.ID = internalOrder.ID;
    request.Status = true;
    request.UpdatedByUserID = this.usermodel.ID;

    this.apiService.UpdateWishlistStatusToApproved(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.GetAllInternalOrderList();

      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    });
  }
  RejectInternalOrder(internalOrder: WishlistModel) {
    const request = new UpdateStatus();
    request.ID = internalOrder.ID;
    request.Status = false;
    request.UpdatedByUserID = this.usermodel.ID;

    this.apiService.UpdateWishlistStatusToRejected(request).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.GetAllInternalOrderList();
      } else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    });
  }

  showDialog(event) {
    this.displayDialog = true;
    this.DialogRemarks = event.Remarks;
  }

}


