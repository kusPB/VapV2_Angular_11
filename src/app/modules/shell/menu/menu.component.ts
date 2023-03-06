import { MenuItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { ShellComponent } from '../shell.component';
import { PurchasePermissionEnum } from 'src/app/shared/constant/purchase-permission';
import { SalesPermissionEnum } from 'src/app/shared/constant/sales-permission';
import { CatalogPermissionEnum } from 'src/app/shared/constant/catalog-permission';
import { ExtrasPermissionEnum } from 'src/app/shared/constant/extras-permission';
import { CustomerPermissionEnum } from 'src/app/shared/constant/customer-permission';
import { SupplierPermissionEnum } from 'src/app/shared/constant/supplier-permission';
import { ReportPermissionEnum } from 'src/app/shared/constant/report-permission';
import { CashRegisterPermissionEnum } from 'src/app/shared/constant/cash-register-permission';
import { OrderPermissionEnum } from 'src/app/shared/constant/order-permission';
import { environment } from 'src/environments/environment';
// import { AppMainComponent } from '../../../app.main.component';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class AppMenuComponent implements OnInit {
    environmentData: any;
    model: MenuItem[] | any = [];
    constructor(public app: ShellComponent) {
        this.environmentData = environment;
    }

    ngOnInit() {
        this.model = [
            /*   {
                  label: 'Dashboard', icon: 'fas fa-tachometer-alt', routerLink: ['/'],
  
              },
              {separator: true},
  
              {
                  label: 'Sales', icon: 'pi pi-fw pi-shopping-cart',
                   items: [
                      {label: 'Orders', icon: 'fas fa-shopping-bag', routerLink: ['/sales/orders']},
                      {label: 'Invoices', icon: 'fas fa-receipt', routerLink: ['/sales/invoices']},
                      {label: 'Shipments', icon: 'fas fa-shipping-fast', routerLink: ['/sales/shipments']},
                      {label: 'Credit Notes', icon: 'fas fa-credit-card', routerLink: ['/sales/credit-notes']},
                      {label: 'Performa Invoices', icon: 'fas fa-file-invoice', routerLink: ['/sales/performa-invoices']},
                      {label: 'Hold Sale', icon: 'fas fa-cart-plus', routerLink: ['/sales/hold-sale']},
                  ]
              },*/

            { separator: true, id: [PurchasePermissionEnum.SubMenuPurchaseOverview,PurchasePermissionEnum.SubMenuOpenPurchaseOrder,PurchasePermissionEnum.SubMenuHoldPurchase, PurchasePermissionEnum.SubMenuReturnPurchase, PurchasePermissionEnum.SubMenuBackOrderOverview] },
            {
                label: 'Purchases', icon: 'pi pi-fw pi-shopping-cart', id: [PurchasePermissionEnum.SubMenuPurchaseOverview, PurchasePermissionEnum.SubMenuHoldPurchase, PurchasePermissionEnum.SubMenuReturnPurchase, PurchasePermissionEnum.SubMenuBackOrderOverview],
                items: [
                    {
                        label: 'Purchase Order', id: [PurchasePermissionEnum.SubMenuPurchaseOverview, PurchasePermissionEnum.SubMenuReturnPurchase], icon: 'fas fa-dolly-flatbed',
                        items: [
                            { label: 'Overview', icon: 'fas fa-store-alt', id: PurchasePermissionEnum.SubMenuPurchaseOverview, routerLink: ['/purchase/purchase-order-report'] },
                            { label: 'Return Purchases', id: PurchasePermissionEnum.SubMenuReturnPurchase, icon: 'fas fa-store-alt', routerLink: ['/purchase/return-purchase-report'] },
                        ]
                    },
                    {
                        label: 'Back Order', icon: 'fas fa-dolly-flatbed', id: [PurchasePermissionEnum.SubMenuBackOrderOverview],
                        items: [
                            { label: 'Overview', id: PurchasePermissionEnum.SubMenuBackOrderOverview, icon: 'fas fa-store-alt', routerLink: ['/purchase/back-order-report'] },
                            // { label: 'Add Back Order', icon: 'fas fa-store-alt', routerLink: ['/purchase/add-back-order'] },
                        ]
                    },
                    {
                        label: 'Pre Order', id: [PurchasePermissionEnum.SubMenuOpenPurchaseOrder], icon: 'fas fa-dolly-flatbed',
                        items: [
                            { label: 'Overview', icon: 'fas fa-store-alt', id: PurchasePermissionEnum.SubMenuOpenPurchaseOrder, routerLink: ['/purchase/pre-order-report'] },
                        ]
                    },
                    {
                        label: 'Hold Purchase', id: [PurchasePermissionEnum.SubMenuHoldPurchase], icon: 'fas fa-dolly-flatbed',
                        items: [
                            { label: 'Overview', icon: 'fas fa-store-alt', id: PurchasePermissionEnum.SubMenuHoldPurchase, routerLink: ['/purchase/hold-purchase-report'] },
                        ]
                    },
                ]
            },
            {
                separator: true, id: [SalesPermissionEnum.SubMenuStats, SalesPermissionEnum.SubMenuSaleInvoicesOverview,
                SalesPermissionEnum.SubMenuInvoiceOverview, SalesPermissionEnum.SubMenuCreditNote, SalesPermissionEnum.SubMenuHoldSale,
                SalesPermissionEnum.SubMenuProformaInvoiceOverview, SalesPermissionEnum.SubMenuProforma, SalesPermissionEnum.SubMenuSaleInvoicesOverview, ReportPermissionEnum.OnlineOrdersReport],
            },

            {
                label: 'Sale', icon: 'pi pi-fw pi-shopping-cart', id: [SalesPermissionEnum.SubMenuStats, SalesPermissionEnum.SubMenuSaleInvoicesOverview,
                SalesPermissionEnum.SubMenuInvoiceOverview, SalesPermissionEnum.SubMenuCreditNote, SalesPermissionEnum.SubMenuHoldSale,
                SalesPermissionEnum.SubMenuProformaInvoiceOverview, SalesPermissionEnum.SubMenuProforma,
                SalesPermissionEnum.SubMenuSaleInvoicesOverview,ReportPermissionEnum.VPOrders, ReportPermissionEnum.OnlineOrdersReport],
                items: [
                    {
                        label: 'Statistics', icon: 'fas fa-dolly-flatbed', id: [SalesPermissionEnum.SubMenuStats],
                        items: [
                            { label: 'Today', id: SalesPermissionEnum.SubMenuStats, icon: 'fas fa-store-alt', routerLink: ['/sale/sale-stats'] },
                            { label: 'Sale Stats Report', id: SalesPermissionEnum.SubMenuStats, icon: 'fas fa-store-alt', routerLink: ['/sale/sale-stats-report'] },

                        ]
                    },
                    {
                        label: 'Sale Invoice', icon: 'fas fa-dolly-flatbed', id: [SalesPermissionEnum.SubMenuSaleInvoicesOverview, SalesPermissionEnum.SubMenuInvoiceOverview, SalesPermissionEnum.SubMenuCreditNote,
                        SalesPermissionEnum.SubMenuHoldSale],
                        items: [
                            { label: 'Update Orders', icon: 'fas fa-store-alt', id: SalesPermissionEnum.SubMenuSaleInvoicesOverview, routerLink: ['/sale/sale-index'] },
                            // { label: 'Invoices Overview', icon: 'fas fa-store-alt', id: SalesPermissionEnum.SubMenuInvoiceOverview, routerLink: ['/sale/sale-invoiceoverview'] },
                            { label: 'Credit Note', icon: 'fas fa-store-alt', id: SalesPermissionEnum.SubMenuCreditNote, routerLink: ['/sale/salerefundreport-index'] },
                            { label: 'Hold Sale', icon: 'fas fa-store-alt', id: SalesPermissionEnum.SubMenuHoldSale, routerLink: ['/sale/opensalereport-index'] },
                        ]
                    },
                    {
                        label: 'Performa', icon: 'fas fa-dolly-flatbed', id: [SalesPermissionEnum.SubMenuProformaInvoiceOverview, SalesPermissionEnum.SubMenuProforma],
                        items: [
                            { label: 'Overview', icon: 'fas fa-store-alt', id: [SalesPermissionEnum.SubMenuProformaInvoiceOverview, SalesPermissionEnum.SubMenuProforma], routerLink: ['/sale/performainvoice-index'] },
                            // { label: 'Create ', icon: 'fas fa-store-alt',id:SalesPermissionEnum.SubMenuProformaInvoiceOverview, routerLink: ['/sale/add-performa-invoice'] },

                        ]
                    },
                    {
                        label: 'Orders', icon: 'fas fa-dolly-flatbed', id: [ReportPermissionEnum.VPOrders, ReportPermissionEnum.OnlineOrdersReport],
                        items: [
                            { label: 'Online Orders', icon: 'fas fa-store-alt', id: ReportPermissionEnum.OnlineOrdersReport, routerLink: ['/reports/online-orders'] },
                            { label: 'VP Orders', id: ReportPermissionEnum.VPOrders, icon: 'fas fa-store-alt', routerLink: ['/reports/vp-orders'] },
                        ]
                    },

                ]
            },
            {
                separator: true, id: [CustomerPermissionEnum.SubMenuViewCustomers, CustomerPermissionEnum.SubMenuCustomersAccounts,
                CustomerPermissionEnum.SubMenuAddressReport, SupplierPermissionEnum.SubMenuViewSuppliers, SupplierPermissionEnum.SubMenuSupplierAccounts,
                ReportPermissionEnum.SubMenuInvoicePayments, ReportPermissionEnum.SubMenuSupplierInvoices],
            },
            {
                label: 'Accounts', icon: 'pi pi-fw pi-shopping-cart', id: [CustomerPermissionEnum.SubMenuViewCustomers, CustomerPermissionEnum.SubMenuCustomersAccounts,
                CustomerPermissionEnum.SubMenuAddressReport, SupplierPermissionEnum.SubMenuViewSuppliers, SupplierPermissionEnum.SubMenuSupplierAccounts,
                ReportPermissionEnum.SubMenuInvoicePayments, ReportPermissionEnum.SubMenuSupplierInvoices,ReportPermissionEnum.InventoryValueReport],
                items: [
                    {
                        label: 'Customers', icon: 'fas fa-dolly-flatbed', id: [CustomerPermissionEnum.SubMenuViewCustomers, CustomerPermissionEnum.SubMenuCustomersAccounts,
                        CustomerPermissionEnum.SubMenuAddressReport],
                        items: [
                            { label: 'View Customers', id: CustomerPermissionEnum.SubMenuViewCustomers, icon: 'fas fa-store-alt', routerLink: ['/customer/customer-index'] },
                            { label: 'Customer Accounts', id: CustomerPermissionEnum.SubMenuCustomersAccounts, icon: 'fas fa-store-alt', routerLink: ['/customer/customer-payments'] },
                            { label: 'Address Report', id: CustomerPermissionEnum.SubMenuAddressReport, icon: 'fas fa-store-alt', routerLink: ['/customer/customer-reportbyaddress'] },

                        ]
                    },
                    {
                        label: 'Suppliers', icon: 'fas fa-dolly-flatbed', id: [SupplierPermissionEnum.SubMenuViewSuppliers, SupplierPermissionEnum.SubMenuSupplierAccounts,
                        ReportPermissionEnum.SubMenuInvoicePayments, ReportPermissionEnum.SubMenuSupplierInvoices],
                        items: [
                            { label: 'View Suppliers', id: SupplierPermissionEnum.SubMenuViewSuppliers, icon: 'fas fa-store-alt', routerLink: ['/supplier/supplier-index'] },
                            { label: 'Supplier Accounts', id: SupplierPermissionEnum.SubMenuSupplierAccounts, icon: 'fas fa-store-alt', routerLink: ['/supplier/supplier-payments'] },
                            { label: 'Invoice Payments', id: [ReportPermissionEnum.SubMenuInvoicePayments, ReportPermissionEnum.SubMenuSupplierInvoices], icon: 'fas fa-store-alt', routerLink: ['/reports/supplier-invoices'] },
                        ]
                    },
                    {
                        label: 'Inventory report', icon: 'fas fa-dolly-flatbed', id: [ReportPermissionEnum.InventoryValueReport],
                        items: [
                            { label: 'Inventory Value', id: ReportPermissionEnum.InventoryValueReport, icon: 'fas fa-store-alt', routerLink: ['/reports/inventory-value-report'] },
                        ]
                    },
                ]
            },
            {
                separator: true, id: [CatalogPermissionEnum.SubMenuManageProducts, CatalogPermissionEnum.SubMenuPostToShop,
                CatalogPermissionEnum.SubMenuFolderHierarchy, CatalogPermissionEnum.SubMenuCategory, CatalogPermissionEnum.SubMenuShopCategory,
                CatalogPermissionEnum.SubMenuSubCategory, CatalogPermissionEnum.SubMenuClassification, CatalogPermissionEnum.SubMenuDepartment,
                CatalogPermissionEnum.SubMenuColor, CatalogPermissionEnum.SubMenuCode, CatalogPermissionEnum.SubMenuProductQuality,
                CatalogPermissionEnum.SubMenuProductModel, CatalogPermissionEnum.SubMenuCheckOutProduct, CatalogPermissionEnum.SubMenuCheckInProduct,
                CatalogPermissionEnum.SubMenuAssignLocations, CatalogPermissionEnum.SubMenuManageLocations,
                CatalogPermissionEnum.SubMenuWarehouse, CatalogPermissionEnum.SubMenuZone, CatalogPermissionEnum.SubMenuSection,
                CatalogPermissionEnum.SubMenuLevel, CatalogPermissionEnum.SubMenuDiscountGroups,
                CatalogPermissionEnum.SubMenuSizes,
                CatalogPermissionEnum.SubMenuProductCapacity,
                CatalogPermissionEnum.SubMenuProductPackaging,
                CatalogPermissionEnum.SubMenuProductPrint,
                CatalogPermissionEnum.SubMenuProductPower,
                CatalogPermissionEnum.SubMenuConnecterTypes,CatalogPermissionEnum.ProductStockBalance
            ],
            },

            {
                label: 'Catalog', icon: 'fas fa-dolly-flatbed', id: [CatalogPermissionEnum.SubMenuManageProducts, CatalogPermissionEnum.SubMenuPostToShop,
                CatalogPermissionEnum.SubMenuFolderHierarchy, CatalogPermissionEnum.SubMenuCategory, CatalogPermissionEnum.SubMenuShopCategory,
                CatalogPermissionEnum.SubMenuSubCategory, CatalogPermissionEnum.SubMenuClassification, CatalogPermissionEnum.SubMenuDepartment,
                CatalogPermissionEnum.SubMenuColor,CatalogPermissionEnum.SubMenuBrand, CatalogPermissionEnum.SubMenuCode, CatalogPermissionEnum.SubMenuProductQuality,
                CatalogPermissionEnum.SubMenuProductModel, CatalogPermissionEnum.SubMenuCheckOutProduct, CatalogPermissionEnum.SubMenuCheckInProduct,
                CatalogPermissionEnum.SubMenuAssignLocations, CatalogPermissionEnum.SubMenuManageLocations,
                CatalogPermissionEnum.SubMenuWarehouse, CatalogPermissionEnum.SubMenuZone, CatalogPermissionEnum.SubMenuSection,
                CatalogPermissionEnum.SubMenuLevel, CatalogPermissionEnum.SubMenuDiscountGroups, CatalogPermissionEnum.AddProduct,CatalogPermissionEnum.SubMenuSizes,
                CatalogPermissionEnum.SubMenuProductSeries,
                CatalogPermissionEnum.SubMenuSizes,
                CatalogPermissionEnum.SubMenuProductCapacity,
                CatalogPermissionEnum.SubMenuProductPackaging,
                CatalogPermissionEnum.SubMenuProductPrint,
                CatalogPermissionEnum.SubMenuProductPower,
                CatalogPermissionEnum.SubMenuConnecterTypes,
                CatalogPermissionEnum.SubMenuProductIncomingQuantity,
                CatalogPermissionEnum.ProductStockBalance],
                items: [
                    {
                        label: 'Products', icon: 'fas fa-dolly-flatbed', id: [CatalogPermissionEnum.SubMenuManageProducts, CatalogPermissionEnum.SubMenuPostToShop,
                        CatalogPermissionEnum.SubMenuFolderHierarchy, CatalogPermissionEnum.AddProduct,CatalogPermissionEnum.SubMenuProductIncomingQuantity,CatalogPermissionEnum.ProductStockBalance],
                        items: [
                            { label: 'Manage Products', id: CatalogPermissionEnum.SubMenuManageProducts, icon: 'fas fa-store-alt', routerLink: ['/catalog/managed-products'] },
                            { label: 'Add Product', id: CatalogPermissionEnum.AddProduct, icon: 'fas fa-store-alt', routerLink: ['/catalog/add-product/0'] },
                            { label: 'Post to Shop', id: CatalogPermissionEnum.SubMenuPostToShop, icon: 'fas fa-truck', routerLink: ['/catalog/post-to-shop'] },
                            { label: 'Folder Hierarchy', id: CatalogPermissionEnum.SubMenuFolderHierarchy, icon: 'fas fa-folder', routerLink: ['/catalog/folder-hierarchy'] },
                            { label: 'Products Export', icon: 'fas fa-store-alt', routerLink: ['/catalog/export-product'] },
                            { label: 'Product Images Details', id: CatalogPermissionEnum.SubMenuManageProducts, icon: 'fas fa-store-alt', routerLink: ['/catalog/product-images'] },
                            { label: 'Product Incoming Quantity Details', id: CatalogPermissionEnum.SubMenuProductIncomingQuantity, icon: 'fas fa-store-alt', routerLink: ['/catalog/incoming-quantity'] },
                            { label: 'Filter Products', id: CatalogPermissionEnum.SubMenuManageProducts, icon: 'fas fa-store-alt', routerLink: ['/catalog/managed-products-filter'] },
                            { label: 'Product Stock Balance', id: CatalogPermissionEnum.ProductStockBalance, icon: 'fas fa-store-alt', routerLink: ['/catalog/product-stock-balance'] },

                        ]
                    },
                   
                    {
                        label: 'Defination', icon: 'fas fa-book', id: [CatalogPermissionEnum.SubMenuClassification, CatalogPermissionEnum.SubMenuDepartment,                         
                         CatalogPermissionEnum.SubMenuCategory, CatalogPermissionEnum.SubMenuShopCategory,
                        CatalogPermissionEnum.SubMenuSubCategory],
                        items: [
                            { label: 'Classification', id: CatalogPermissionEnum.SubMenuClassification, icon: 'fas fa-people-carry', routerLink: ['/catalog/classification'] },
                            { label: 'Department', id: CatalogPermissionEnum.SubMenuDepartment, icon: 'fas fa-building', routerLink: ['/catalog/department'] },
                            { label: 'Category', id: CatalogPermissionEnum.SubMenuCategory, icon: 'fas fa-project-diagram', routerLink: ['/catalog/category'] },
                            { label: 'Shop Category', id: CatalogPermissionEnum.SubMenuShopCategory, icon: 'fas fa-store', routerLink: ['/catalog/shop-category'] },
                            { label: 'Sub Category', id: CatalogPermissionEnum.SubMenuSubCategory, icon: 'fas fa-sitemap', routerLink: ['/catalog/sub-category'] }
                            
                        ]
                    },
                    {
                        label: 'Attributes', icon: 'fas fa-book', id: [
                        CatalogPermissionEnum.SubMenuColor, 
                        CatalogPermissionEnum.SubMenuBrand,
                        CatalogPermissionEnum.SubMenuCode,
                        CatalogPermissionEnum.SubMenuProductQuality,
                        CatalogPermissionEnum.SubMenuProductModel,
                        CatalogPermissionEnum.SubMenuProductType,
                        CatalogPermissionEnum.SubMenuProductSeries,
                        CatalogPermissionEnum.SubMenuBrandType,
                        CatalogPermissionEnum.SubMenuSizes,
                        CatalogPermissionEnum.SubMenuProductCapacity,
                        CatalogPermissionEnum.SubMenuProductPackaging,
                        CatalogPermissionEnum.SubMenuProductPrint,
                        CatalogPermissionEnum.SubMenuProductPower,
                        CatalogPermissionEnum.SubMenuConnecterTypes
                    ],
                        items: [
                            { label: 'Colors', id: CatalogPermissionEnum.SubMenuColor, icon: 'fas fa-paint-brush', routerLink: ['/catalog/colors'] },
                            { label: 'Sizes', id: CatalogPermissionEnum.SubMenuSizes, icon: 'fas fa-paint-brush', routerLink: ['/catalog/sizes'] },                           
                            { label: 'Brands', id: CatalogPermissionEnum.SubMenuBrand, icon: 'fas fa-paint-brush', routerLink: ['/catalog/brands'] },
                            { label: 'Brand Types', id: CatalogPermissionEnum.SubMenuBrandType, icon: 'fas fa-paint-brush', routerLink: ['/catalog/brand-type'] },
                            { label: 'Codes', id: CatalogPermissionEnum.SubMenuCode, icon: 'fas fa-keyboard', routerLink: ['/catalog/codes'] },
                            { label: 'Quality Label', id: CatalogPermissionEnum.SubMenuProductQuality, icon: 'fas fa-tag', routerLink: ['/catalog/quality-label'] },
                            { label: 'Model', id: CatalogPermissionEnum.SubMenuProductModel, icon: 'fas fa-tag', routerLink: ['/catalog/product-model'] },
                            //{ label: 'Product Sub Model', id: CatalogPermissionEnum.SubMenuProductModel, icon: 'fas fa-tag', routerLink: ['/catalog/product-sub-model'] },
                            { label: 'Type', id: CatalogPermissionEnum.SubMenuProductType, icon: 'fas fa-paint-brush', routerLink: ['/catalog/product-types'] },
                            { label: 'Connecter Type', id: CatalogPermissionEnum.SubMenuConnecterTypes, icon: 'fas fa-paint-brush', routerLink: ['/catalog/connecter-types'] },
                            { label: 'Power', id: CatalogPermissionEnum.SubMenuProductPower, icon: 'fas fa-paint-brush', routerLink: ['/catalog/product-power'] },
                            { label: 'Print', id: CatalogPermissionEnum.SubMenuProductPrint, icon: 'fas fa-paint-brush', routerLink: ['/catalog/product-print'] },
                            { label: 'Capacity', id: CatalogPermissionEnum.SubMenuProductCapacity, icon: 'fas fa-paint-brush', routerLink: ['/catalog/product-capacity'] },
                            { label: 'Packaging', id: CatalogPermissionEnum.SubMenuProductPackaging, icon: 'fas fa-paint-brush', routerLink: ['/catalog/product-packaging'] },
                            { label: 'Serie', id: CatalogPermissionEnum.SubMenuProductSeries, icon: 'fas fa-paint-brush', routerLink: ['/catalog/product-series'] }
                        ]
                    },
                    {
                        label: 'Transfer', icon: 'fas fa-map-marked-alt', id: [CatalogPermissionEnum.SubMenuCheckOutProduct, CatalogPermissionEnum.SubMenuCheckInProduct],
                        items: [
                            { label: 'Check Out', id: CatalogPermissionEnum.SubMenuCheckOutProduct, icon: 'fas fa-thumbtack', routerLink: ['/catalog/check-out'] },
                            { label: 'Check In', id: CatalogPermissionEnum.SubMenuCheckInProduct, icon: 'fas fa-thumbtack', routerLink: ['/catalog/check-in'] },

                        ]
                    },
                    {
                        label: 'Location', icon: 'fas fa-map-marked-alt', id: [CatalogPermissionEnum.SubMenuAssignLocations, CatalogPermissionEnum.SubMenuManageLocations,
                        CatalogPermissionEnum.SubMenuWarehouse, CatalogPermissionEnum.SubMenuZone, CatalogPermissionEnum.SubMenuSection,
                        CatalogPermissionEnum.SubMenuLevel],
                        items: [
                            { label: 'Assign Locations', id: CatalogPermissionEnum.SubMenuAssignLocations, icon: 'fas fa-thumbtack', routerLink: ['/catalog/assign-locations'] },
                            { label: 'Manage Location', id: CatalogPermissionEnum.SubMenuManageLocations, icon: 'fas fa-map-marker-alt', routerLink: ['/catalog/manage-location'] },
                            { label: 'Warehouses', id: CatalogPermissionEnum.SubMenuWarehouse, icon: 'fas fa-torii-gate', routerLink: ['/catalog/warehouses'] },
                            { label: 'Zones', id: CatalogPermissionEnum.SubMenuZone, icon: 'fas fa-street-view', routerLink: ['/catalog/zones'] },
                            { label: 'Sections', id: CatalogPermissionEnum.SubMenuSection, icon: 'fas fa-place-of-worship', routerLink: ['/catalog/sections'] },
                            { label: 'Levels', id: CatalogPermissionEnum.SubMenuLevel, icon: 'fas fa-network-wired', routerLink: ['/catalog/levels'] },
                        ]
                    },
                    {
                        label: 'Discount Management', icon: 'fas fa-map-marked-alt', id: [CatalogPermissionEnum.SubMenuDiscountGroups],
                        items: [
                            { label: 'Discount Groups', id: CatalogPermissionEnum.SubMenuDiscountGroups, icon: 'fas fa-thumbtack', routerLink: ['/catalog/discoun-groups'] },

                        ]
                    },
                ]
            },
            {
                separator: true, id: [ReportPermissionEnum.SubMenuAvailableStock, ReportPermissionEnum.SubMenuStockPurchasePrice,
                CatalogPermissionEnum.SubMenuShopCategory, ReportPermissionEnum.SubMenuStockLocation, ReportPermissionEnum.SubMenuInvoicePayments,
                ReportPermissionEnum.SubMenuSupplierInvoices, SalesPermissionEnum.SubMenuSaleInvoicesOverview, SalesPermissionEnum.SubMenuHoldSale,
                SalesPermissionEnum.SubMenuProformaInvoiceOverview, SalesPermissionEnum.SubMenuProforma, SalesPermissionEnum.SubMenuCreditNote,
                SalesPermissionEnum.SubMenuOverviewProductWise, SalesPermissionEnum.SubMenuOverviewUserWise, SalesPermissionEnum.SubMenuOverviewSubCategoryWise,
                PurchasePermissionEnum.SubMenuPurchaseOverview, PurchasePermissionEnum.SubMenuReturnPurchase, ReportPermissionEnum.SubMenuInvoiceShipmentStatusReport],
            },
            {
                label: 'Reports', icon: 'fas fa-sort-amount-down-alt', id: [ReportPermissionEnum.SubMenuAvailableStock, ReportPermissionEnum.SubMenuStockPurchasePrice,
                CatalogPermissionEnum.SubMenuShopCategory, ReportPermissionEnum.SubMenuStockLocation, ReportPermissionEnum.SubMenuInvoicePayments, ReportPermissionEnum.StockReportByModels,
                ReportPermissionEnum.SubMenuSupplierInvoices, ReportPermissionEnum.SingleProductLifeLine,ReportPermissionEnum.SupplierLifeLlineReport, ReportPermissionEnum.CustomerLifeLlineReport, SalesPermissionEnum.SubMenuSaleInvoicesOverview, SalesPermissionEnum.SubMenuHoldSale,
                SalesPermissionEnum.SubMenuProformaInvoiceOverview, SalesPermissionEnum.SubMenuProforma, SalesPermissionEnum.SubMenuCreditNote,
                SalesPermissionEnum.SubMenuOverviewProductWise, SalesPermissionEnum.SubMenuOverviewUserWise, SalesPermissionEnum.SubMenuOverviewSubCategoryWise,PurchasePermissionEnum.SubMenuPurchaseCustomizedOverview,
                PurchasePermissionEnum.SubMenuPurchaseOverview, PurchasePermissionEnum.SubMenuReturnPurchase,ReportPermissionEnum.StockAlertReport,ReportPermissionEnum.OpencartLogsReport,ReportPermissionEnum.SubMenuOpenCartLogs,PurchasePermissionEnum.SubMenuCustomizedOpenPurchaseOrder],
                items: [
                    {
                        label: 'Stock', icon: 'fas fa-dolly-flatbed', id: [ReportPermissionEnum.SubMenuAvailableStock, ReportPermissionEnum.SubMenuStockPurchasePrice, ReportPermissionEnum.StockReportByModels,
                        CatalogPermissionEnum.SubMenuShopCategory, ReportPermissionEnum.SubMenuStockLocation, ReportPermissionEnum.SingleProductLifeLine,ReportPermissionEnum.StockAlertReport, ReportPermissionEnum.CustomerLifeLlineReport],
                        items: [
                            { label: 'Available Stock', id: ReportPermissionEnum.SubMenuAvailableStock, icon: 'fas fa-store-alt', routerLink: ['/reports/available-stock'] },
                            { label: 'Stock Purchase Price', id: ReportPermissionEnum.SubMenuStockPurchasePrice, icon: 'fas fa-store-alt', routerLink: ['/reports/stock-index-prices'] },
                            { label: 'Stock Purchase Price Details', id: ReportPermissionEnum.SubMenuStockPurchasePrice, icon: 'fas fa-store-alt', routerLink: ['/reports/stock-index-prices-detail'] },
                            { label: 'Stock By Shop Categories', id: CatalogPermissionEnum.SubMenuShopCategory, icon: 'fas fa-store-alt', routerLink: ['/reports/stock-shop-categories'] },
                            { label: 'Stock By Location Details', id: ReportPermissionEnum.SubMenuStockLocation, icon: 'fas fa-store-alt', routerLink: ['/reports/stock-location-details'] },
                            { label: 'Stock By Product Models', id: ReportPermissionEnum.StockReportByModels, icon: 'fas fa-store-alt', routerLink: ['/reports/stock-by-models'] },
                            // { label: 'All Products Location Details', id: ReportPermissionEnum.SubMenuStockLocation, icon: 'fas fa-store-alt', routerLink: ['/reports/product-location-details'] },
                            { label: 'Stock Alert Report', id: ReportPermissionEnum.StockAlertReport, icon: 'fas fa-store-alt', routerLink: ['/reports/stock-alert-report'] },

                        ]
                    },
                    {
                        label: 'Supplier', icon: 'fas fa-dolly-flatbed', id: [ReportPermissionEnum.SubMenuInvoicePayments, ReportPermissionEnum.SubMenuSupplierInvoices],
                        items: [
                            { label: 'Supplier Invoices', id: [ReportPermissionEnum.SubMenuInvoicePayments, ReportPermissionEnum.SubMenuSupplierInvoices], icon: 'fas fa-store-alt', routerLink: ['/reports/supplier-invoices'] },
                        ]
                    },
                    {
                        label: 'Sale Invoice', icon: 'fas fa-dolly-flatbed', id: [SalesPermissionEnum.SubMenuSaleInvoicesOverview, SalesPermissionEnum.SubMenuHoldSale,
                        SalesPermissionEnum.SubMenuProformaInvoiceOverview, SalesPermissionEnum.SubMenuProforma, SalesPermissionEnum.SubMenuCreditNote,
                        SalesPermissionEnum.SubMenuOverviewProductWise, SalesPermissionEnum.SubMenuOverviewUserWise, SalesPermissionEnum.SubMenuOverviewSubCategoryWise],
                        items: [
                            { label: 'Sale Report', id: SalesPermissionEnum.SubMenuSaleInvoicesOverview, icon: 'fas fa-store-alt', routerLink: ['/sale/sale-index'] },
                            { label: 'Hold Sale Report', id: SalesPermissionEnum.SubMenuHoldSale, icon: 'fas fa-store-alt', routerLink: ['/sale/opensalereport-index'] },
                            { label: 'Performa Report', id: [SalesPermissionEnum.SubMenuProformaInvoiceOverview, SalesPermissionEnum.SubMenuProforma], icon: 'fas fa-store-alt', routerLink: ['/sale/performainvoice-index'] },
                            { label: 'Credit Note', id: SalesPermissionEnum.SubMenuCreditNote, icon: 'fas fa-store-alt', routerLink: ['/sale/salerefundreport-index'] },
                            { label: 'Overview Product wise', id: SalesPermissionEnum.SubMenuOverviewProductWise, icon: 'fas fa-store-alt', routerLink: ['/sale/salereport-byproduct'] },
                            { label: 'Overview User wise', id: SalesPermissionEnum.SubMenuOverviewUserWise, icon: 'fas fa-store-alt', routerLink: ['/sale/salereport-byuser'] },
                            { label: 'Overview Sub Category wise', id: SalesPermissionEnum.SubMenuOverviewSubCategoryWise, icon: 'fas fa-store-alt', routerLink: ['/sale/salereport-bysubcategory'] },

                        ]
                    },
                    {
                        label: 'Purchases', icon: 'fas fa-dolly-flatbed', id: [PurchasePermissionEnum.SubMenuPurchaseOverview,PurchasePermissionEnum.SubMenuPurchaseCustomizedOverview, PurchasePermissionEnum.SubMenuReturnPurchase,PurchasePermissionEnum.SubMenuCustomizedOpenPurchaseOrder],
                        items: [
                            { label: 'Purchase Report', id: PurchasePermissionEnum.SubMenuPurchaseOverview, icon: 'fas fa-store-alt', routerLink: ['/purchase/purchase-order-report'] },
                            { label: 'Purchase Return Report', id: PurchasePermissionEnum.SubMenuReturnPurchase, icon: 'fas fa-store-alt', routerLink: ['/purchase/return-purchase-report'] },
                            { label: 'Pre Order Customized Report', id: PurchasePermissionEnum.SubMenuCustomizedOpenPurchaseOrder, icon: 'fas fa-store-alt', routerLink: ['/purchase/pre-order-customized-report'] },
                            { label: 'Customized Purchase Report', id: PurchasePermissionEnum.SubMenuPurchaseCustomizedOverview, icon: 'fas fa-store-alt', routerLink: ['/purchase/purchase-order-customized-report'] },

                        ]
                    },
                    {
                        label: 'Incoming Shipment', icon: 'fas fa-dolly-flatbed', id: [OrderPermissionEnum.SUBMENU_INCOMINGSHIPMENTREPORT],
                        items: [
                            { label: 'Incoming Shipment Report', id: OrderPermissionEnum.SUBMENU_INCOMINGSHIPMENTREPORT, icon: 'fas fa-store-alt', routerLink: ['/orders/shipping-transfer-new'] },
                        ]
                    },

                    {
                        label: 'Life Line Reports', icon: 'fas fa-dolly-flatbed', id: [ReportPermissionEnum.SingleProductLifeLine, ReportPermissionEnum.CustomerLifeLlineReport,ReportPermissionEnum.SupplierLifeLlineReport],
                        items: [
                            { label: 'Single Product Life Line', id: ReportPermissionEnum.SingleProductLifeLine, icon: 'fas fa-store-alt', routerLink: ['/reports/single-product-life-line'] },
                            { label: 'Customer Life Line Report', id: ReportPermissionEnum.CustomerLifeLlineReport, icon: 'fas fa-store-alt', routerLink: ['/reports/customer-life-line-report'] },
                            {
                                label: 'Supplier Life Line Report',
                                 id: ReportPermissionEnum.SupplierLifeLlineReport, 
                                icon: 'fas fa-store-alt', routerLink: ['/reports/supplier-life-line-report']
                            },
                        ]
                    },
                    {
                        label: 'Dashboard Reports', icon: 'fas fa-dolly-flatbed', id: [ ReportPermissionEnum.CustomerLifeLlineReport],
                        items: [
                            { 
                                label: 'Customer Dashboard Report', 
                                id: ReportPermissionEnum.CustomerLifeLlineReport, icon: 'fas fa-store-alt', 
                                routerLink: ['/reports/customer-dashboard-report'] 
                            },
                           
                        ]
                    },
                    {
                        label: 'Open Cart', icon: 'fas fa-dolly-flatbed', id: [ReportPermissionEnum.SubMenuOpenCartLogs],
                        items: [
                            { label: 'OpenCart Logs Report', id: [ReportPermissionEnum.OpencartLogsReport, ], icon: 'fas fa-store-alt', routerLink: ['/reports/opencartlogs'] },
                        ]
                    },
                    {
                        label: 'Cash History', icon: 'fas fa-dolly-flatbed', id: [ReportPermissionEnum.SubMenuCashInOut],
                        items: [
                            { label: 'Cash In Out Report', id: [ReportPermissionEnum.SubMenuCashInOut, ], icon: 'fas fa-store-alt', routerLink: ['/reports/cash-in-out'] },
                        ]
                    },
                ]
            }

            ,
            {
                separator: true, id: [OrderPermissionEnum.ViewAllInternalOrders, OrderPermissionEnum.InternalOrder,
                OrderPermissionEnum.ApproveInternalOrders, OrderPermissionEnum.PurchaseInternalOrders, OrderPermissionEnum.SubMenuShipmentDocument,
                OrderPermissionEnum.ViewAllIncomingOrders, OrderPermissionEnum.IncomingOrder],
            },
            {
                label: 'Supply Chain', icon: 'fas fa-sort-amount-down-alt', id: [OrderPermissionEnum.ViewAllInternalOrders, OrderPermissionEnum.InternalOrder,
                OrderPermissionEnum.ApproveInternalOrders, OrderPermissionEnum.PurchaseInternalOrders, OrderPermissionEnum.SubMenuShipmentDocument,
                    OrderPermissionEnum.ViewAllIncomingOrders],
                //, OrderPermissionEnum.IncomingOrder
                items: [
                    {
                        label: 'Wish-List', icon: 'fas fa-dolly-flatbed', id: [OrderPermissionEnum.ViewAllInternalOrders, OrderPermissionEnum.InternalOrder,
                        OrderPermissionEnum.ApproveInternalOrders, OrderPermissionEnum.PurchaseInternalOrders, OrderPermissionEnum.SubMenuShipmentDocument],
                        items: [
                            { label: 'Shopping Cart', id: [OrderPermissionEnum.ViewAllInternalOrders, OrderPermissionEnum.InternalOrder], icon: 'fas fa-store-alt', routerLink: ['/orders/manage-internalorder'] },
                            { label: 'Approve Orders', id: OrderPermissionEnum.ApproveInternalOrders, icon: 'fas fa-store-alt', routerLink: ['/orders/approve-internalorder'] },
                            { label: 'Purchase Orders', id: OrderPermissionEnum.PurchaseInternalOrders, icon: 'fas fa-store-alt', routerLink: ['/orders/purchase-internalorder'] },
                            { label: 'Incoming Shipping', id: OrderPermissionEnum.SubMenuShipmentDocument, icon: 'fas fa-store-alt', routerLink: ['/orders/shipping-transfer'] },

                        ]
                    },
                    {
                        label: 'External Orders', icon: 'fas fa-dolly-flatbed', id: [OrderPermissionEnum.ViewAllIncomingOrders, OrderPermissionEnum.IncomingOrder],
                        items: [
                            { label: 'Orders', id: OrderPermissionEnum.ViewAllIncomingOrders, icon: 'fas fa-store-alt', routerLink: ['/orders/manage-incoming-order'] },
                            // { label: 'create', id: OrderPermissionEnum.IncomingOrder, icon: 'fas fa-store-alt', routerLink: ['/orders/add-incoming-order'] },

                        ]
                    },

                ]
            },
            {
                separator: true, id: [ExtrasPermissionEnum.SubMenuClientSource, ExtrasPermissionEnum.SubMenuPaymentCondition,
                ExtrasPermissionEnum.SubMenuDeliveryMethod, ExtrasPermissionEnum.SubMenuManageUsers, ExtrasPermissionEnum.SubMenuManageRoles,
                ExtrasPermissionEnum.SubMenuCountry, ExtrasPermissionEnum.SubMenuState, ExtrasPermissionEnum.SubMenuCity, ExtrasPermissionEnum.SubMenuExpensesOverview,
                ExtrasPermissionEnum.SubMenuManageWages, ExtrasPermissionEnum.SubMenuExpenseTypesOverview, ExtrasPermissionEnum.SubMenuOutletCreateView, ExtrasPermissionEnum.DatabaseBackupHistory],
            },
            {
                label: 'System', icon: 'fas fa-sort-amount-down-alt', id: [ExtrasPermissionEnum.SubMenuClientSource, ExtrasPermissionEnum.SubMenuPaymentCondition,
                ExtrasPermissionEnum.SubMenuDeliveryMethod, ExtrasPermissionEnum.SubMenuManageUsers, ExtrasPermissionEnum.SubMenuManageRoles,
                ExtrasPermissionEnum.SubMenuCountry, ExtrasPermissionEnum.SubMenuState, ExtrasPermissionEnum.SubMenuCity, ExtrasPermissionEnum.SubMenuExpensesOverview,
                ExtrasPermissionEnum.SubMenuManageWages, ExtrasPermissionEnum.SubMenuExpenseTypesOverview, ExtrasPermissionEnum.SubMenuOutletCreateView ,ExtrasPermissionEnum.DatabaseBackupHistory],
                items: [
                    {
                        label: 'Client', icon: 'fas fa-dolly-flatbed', id: [ExtrasPermissionEnum.SubMenuClientSource, ExtrasPermissionEnum.SubMenuPaymentCondition,
                        ExtrasPermissionEnum.SubMenuDeliveryMethod],
                        items: [
                            { label: 'Client Source', id: ExtrasPermissionEnum.SubMenuClientSource, icon: 'fas fa-store-alt', routerLink: ['/extras/client-source'] },
                            { label: 'Payment Condition', id: ExtrasPermissionEnum.SubMenuPaymentCondition, icon: 'fas fa-truck', routerLink: ['/extras/payment-condition'] },
                            { label: 'Delivery Method', id: ExtrasPermissionEnum.SubMenuDeliveryMethod, icon: 'fas fa-truck', routerLink: ['/extras/delivery-method'] },

                        ]
                    },
                    {
                        label: 'Users', icon: 'fas fa-dolly-flatbed', id: [ExtrasPermissionEnum.SubMenuManageUsers, ExtrasPermissionEnum.SubMenuManageRoles],
                        items: [
                            { label: 'Manage Users', id: ExtrasPermissionEnum.SubMenuManageUsers, icon: 'fas fa-store-alt', routerLink: ['/extras/manage-user'] },
                            { label: 'Manage Roles', id: ExtrasPermissionEnum.SubMenuManageRoles, icon: 'fas fa-truck', routerLink: ['/extras/manage-role'] },
                            { label: 'Activity', id: '', icon: 'fas fa-truck', routerLink: ['/extras/activity'] },
                            { label: 'Add Development Activity', id: '', icon: 'fas fa-truck', routerLink: ['/extras/help'] },
                            { label: 'Development Activity', id: '', icon: 'fas fa-truck', routerLink: ['/extras/help-list'] },
                            { label: 'Reporting Password', id: ExtrasPermissionEnum.ReportingPasswordMenu, icon: 'fas fa-truck', routerLink: ['/catalog/reporting-password'] },
                        ]
                    },
                    {
                        label: 'Regions', icon: 'fas fa-dolly-flatbed', id: [ExtrasPermissionEnum.SubMenuCountry, ExtrasPermissionEnum.SubMenuState,
                        ExtrasPermissionEnum.SubMenuCity],
                        items: [
                            { label: 'Country', id: ExtrasPermissionEnum.SubMenuCountry, icon: 'fas fa-store-alt', routerLink: ['/extras/country'] },
                            { label: 'State', id: ExtrasPermissionEnum.SubMenuState, icon: 'fas fa-truck', routerLink: ['/extras/states'] },
                            { label: 'City', id: ExtrasPermissionEnum.SubMenuCity, icon: 'fas fa-truck', routerLink: ['/extras/city'] },
                        ]
                    },
                    {
                        label: 'Expenses', icon: 'fas fa-dolly-flatbed', id: [ExtrasPermissionEnum.SubMenuExpensesOverview, ExtrasPermissionEnum.SubMenuManageWages],
                        items: [
                            { label: 'Overview', id: ExtrasPermissionEnum.SubMenuExpensesOverview, icon: 'fas fa-store-alt', routerLink: ['/extras/expense-overview'] },
                            { label: 'Manage Wages', id: ExtrasPermissionEnum.SubMenuManageWages, icon: 'fas fa-truck', routerLink: ['/extras/wages-overview'] },

                        ]
                    },
                    {
                        label: 'Expense Type', icon: 'fas fa-dolly-flatbed', id: [ExtrasPermissionEnum.SubMenuExpenseTypesOverview],
                        items: [
                            { label: 'Overview', id: ExtrasPermissionEnum.SubMenuExpenseTypesOverview, icon: 'fas fa-store-alt', routerLink: ['/extras/expense-type-overview'] },
                        ]
                    },
                    {
                        label: 'Outlet', icon: 'fas fa-dolly-flatbed', id: [ExtrasPermissionEnum.SubMenuOutletCreateView],
                        items: [
                            { label: 'Overview', id: ExtrasPermissionEnum.SubMenuOutletCreateView, icon: 'fas fa-store-alt', routerLink: ['/extras/outlet-overview'] },
                        ]
                    },
                    {
                        label: 'Database Backup', icon: 'fas fa-dolly-flatbed', id: [ExtrasPermissionEnum.DatabaseBackupHistory],
                        items: [
                            { label: 'Database Backup', id: ExtrasPermissionEnum.DatabaseBackupHistory, icon: 'fas fa-store-alt', routerLink: ['/extras/backup-database'] },
                        ]
                    },

                ]
            },


            { separator: true, id: [CashRegisterPermissionEnum.SubMenuViewRegister, CashRegisterPermissionEnum.SubMenu_CashRegisterOverview], },
            {
                label: 'Cash Register', icon: 'fas fa-sort-amount-down-alt', id: [CashRegisterPermissionEnum.SubMenuViewRegister, CashRegisterPermissionEnum.SubMenu_CashRegisterOverview],
                items: [
                    {
                        label: 'Register', icon: 'fas fa-dolly-flatbed', id: [CashRegisterPermissionEnum.SubMenuViewRegister, CashRegisterPermissionEnum.SubMenu_CashRegisterOverview],
                        items: [
                            { label: 'view register', id: [CashRegisterPermissionEnum.SubMenuViewRegister, CashRegisterPermissionEnum.SubMenu_CashRegisterOverview], icon: 'fas fa-store-alt', routerLink: ['/cashregister/register'] },
                        ]
                    },
                ]
            }
        ];
    }

    onMenuClick(event) {
        this.app.onMenuClick(event);
    }
}
