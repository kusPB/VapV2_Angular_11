import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogRoutingModule } from './catalog.routing.module';
import { AddProductComponent } from './add-product/add-product.component';
import { AssignLocationsComponent } from './assign-locations/assign-locations.component';
import { CategoryComponent } from './category/category.component';
import { ClassificationComponent } from './classification/classification.component';
import { CodesComponent } from './codes/codes.component';
import { ColorsComponent } from './colors/colors.component';
import { BrandsComponent } from './brands/brands.component';
import { ProductTypesComponent } from './product-types/product-types.component';


import { DefinationComponent } from './defination/defination.component';
import { DepartmentComponent } from './department/department.component';
import { DiscounGroupsComponent } from './discoun-groups/discoun-groups.component';
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
import { CheckOutComponent } from './Transfer/check-out/check-out.component';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { ZonesComponent } from './zones/zones.component';
import { CheckInComponent } from './Transfer/check-in/check-in.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { FolderHierarchyComponent } from './folder-hierarchy/folder-hierarchy.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ProductExportComponent } from './product-export/product-export.component';
import { ProductSubModelComponent } from './product-sub-model/product-sub-model.component';
import { PaymentPasswordComponent } from './payment-password/payment-password.component';
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


@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [
    AddProductComponent,
    AssignLocationsComponent,
    CategoryComponent,
    ClassificationComponent,
    CodesComponent,
    ColorsComponent,
    BrandsComponent,
    DefinationComponent,
    DepartmentComponent,
    DiscounGroupsComponent,
    LevelsComponent,
    LocationComponent,
    ManageLocationComponent,
    ManagedProductsComponent,
    PostToShopComponent,
    ProductDiscountComponent,
    ProductModelComponent,
    ProductsComponent,
    QualityLabelComponent,
    SectionsComponent,
    ShopCategoryComponent,
    SubCategoryComponent,
    CheckInComponent,
    CheckOutComponent,
    WarehousesComponent,
    ZonesComponent,
    ProductExportComponent,
    ProductSubModelComponent,
    FolderHierarchyComponent,
    PaymentPasswordComponent,
    ProductSeriesComponent,
    ProductTypesComponent,
    BrandTypeComponent,
    ProductPowerComponent,
    ProductPrintComponent,
    ProductPackagingComponent,
    ConnecterTypesComponent,
    ProductCapacityComponent,
    ProductImageListingComponent,
    ProductIncomingQuantityListingComponent,
    ManagedProductsFilterComponent,
    SizesComponent,
    ProducStockBalanceComponent

  ],
  imports: [
    CommonModule,
    SharedModule,
    CatalogRoutingModule,
    NgSelectModule,
    NgxPermissionsModule.forChild(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateModule,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ]
})
export class CatalogModule { }
