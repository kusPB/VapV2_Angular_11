import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { vaplongapi } from "../Service/vaplongapi.service";
import { FilterRequestModel } from "../Helper/models/FilterRequestModel";

@Injectable({
  providedIn: "root",
})
export class ProductCounterResolverService implements Resolve<any> {
  filterRequestModel = new FilterRequestModel(
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    new Date(),
    new Date(),
    1000,
    0,
    true,
    false,
    -1,
    -1,
    -1,
    false,
    false,
    false,
    "",
    "",
    false,
    false,
    -1,
    -1,
    false,
    false,
    "",
    "",
    "",
    0
  );
  constructor(private vapLongApiService: vaplongapi) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<number> {
    return await this.vapLongApiService
      .GetAllProductTotalCountProduct(this.filterRequestModel)
      .toPromise()
      .then((response) => {
        if (response.ResponseText === "success") {
          return response.TotalRowCount;
        } else {
          return -1;
        }
      });
  }
}
