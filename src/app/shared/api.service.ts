import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductModelDropDownData} from './../Helper/models/DropLists';
import { AllProductModel } from './../Helper/models/Product';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService{

   headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('APIKey', 'AccuritaAPIKey123456789')
  .set('Access-Control-Allow-Origin', '*')
  .set('Access-Control-Allow-Credentials', 'true');

  readonly url = environment.url;
  readonly imageBasePath =environment.imageBasePath;

   // let hostname = window.location.hostname;
          // console.log(hostname);
          // console.log(window.location.origin);
          // console.log('port number');
          // console.log(window.location.port)
  constructor(private http: HttpClient ) {
   }


  GetClassificationDropList(): Observable<any> {
  return this.http.get<any>(environment.url + '/Classification/GetDropDownData',
    {headers: this.headers});
  }

  GetProductModelDropDownData(): Observable<any> {
  return this.http.get<any>(environment.url + '/ProductModel/GetDropDownData',
      {headers: this.headers});
    }

  GetMeasuringUnitDD(): Observable<any> {
    return this.http.get<any>(environment.url + '/MeasuringUnit/GetDropDownData',
      {headers: this.headers});
    }

  QualityLabelDD(): Observable<any> {
  return this.http.get<any>(environment.url + '/ProductQuality/GetDropDownData',
    {headers: this.headers});
  }

   GetAllProduct(): Observable<any> {
    return this.http.get<any>(environment.url + '/Product/GetAll',
        {headers: this.headers});
      }

    GetAllProductPagination(body): Observable<any> {
    return this.http.post<any>(environment.url + '/Product/GetAllProductPagination', body,
        {headers: this.headers});
      }

      GetAllProductTotalCountProduct(body): Observable<any> {
        return this.http.post<any>(environment.url + '/Product/GetAllProductTotalCount', body,
            {headers: this.headers});
        }

   GetDepartmentByClassificationID(ID): Observable<any> {
   return this.http.post<any>(environment.url + '/Department/GetByClassificationID', ID,  {headers: this.headers});
    }

   GetCategoryByDepartmentID(ID): Observable<any> {
    return this.http.post<any>(environment.url + '/Category/GetByDepartmentID', ID,  {headers: this.headers});
      }

   GetSubCategoryByCategorytID(ID): Observable<any> {
    return this.http.post<any>(environment.url + '/SubCategory/GetByCategoryID', ID,  {headers: this.headers});
      }

    GetCategoryDropDownData(): Observable<any> {
    return this.http.get<any>(environment.url + '/Category/GetDropDownData', {headers: this.headers});
      }

    GetShopCategoryDropDownData(): Observable<any> {
        return this.http.get<any>(environment.url + '/ShopCategory/GetDropDownData', {headers: this.headers});
          }


     ProductQualityUpdateStatus(body): Observable<any> {
      return this.http.post<any>(environment.url + '/Product/UpdateStatus', body,  {headers: this.headers});
        }

     DeleteProduct(ID): Observable<any> {
      return this.http.post<any>(environment.url + '/Product/Delete', ID,  {headers: this.headers});
        }

      ProductVariantByID(ID): Observable<any> {
        return this.http.post<any>(environment.url + '/ProductVariant/GetByID', ID,  {headers: this.headers});
          }

      GetAllProductVariantByProductID(ID): Observable<any> {
        return this.http.post<any>(environment.url + '/ProductVariant/GetAllByProductID', ID,  {headers: this.headers});
          }

      GetDropDownDataColor(): Observable<any> {
        return this.http.get<any>(environment.url + '/Color/GetDropDownData',  {headers: this.headers});
          }

      GetDropDownDataSize(): Observable<any> {
        return this.http.get<any>(environment.url + '/Size/GetDropDownData',  {headers: this.headers});
          }

      UpdateProductVariantStatus(body): Observable<any> {
        return this.http.post<any>(environment.url + '/ProductVariant/UpdateStatus', body,  {headers: this.headers});
          }

      // post to shop  or OpenCart/AddProduct
      PostTOShopOrAddProductToOpenCart(ID): Observable<any> {
        return this.http.post<any>(environment.url + '/OpenCart/AddProduct', ID,  {headers: this.headers});
          }

      AddProductVariant(body): Observable<any> {
        return this.http.post<any>(environment.url + '/ProductVariant/Add', body,  {headers: this.headers});
          }


        GetTrackableProductLocationDetailReport(body): Observable<any> {
        return this.http.post<any>(environment.url + '/Report/GetTrackableProductLocationDetailReport', body,  {headers: this.headers});
          }

        GetNonTrackableProductLocationDetailReport(body): Observable<any> {
          return this.http.post<any>(environment.url + '/Report/GetNonTrackableProductLocationReport', body,  {headers: this.headers});
            }

        GetAllProductStockOverall(body): Observable<any> {
            return this.http.post<any>(environment.url + '/Report/GetAllProductStockOverall', body,  {headers: this.headers});
              }

        GetAllFolderHierarchyPaginationFolderHierarchy(body): Observable<any> {
          return this.http.post<any>(environment.url + '/FolderHierarchy/GetAllFolderHierarchyPagination', body,  {headers: this.headers});
            }

        GetFolderHierarchyByID(body): Observable<any> {
          return this.http.post<any>(environment.url + '/FolderHierarchy/GetByID', body,  {headers: this.headers});
            }





}
