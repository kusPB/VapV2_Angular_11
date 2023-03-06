import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { MenuItem } from 'primeng/api/menuitem';
import { Columns } from 'src/app/shared/Model/columns.model';
import { GenericMenuItems, RowGroup } from 'src/app/shared/Model/genric-menu-items.model';
import { TableColumnEnum } from '../../Enum/table-column.enum';
import jspdf from 'jspdf'
import 'jspdf-autotable';
import { ActivatedRoute } from '@angular/router';
import { PermissionService } from '../../services/permission.service';
import { isNullOrUndefined } from 'util';
import { RowGroupTypeEnum } from '../../Enum/row-group-type.enum ';

@Component({
  selector: 'app-genric-table',
  templateUrl: './genric-table.component.html',
  styleUrls: ['./genric-table.component.scss']
})
export class GenricTableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  columns: Columns[] = [];


  @Input('columnsData')
  
  set model(value: Columns[]) {
    value.forEach(x => {
      if (x.permission) {
        if (this.permission.getPermissionAccess(x.permission)) {
          this.columns.push(x);
          this.selectedColumns.push(x);
        }
      }
      else {
        this.columns.push(x);
          this.selectedColumns.push(x);
      }
    });
  }
    //set model(value: Columns[]) {

    // this.columns = [...value];
    // this.selectedColumns = [...value];

  //}
  @Input() globalFilterFields: string;
  @Input() row: number = 25;
  @Input() rowGroup: RowGroup = {
    property: 'CreatedAt',
    enableRowGroup: false,
    propertyType: RowGroupTypeEnum.DATE
  };

  @Output() emitMenuAction = new EventEmitter();
  @Output() emitSwitch = new EventEmitter();
  @Output() emitHref = new EventEmitter();
  @Output() emitHref2 = new EventEmitter();
  @Output() emitAttachment = new EventEmitter();
  @Output() emitRemarks = new EventEmitter();
  @Output() emitRowClick = new EventEmitter();
  @Output() emitCheckbox = new EventEmitter();
  @Output() emitDeleteBtnClick = new EventEmitter();
  @Output() emitNarration = new EventEmitter();


  @Input() menuItems: GenericMenuItems[] = [];
  @Input() rowsPerPageOptions: number[] = [25, 50, 100]
  //@ViewChild('dt') table: Table;
  selectedColumns: Columns[] = [];
  rowGroupMetadata: any = {};
  totalRecords = 0;
  selectedStock: any = {};
  imageBasePath;
  imgSrc:any ;
  items: MenuItem[] = [];
  displayImage = false;
  columnsType = TableColumnEnum;
  rowGroupType = RowGroupTypeEnum;
  displayDialog = false;
  DialogRemarks = '';
  mySearch: any;
  IsImageClicked = false;
  constructor(private apiService: vaplongapi, private router: ActivatedRoute, private permission: PermissionService) {
    this.imageBasePath = this.apiService.imageBasePath;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.data.length > 0 && this.rowGroup.enableRowGroup) {
      this.updateRowGroupMetaData();
    }
  }
  checkMyData(cols, rowIndex) {
    let prop = '';
    prop = this.switchCaseForData(prop, cols);
    return this.rowGroupMetadata[prop].index === rowIndex;
  }
  ngOnInit() {
    // this.items = [
    //   { label: 'Wishlist', icon: 'fas fa-shopping-cart', command: () => this.emitOutput('Wishlist', this.selectedStock) },
    // ];

  }

  switchCaseForData(prop, rowData) {
    switch (this.rowGroup.propertyType) {
      case RowGroupTypeEnum.DATE: {
        //statements; 
        prop = rowData[this.rowGroup.property].split('T')[0];
        break;
      }
      case RowGroupTypeEnum.STRING: {
        //statements; 
        prop = rowData[this.rowGroup.property];
        break;
      }
      default: {
        //statements; 
        prop = rowData[this.rowGroup.property];
        break;
      }
    }
    return prop;
  }

  emitOnRowClick(cols) {
    if(this.IsImageClicked)
    {
      this.IsImageClicked = false;
      return;
    }
    this.emitRowClick.emit(cols);

  }
  emitDeleteButtonClick(cols) {
    this.emitDeleteBtnClick.emit(cols);
  }
  emitOutput(Property: string, selectedRow: any) {
    const obj = { forLabel: Property, selectedRowData: selectedRow };
    this.emitMenuAction.emit(obj);
    // this.selectedVariantIDforWishlist = ProductVariantID;
    // this.selectedProductNameforWishlist = Product;
    // this.isAddToWishlist = true;
  }
  // showMenuItems(event) {

  //   this.items = [];
  //   this.menuItems.forEach(x => {
  //     const perm = this.selectedStock[x.permissionDisplayProperty];
  //     if (x.permission) {
  //       if (this.selectedStock[x.dependedProperty] && this.permission.getPermissionAccess(x.permission)) {
  //         if (!isNullOrUndefined(perm) && perm == true) {
  //           const obj = { label: x.label, icon: x.icon, command: () => this.emitOutput(x.label, this.selectedStock) }
  //           this.items.push(obj);
  //         }
  //         if (isNullOrUndefined(perm)) {
  //           const obj = { label: x.label, icon: x.icon, command: () => this.emitOutput(x.label, this.selectedStock) }
  //           this.items.push(obj);
  //         }
  //       }
  //     } else {
  //       if (this.selectedStock[x.dependedProperty]) {
  //         if (!isNullOrUndefined(perm) && perm == true) {
  //           const obj = { label: x.label, icon: x.icon, command: () => this.emitOutput(x.label, this.selectedStock) }
  //           this.items.push(obj);
  //         }
  //         if (isNullOrUndefined(perm)) {
  //           const obj = { label: x.label, icon: x.icon, command: () => this.emitOutput(x.label, this.selectedStock) }
  //           this.items.push(obj);
  //         }
  //               }
  //     }
  //   })
  //   // this.items = this.menuItems;
  // }
  showMenuItems(event) {
    
    this.items = [];
    this.menuItems.forEach(x => {
      if (x.permission) {
        if (this.selectedStock[x.dependedProperty] && this.permission.getPermissionAccess(x.permission)) {
          const perm = this.selectedStock[x.permissionDisplayProperty];
          // tslint:disable-next-line: deprecation
          if (isNullOrUndefined(perm) || perm === true) {
            const obj = { label: x.label, icon: x.icon, command: () => this.emitOutput(x.label, this.selectedStock) };
            this.items.push(obj);
          }
        }
      } else {
        if (this.selectedStock[x.dependedProperty]) {
          const obj = { label: x.label, icon: x.icon, command: () => this.emitOutput(x.label, this.selectedStock) };
          this.items.push(obj);
        }
      }
    });
    // this.items = this.menuItems;
  }
  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};

    if (this.data) {
      for (let i = 0; i < this.data.length; i++) {
        const rowData = this.data[i];
        let representativeName = '';

        representativeName = this.switchCaseForData(representativeName, rowData);


        if (i === 0) {
          this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
        }
        else {
          const previousRowData = this.data[i - 1];
          let previousRowGroup = '';

          previousRowGroup = this.switchCaseForData(previousRowGroup, previousRowData);

          if (representativeName === previousRowGroup) {
            this.rowGroupMetadata[representativeName].size++;
          } else {
            this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
          }
        }
      }
    }
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
  emitDisplayAttachment(col) {
    this.emitAttachment.emit(col);
  }
  
  emitRemarkDialog(col) {
    this.emitRemarks.emit(col);
  }
  emitNarrationDialog(col) {
    this.emitNarration.emit(col);
  }
  emitCheckBoxChange(col) {
    this.emitCheckbox.emit(col);
  }
  onShow() {
    this.items = [];
    this.items.forEach(element => {

    });
  }

  popUpImageFuction(imgSrc) {
    this.IsImageClicked = true
    this.imgSrc = [imgSrc];
    this.displayImage = true;
  }
  popUpImageFuctionMultiple(imgSrc) {
    this.IsImageClicked = true
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
  
 
  getReportName() {
    let title = this.router.snapshot.data.title;
    return title + new Date().getTime();
  }

  exportPdf() {
    const exportColumns = this.selectedColumns.map(col => ({ title: col.header, dataKey: col.field }));

    import("jspdf").then((jsPDF: any) => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(exportColumns, this.data);
        const reportName = this.getReportName();
        doc.save(`${reportName}.pdf`);
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.data);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "products");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, this.getReportName() + EXCEL_EXTENSION);
    });
  }
 

}
