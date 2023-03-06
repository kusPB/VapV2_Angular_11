import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { AssignLocationsComponent } from './assign-locations/assign-locations.component';
import { CategoryComponent } from './category/category.component';
import { ClassificationComponent } from './classification/classification.component';
import { CodesComponent } from './codes/codes.component';
import { ColorsComponent } from './colors/colors.component';
import { BrandsComponent } from './brands/brands.component';
import { DefinationComponent } from './defination/defination.component';
import { DepartmentComponent } from './department/department.component';
import { DiscounGroupsComponent } from './discoun-groups/discoun-groups.component';
import { FolderHierarchyComponent } from './folder-hierarchy/folder-hierarchy.component';
import { LevelsComponent } from './levels/levels.component';
import { LocationComponent } from './location/location.component';
import { ManageLocationComponent } from './manage-location/manage-location.component';
import { ManagedProductsComponent } from './managed-products/managed-products.component';
import { PostToShopComponent } from './post-to-shop/post-to-shop.component';
import { ProductDiscountComponent } from './product-discount/product-discount.component';
import { ProductModelComponent } from './product-model/product-model.component';
import { ProductsComponent } from './products/products.component';
import { QualityLabelComponent } from './quality-label/quality-label.component';
import { SectionsComponent } from './sections/sections.component';
import { ShopCategoryComponent } from './shop-category/shop-category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { CheckInComponent } from './Transfer/check-in/check-in.component';
import { CheckOutComponent } from './Transfer/check-out/check-out.component';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { ZonesComponent } from './zones/zones.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CatalogPermissionEnum } from 'src/app/shared/constant/catalog-permission';
import { ProductExportComponent } from './product-export/product-export.component';
import { ProductSubModelComponent } from './product-sub-model/product-sub-model.component';
import { PaymentPasswordComponent } from './payment-password/payment-password.component';
import { ExtrasPermissionEnum } from 'src/app/shared/constant/extras-permission';
import { ProductTypesComponent } from './product-types/product-types.component';
import { ProductSeriesComponent } from './product-series/product-series.component';
import { BrandTypeComponent } from './brand-type/brand-type.component';

import { ProductPowerComponent } from './product-power/product-power.component';
import { ProductPrintComponent } from './product-print/product-print.component';
import { ProductPackagingComponent } from './product-packaging/product-packaging.component';
import { ConnecterTypesComponent } from './connecter-types/connecter-types.component';
import { ProductCapacityComponent } from './product-capacity/product-capacity.component';
import { SizesComponent } from './sizes/sizes.component';
import { ProductImageListingComponent } from './product-images-listing/product-images-listing.component';
import { ProductIncomingQuantityListingComponent } from './product-incoming-quantity-listing/product-incoming-quantity-listing.component';
import { ManagedProductsFilterComponent } from './managed-products-filter/managed-products-filter.component';
import { ProducStockBalanceComponent } from './product-stock-balance/product-stock-balance.component';

const routes: Routes = [
  { path: '', component: AddProductComponent },
  {
    path: 'add-product/:id', component: AddProductComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Add Product', permissions: { only: CatalogPermissionEnum.AddProduct, redirectTo: '/403' }
    }
  },
  {
    path: 'assign-locations', component: AssignLocationsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Assign Location', permissions: { only: [CatalogPermissionEnum.LocationListing, CatalogPermissionEnum.LocationAssinging], redirectTo: '/403' }
    }
  },
  {
    path: 'category', component: CategoryComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Category', permissions: { only: CatalogPermissionEnum.CategoryListing, redirectTo: '/403' }
    }
  },
  {
    path: 'classification', component: ClassificationComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Classification', permissions: { only: CatalogPermissionEnum.SubMenuClassification, redirectTo: '/403' }
    }
  },
  {
    path: 'codes', component: CodesComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      bc: 'Code', permissions: { only: CatalogPermissionEnum.SubMenuCode, redirectTo: '/403' }
    }
  },
  {
    path: 'product-series', component: ProductSeriesComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      bc: 'Product Series', permissions: { only: CatalogPermissionEnum.SubMenuProductSeries, redirectTo: '/403' }
    }
  },
  {
    path: 'colors', component: ColorsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Color', permissions: { only: CatalogPermissionEnum.SubMenuColor, redirectTo: '/403' }
    }
  },
  // {
  //   path: 'product-types', component: ProductTypesComponent,
  //   canActivate: [NgxPermissionsGuard],
  //   data: {
  //     title: 'Product Types', permissions: { only: CatalogPermissionEnum.SubMenuProductType, redirectTo: '/403' }
  //   }
  // },
  {
    path: 'brands', component: BrandsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Brand', permissions: { only: CatalogPermissionEnum.SubMenuBrand, redirectTo: '/403' }
    }
  },
  {
    path: 'brand-type', component: BrandTypeComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Brand Types', permissions: { only: CatalogPermissionEnum.SubMenuBrandType, redirectTo: '/403' }
    }
  },

  {
    path: 'defination', component: DefinationComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Defination', permissions: { only: CatalogPermissionEnum.SubMenuDefination, redirectTo: '/403' }
    }
  },
  {
    path: 'department', component: DepartmentComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Department', permissions: { only: CatalogPermissionEnum.DepartmentsListing, redirectTo: '/403' }
    }
  },
  {
    path: 'discoun-groups', component: DiscounGroupsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Discount Group', permissions: { only: CatalogPermissionEnum.DiscountGroupsListing, redirectTo: '/403' }
    }
  },
  {
    path: 'levels', component: LevelsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Levels', permissions: { only: CatalogPermissionEnum.LevelsListing, redirectTo: '/403' }
    }
  },
  // {
  //   path: 'location', component: LocationComponent,
  //   canActivate: [NgxPermissionsGuard],
  //   data: {
  //     title: 'Location', permissions: { only: CatalogPermissionEnum., redirectTo: '/403' }
  //   }
  // },
  {

    path: 'manage-location', component: ManageLocationComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Manage Location', permissions: { only: CatalogPermissionEnum.SubMenuManageLocations, redirectTo: '/403' }
    }
  },
  {
    path: 'managed-products', component: ManagedProductsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Managed Products', permissions: { only: CatalogPermissionEnum.ProductsListing, redirectTo: '/403' }
    }
  },
  {
    path: 'managed-products-filter', component: ManagedProductsFilterComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Filter Products', permissions: { only: CatalogPermissionEnum.ProductsListing, redirectTo: '/403' }
    }
  },
  {
    path: 'product-images', component: ProductImageListingComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Product Images Details', permissions: { only: CatalogPermissionEnum.ProductsListing, redirectTo: '/403' }
    }
  },
  {
    path: 'product-stock-balance', component: ProducStockBalanceComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Product Stock Balance', permissions: { only: CatalogPermissionEnum.ProductStockBalance, redirectTo: '/403' }
    }
  },
  {
    path: 'post-to-shop', component: PostToShopComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Post to Shop', permissions: { only: CatalogPermissionEnum.SubMenuPostToShop, redirectTo: '/403' }
    }
  },
  {
    path: 'export-product', component: ProductExportComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Export Product', permissions: { only: CatalogPermissionEnum.ProductsListing, redirectTo: '/403' }
    }
  },
  {
    path: 'product-discount/:id', component: ProductDiscountComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Product Discount', permissions: { only: CatalogPermissionEnum.ProductsDiscountListing, redirectTo: '/403' }
    }
  },
  {
    path: 'product-model', component: ProductModelComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Product Model', permissions: { only: CatalogPermissionEnum.SubMenuProductModel, redirectTo: '/403' }
    }
  },
  {
    path: 'product-types', component: ProductSubModelComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Product Type', permissions: { only: CatalogPermissionEnum.SubMenuProductType, redirectTo: '/403' }
    }
  },
  // {
  //   path: 'products', component: ProductsComponent,
  //   canActivate: [NgxPermissionsGuard],
  //   data: {
  //     title: 'Products', permissions: { only: CatalogPermissionEnum., redirectTo: '/403' }
  //   }
  // },
  {
    path: 'quality-label', component: QualityLabelComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Product Quality', permissions: { only: CatalogPermissionEnum.SubMenuProductQuality, redirectTo: '/403' }
    }
  },
  {
    path: 'sections', component: SectionsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Sections', permissions: { only: CatalogPermissionEnum.SectionsListing, redirectTo: '/403' }
    }
  },
  {
    path: 'shop-category', component: ShopCategoryComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Shop Categories', permissions: { only: CatalogPermissionEnum.SubMenuShopCategory, redirectTo: '/403' }
    }
  },
  {
    path: 'sub-category', component: SubCategoryComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Sub Category', permissions: { only: CatalogPermissionEnum.SubcategoryListing, redirectTo: '/403' }
    }
  },
  {
    path: 'check-out', component: CheckOutComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Transfer Product', permissions: { only: CatalogPermissionEnum.TransferProductToOutlet, redirectTo: '/403' }
    }
  },
  {
    path: 'check-in', component: CheckInComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Return Product', permissions: { only: CatalogPermissionEnum.ReturnProductToHeadquarter, redirectTo: '/403' }
    }
  },
  {
    path: 'warehouses', component: WarehousesComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Warehouse', permissions: { only: CatalogPermissionEnum.WarehousesListing, redirectTo: '/403' }
    }
  },
  {
    path: 'zones', component: ZonesComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Zone', permissions: { only: CatalogPermissionEnum.ZonesListing, redirectTo: '/403' }
    }
  },
  {
    path: 'folder-hierarchy', component: FolderHierarchyComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Folder Hierarchy', permissions: { only: CatalogPermissionEnum.SubMenuFolderHierarchy, redirectTo: '/403' }
    }
  },
  {
    path: 'reporting-password', component: PaymentPasswordComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Reporting Password', permissions: { only: ExtrasPermissionEnum.ChangeReportingPassword, redirectTo: '/403' }
    }
  },

  {
    path: 'product-power', component: ProductPowerComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Product Power', permissions: { only: CatalogPermissionEnum.SubMenuProductPower, redirectTo: '/403' }
    }
  },
  {
    path: 'product-print', component: ProductPrintComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Product Print', permissions: { only: CatalogPermissionEnum.SubMenuProductPrint, redirectTo: '/403' }
    }
  },
  {
    path: 'sizes', component: SizesComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Size', permissions: { only: CatalogPermissionEnum.SubMenuSizes, redirectTo: '/403' }
    }
  },
  {
    path: 'product-capacity', component: ProductCapacityComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Product Capacity', permissions: { only: CatalogPermissionEnum.SubMenuProductCapacity, redirectTo: '/403' }
    }
  },
  {
    path: 'product-packaging', component: ProductPackagingComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Product Packaging', permissions: { only: CatalogPermissionEnum.SubMenuProductPackaging, redirectTo: '/403' }
    }
  },

  {
    path: 'connecter-types', component: ConnecterTypesComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Connecter Type', permissions: { only: CatalogPermissionEnum.SubMenuConnecterTypes, redirectTo: '/403' }
    }   
  },

  {
    path: 'incoming-quantity', component: ProductIncomingQuantityListingComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      title: 'Product Incoming Quantity Details', permissions: { only: CatalogPermissionEnum.SubMenuProductIncomingQuantity, redirectTo: '/403' }
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
