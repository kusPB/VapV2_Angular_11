import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { GalleriaModule } from 'primeng/galleria';
import { InplaceModule } from 'primeng/inplace';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { DatepickerpopupComponent } from '../EntryComponents/datepickerpopup/datepickerpopup.component';
import { AddwishlistDialogComponent } from '../EntryComponents/addwishlist-dialog/addwishlist-dialog.component';
import { AddIncomingQuantityDialogComponent } from '../EntryComponents/addincomingquantity-dialog/addincomingquantity-dialog.component';

import { CustomerPreviousInvoiceComponent } from '../EntryComponents/customer-previous-invoice/customer-previous-invoice.component';
import { DeliveryMethodComponent } from '../EntryComponents/delivery-method/delivery-method.component';
import { PaymentConditionComponent } from '../EntryComponents/payment-condition/payment-condition.component';
import { ProductDialogComponent } from '../EntryComponents/product-dialog/product-dialog.component';
import { ProductLocationsComponent } from '../EntryComponents/product-locations/product-locations.component';
import { ProductTrackablesComponent } from '../EntryComponents/product-trackables/product-trackables.component';
import { ProductWithStockComponent } from '../EntryComponents/product-with-stock/product-with-stock.component';
import { SelectedProductTrackablesComponent } from '../EntryComponents/selected-product-trackables/selected-product-trackables.component';
import { ProductVariantStockDDDataComponent } from '../EntryComponents/productvariant-stock-DD-data/productvariant-stock-DD-data.component';
import { ProductWithStockNewComponent } from '../EntryComponents/product-with-stock-new/product-with-stock-new.component';
import { ProductLastAveragePriceDialogComponent } from '../EntryComponents/product-lastaverageprice-dialog/product-lastaverageprice-dialog.component';
import { SessionTimeCounterComponent } from '../EntryComponents/session-time-counter/session-time-counter.component';
import { CaptchaDialogComponent } from '../EntryComponents/captcha-dialog/captcha-dialog.component';

import { MultiProductSelectionComponent } from './components/multi-product-selection/multi-product-selection.component';
import { GenricTableComponent } from './components/genric-table/genric-table.component';
import { SsGenericTableComponent } from './components/ss-generic-table/ss-generic-table.component';
import { ExportProductSelectionComponent } from './components/export-product-selection/export-product-selection.component';

import { PurchaseDetailReportComponent } from './print-reports/purchase-detail-report/purchase-detail-report.component';
import { PurchaseDetailPackingListReportComponent } from './print-reports/purchase-detail-packinglist-report/purchase-detail-packinglist-report.component';

import { SaleInvoiceReportComponent } from './print-reports/sale-invoice-report/sale-invoice-report.component';
import { SalePreviewReportComponent } from './print-reports/sale-preview-report/sale-preview-report.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SearchPipe } from './pipes/search-pipe';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ShippingTransferDetailsReportComponent } from './print-reports/shipping-transfer-details-report/shipping-transfer-details-report.component';
import { BackOrderDetailReportComponent } from './print-reports/backorder-detail-report/backorder-detail-report.component';
import { SaleRefundReportComponent } from './print-reports/sale-refund-report/sale-refund-report.component';
import { ReturnPurchaseDetailReportComponent } from './print-reports/return-purchase-detail-report/return-purchase-detail-report.component';
import { HoldSaleDetailReportComponent } from './print-reports/hold-sale-detail-report/hold-sale-detail-report.component';
import { PermissionService } from './services/permission.service';
import { CredentialsService } from './services/credentials.service';
import { CryptoService } from './services/crypto.service';
import { StorageService } from './services/storage.service';
import { IncomingOrderDetailReportComponent } from './print-reports/incoming-order-detail-report/incoming-order-detail-report.component';
import { OnlineOrderPreviewReportComponent } from './print-reports/online-order-preview-report/online-order-preview-report.component';
import { VpSalePreviewReportComponent } from './print-reports/vp-sale-preview-report/vp-sale-preview-report.component';
import { VpSalePackingReportComponent } from './print-reports/vp-sale-packing-report/vp-sale-packing-report.component';
import { OpenPurchaseDetailReportComponent } from './print-reports/open-purchase-detail-report/open-purchase-detail-report.component';
import { OpenPurchaseDetailCustomizedReportComponent } from './print-reports/open-purchase-detail-customized-report/open-purchase-detail-customized-report.component';
import { PurchaseDetailCustomizedReportComponent } from './print-reports/purchase-detail-customized-report/purchase-detail-customized-report.component';
import { PurchaseDetailPackingListCustomizedReportComponent } from './print-reports/purchase-detail-packinglist-customized-report/purchase-detail-packinglist-customized-report.component';
import { HoldPurchaseDetailReportComponent } from './print-reports/hold-purchase-detail-report/hold-purchase-detail-report.component';
import { QRPrintComponent } from './print-reports/qr-print/qr-print.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    CarouselModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    ColorPickerModule,
    ContextMenuModule,
    DataViewModule,
    DialogModule,
    DropdownModule,
    FieldsetModule,
    FileUploadModule,
    FullCalendarModule,
    GalleriaModule,
    InplaceModule,
    InputNumberModule,
    InputMaskModule,
    InputSwitchModule,
    ToggleButtonModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    RippleModule,
    ScrollPanelModule,
    SelectButtonModule,
    SidebarModule,
    SlideMenuModule,
    SliderModule,
    SplitButtonModule,
    StepsModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToastModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    VirtualScrollerModule,
    ProgressSpinnerModule,
    NgSelectModule,
    NgxPermissionsModule.forChild(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateModule,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [PermissionService, CredentialsService, CryptoService, StorageService],
  declarations: [DatepickerpopupComponent,
    AddwishlistDialogComponent,
    AddIncomingQuantityDialogComponent,
    CustomerPreviousInvoiceComponent,
    DeliveryMethodComponent,
    PaymentConditionComponent,
    ProductDialogComponent,
    ProductLocationsComponent,
    ProductTrackablesComponent,
    ProductWithStockComponent,
    ProductVariantStockDDDataComponent,
    ProductLastAveragePriceDialogComponent,
    ProductWithStockNewComponent,
    SelectedProductTrackablesComponent,
    GenricTableComponent,
    MultiProductSelectionComponent,
    ExportProductSelectionComponent,
    PurchaseDetailReportComponent,
    PurchaseDetailPackingListReportComponent,
    ReturnPurchaseDetailReportComponent,
    BackOrderDetailReportComponent,
    SaleInvoiceReportComponent,
    SaleRefundReportComponent,
    SalePreviewReportComponent,
    SsGenericTableComponent,
    SearchPipe,
    ShippingTransferDetailsReportComponent,
    IncomingOrderDetailReportComponent,
    HoldSaleDetailReportComponent,
    OnlineOrderPreviewReportComponent,
    VpSalePreviewReportComponent,
    VpSalePackingReportComponent,
    OpenPurchaseDetailReportComponent,
    OpenPurchaseDetailCustomizedReportComponent,
    PurchaseDetailCustomizedReportComponent,
    PurchaseDetailPackingListCustomizedReportComponent,
    SessionTimeCounterComponent,
    HoldPurchaseDetailReportComponent,
    QRPrintComponent,
    CaptchaDialogComponent

  ],
  exports: [
    CommonModule,
    FormsModule,
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    CarouselModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    ColorPickerModule,
    ContextMenuModule,
    DataViewModule,
    DialogModule,
    DropdownModule,
    FieldsetModule,
    FileUploadModule,
    FullCalendarModule,
    GalleriaModule,
    InplaceModule,
    InputNumberModule,
    InputMaskModule,
    InputSwitchModule,
    ToggleButtonModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    RippleModule,
    ScrollPanelModule,
    SelectButtonModule,
    SidebarModule,
    SlideMenuModule,
    SliderModule,
    SplitButtonModule,
    StepsModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToastModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    VirtualScrollerModule,
    ProgressSpinnerModule,
    DatepickerpopupComponent,
    AddwishlistDialogComponent,
    AddIncomingQuantityDialogComponent,
    CustomerPreviousInvoiceComponent,
    DeliveryMethodComponent,
    PaymentConditionComponent,
    ProductDialogComponent,
    ProductLocationsComponent,
    ProductTrackablesComponent,
    ProductWithStockComponent,
    ProductVariantStockDDDataComponent,
    ProductLastAveragePriceDialogComponent,
    ProductWithStockNewComponent,
    SelectedProductTrackablesComponent,
    GenricTableComponent,
    SsGenericTableComponent,
    MultiProductSelectionComponent,
    ExportProductSelectionComponent,
    PurchaseDetailReportComponent,
    PurchaseDetailPackingListReportComponent,
    ReturnPurchaseDetailReportComponent,
    BackOrderDetailReportComponent,
    SaleInvoiceReportComponent,
    SaleRefundReportComponent,
    SalePreviewReportComponent,
    NgSelectModule,
    SearchPipe,
    ShippingTransferDetailsReportComponent,
    HoldSaleDetailReportComponent,
    IncomingOrderDetailReportComponent,
    OnlineOrderPreviewReportComponent,
    VpSalePreviewReportComponent,
    VpSalePackingReportComponent,
    OpenPurchaseDetailReportComponent,
    OpenPurchaseDetailCustomizedReportComponent,
    PurchaseDetailCustomizedReportComponent,
    PurchaseDetailPackingListCustomizedReportComponent,
    SessionTimeCounterComponent,
    HoldPurchaseDetailReportComponent,
    QRPrintComponent,
    CaptchaDialogComponent
  ]
})
export class SharedModule { }
