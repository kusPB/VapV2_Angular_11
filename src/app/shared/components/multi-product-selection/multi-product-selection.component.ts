import { Stock } from './../../../Helper/models/Stock';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { MenuItem } from 'primeng/api/menuitem';
import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems } from 'src/app/shared/Model/genric-menu-items.model';
import { TableColumnEnum } from '../../Enum/table-column.enum';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from '../../Enum/notification.enum';


@Component({
  selector: 'app-multi-product-selection',
  templateUrl: './multi-product-selection.component.html',
  styleUrls: ['./multi-product-selection.component.scss']
})
export class MultiProductSelectionComponent implements OnInit {
  @Input() data: any[] = [];
  columns: Columns[] = [];
  @Input('columnsData')
  set model(value: Columns[]) {
    this.columns = [...value];
    this.selectedColumns = [...value];
  }
  @Input() globalFilterFields: string;
  @Input() row: number = 25;
  @Output() emitMenuAction = new EventEmitter();
  @Output() emitSwitch = new EventEmitter();
  @Output() emitHref = new EventEmitter();
  @Output() emitHref2 = new EventEmitter();
  @Output() emitRemarks = new EventEmitter();
  @Output() emitRowClick = new EventEmitter();
  @Output() emitSelectedProduct = new EventEmitter();
  @Input() menuItems: GenericMenuItems[] = [];
  @Input() rowsPerPageOptions: number[] = [25, 50, 100]
  selectedColumns: Columns[] = [];
  totalRecords = 0;
  selectedStock: any = {};
  imageBasePath;
  imgSrc: any = '';
  items: MenuItem[] = [];
  displayImage = false;
  columnsType = TableColumnEnum;
  selectedProducts: any[] = [];
  displayDialog = false;
  DialogRemarks = '';
  mySearch: any;
  constructor(private apiService: vaplongapi, private notification: NotificationService) {
    this.imageBasePath = this.apiService.imageBasePath;
  }

  ngOnInit() {
    // this.items = [
    //   { label: 'Wishlist', icon: 'fas fa-shopping-cart', command: () => this.emitOutput('Wishlist', this.selectedStock) },
    // ];
  }
  emitOnRowClick(cols) {
    this.emitRowClick.emit(cols);

  }
  emitOutput(Property: string, selectedRow: any) {
    const obj = { forLabel: Property, selectedRowData: selectedRow };
    this.emitMenuAction.emit(obj);
    // this.selectedVariantIDforWishlist = ProductVariantID;
    // this.selectedProductNameforWishlist = Product;
    // this.isAddToWishlist = true;
  }
  addToTable() {
    // console.log(this.selectedProducts);
    if (this.selectedProducts.length > 10) {
      this.notification.notify(NotificationEnum.ERROR, 'Error', "Maximum 10 products allowed.")
      return;
    }

    this.emitSelectedProduct.emit(this.selectedProducts);
  }
  showMenuItems(event) {

    this.items = [];
    this.menuItems.forEach(x => {
      if (this.selectedStock[x.dependedProperty]) {
        const obj = { label: x.label, icon: x.icon, command: () => this.emitOutput(x.label, this.selectedStock) }
        this.items.push(obj);
      }
    })
    // this.items = this.menuItems;
  }
  emitInputSwitch(col) {
    this.emitSwitch.emit(col);
  }
  emitRedirection(col) {
    this.emitHref.emit(col);
  }
  emitRedirection2(col) {
    this.emitHref2.emit(col);
  }
  emitRemarkDialog(col) {
    this.emitRemarks.emit(col);
  }
  onShow() {
    this.items = [];
    this.items.forEach(element => {

    });
  }

  popUpImageFuction(imgSrc) {
    this.imgSrc = [imgSrc];
    this.displayImage = true;
  }

  popUpImageFuctionMultiple(imgSrc) {
    
    if (imgSrc != null || imgSrc != '') {
      var imagesArr = imgSrc.split('|');
      var ImagenewArr = [];
      if (imagesArr.length > 0) {
        imagesArr.forEach(element => {
          ImagenewArr.push(this.imageBasePath +''+ element);
        });
        this.imgSrc = ImagenewArr;
      }
      else {
        this.imgSrc = [this.imageBasePath + imgSrc];
      }

    }
    else {
      this.imgSrc = ['../../../../assets/layout/images/no-image.png'];
    }

    this.displayImage = true;
  }

}
