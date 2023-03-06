import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonUseNameCode } from '../Helper/models/DropLists';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ResolverService implements Resolve<any>{

  dropdownData: CommonUseNameCode[] = [];
  constructor(private apiService: ApiService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CommonUseNameCode>|Promise<any>|any {
    this.apiService.GetProductModelDropDownData().subscribe(response => {
      if (response.ResponseText === 'success'){
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < response.DropDownData.length; i++) {
             this.dropdownData.push({
               code : response.DropDownData[i].ID,
               name : response.DropDownData[i].Name,
             });
           }
      }
    }
    );
    return this.dropdownData;
   }
}
