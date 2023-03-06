import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { UserModel } from '../../Helper/models/UserModel';
import { vaplongapi } from '../../Service/vaplongapi.service';
import { ProductIncomingQuantityModel } from '../../Helper/models/ProductIncomingQuantityModel';
import { StorageService } from 'src/app/shared/services/storage.service';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
import { Columns } from 'src/app/shared/Model/columns.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { PurchasePermissionEnum } from 'src/app/shared/constant/purchase-permission';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { customSearchFn } from 'src/app/shared/constant/product-search';

@Component({
  selector: 'app-addincomingquantity-dialog',
  templateUrl: './addincomingquantity-dialog.component.html',
  styleUrls: ['./addincomingquantity-dialog.component.scss']
})
export class AddIncomingQuantityDialogComponent implements OnInit, OnDestroy {

  @Input() ProductID: number;
  @Input() ExistedQuantity: number;
  @Input() ProductName: string;
  @Output() ReturnCall = new EventEmitter<{ IsDone: boolean }>();

  Remarks = '';
  Quantity = 1;

  usermodel: UserModel;

  displayOrderByDialog = false;
  IsSpinner = false;
  AllSupplierList: any[] = [];
  totalRecords = 0;
  globalFilterFields = ['Supplier'];
  rowsPerPageOptions = [25, 50, 100, 200, 500, 1000, 5000];
  dataFunc: any = customSearchFn;

  columns: Columns[] = [

    { field: 'FullName', header: 'Supplier', sorting: 'FullName', placeholder: '', },
    { field: 'sCompanyName', header: 'Company', sorting: 'sCompanyName', placeholder: '' },
    { field: 'Address', header: 'Address', sorting: 'Address', placeholder: '', },
    { field: 'PhoneNo', header: 'Phone', sorting: 'PhoneNo', placeholder: '', },
    {
      field: 'CurrentBalance', header: 'CurrentBalance', sorting: 'CurrentBalance', placeholder: '', permission:PurchasePermissionEnum.CurrentBalanceColumninPurchaseCreate,
      type: TableColumnEnum.CURRENCY_SYMBOL
    },
  ];
  selectedOrderBy: any;
  filteredOrderBy: any[];
  orderByDropdown: any[];
  constructor(
    private apiService: vaplongapi, private storageService: StorageService,
    private notificationService: NotificationService) {

  }
  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');
    this.Quantity = this.ExistedQuantity;
    this.GetSuppliersDropDownLists(); // Bind customers in order by and deliver to dropdownlist


  }
  ngOnDestroy(): void {
  }
  GetSuppliersDropDownLists() {
    this.IsSpinner = true;
    this.orderByDropdown = [];
    this.apiService.GetAllSupplier().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        response.AllSupplierList = response.AllSupplierList.filter(x => x.IsActiveForSupplier === true);
        for (const item of response.AllSupplierList) {
          item.FirstName = item.FirstName != null ? item.FirstName : '';
          item.LastName = item.LastName != null ? item.LastName : '';
          item.FullName = item.FirstName + ' ' + item.LastName;
          this.orderByDropdown.push({
            value: item.SupplierID,
            label: item.sCompanyName,
          });
        }
        if (this.orderByDropdown.length > 0) {
          this.filteredOrderBy = this.orderByDropdown;
          this.IsSpinner = false;
        }
        this.AllSupplierList = response.AllSupplierList;
        this.totalRecords = response.AllSupplierList.length;
      }
      else {
        this.IsSpinner = false;
        this.notificationService.notify(NotificationEnum.ERROR, 'error', 'internal serve Error');
        // console.log('internal serve Error', response);
      }
    });
  }
  OpenOrderByDialog() {
    this.displayOrderByDialog = true;
  }
  CreateOrder() // Create IncomingQuantity Method To Communicate API
  {
    const incomingQuantity = new ProductIncomingQuantityModel();
    incomingQuantity.ProductID = this.ProductID;
    incomingQuantity.IsReceived = false;
    incomingQuantity.Quantity = Number(this.Quantity);
    incomingQuantity.UpdatedByID = this.usermodel.ID;
    incomingQuantity.SupplierID = this.selectedOrderBy.value;
    this.apiService.AddUpdateProductIncomingQuantity(incomingQuantity).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'quantity has been updated successfully.');
        this.ReturnCall.emit({ IsDone: true });
      }
      else {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', response.ResponseText);
        this.ReturnCall.emit({ IsDone: true });

      }
    },
    );
  }
  clearData(){
    this.Remarks = '';
    this.Quantity = 1;
  }

  // emit event of order by popup
  SelectRowOrderBy(orderBy: any) {
    this.displayOrderByDialog = false;
    this.selectedOrderBy = { value: orderBy.SupplierID, label: orderBy.sCompanyName };
  }
}
