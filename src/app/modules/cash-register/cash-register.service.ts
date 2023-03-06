import { UpdateStatus } from 'src/app/Helper/models/UpdateStatus';
import { environment } from 'src/environments/environment';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { CashRegister } from 'src/app/Helper/models/CashRegister';

@Injectable({
  providedIn: "root",
})
export class CashRegisterService {
  headers = new HttpHeaders()
    .set("content-type", "application/json")
    .set("APIKey", "AccuritaAPIKey987654321")
    .set("Access-Control-Allow-Origin", "*")
    .set("Access-Control-Allow-Credentials", "true");

    readonly url = environment.url;
    readonly imageBasePath =environment.imageBasePath;

  // let hostname = window.location.hostname;
  // console.log(hostname);
  // console.log(window.location.origin);
  // console.log('port number');
  // console.log(window.location.port)
  constructor(private http: HttpClient) {}

 

  //#region  Cash Register API's
  GetAllCashRegister(): Observable<any> {
    return this.http.get<any>(environment.url + "/CashRegister/GetAll", {
      headers: this.headers,
    });
  }
  AddCashRegister(CashRegisterModel: CashRegister): Observable<any> {
    return this.http.post<any>(
      environment.url + "/CashRegister/Add",
      JSON.stringify(CashRegisterModel),
      { headers: this.headers }
    );
  }
  UpdateCashRegister(CashRegisterModel: CashRegister): Observable<any> {
    return this.http.post<any>(
      environment.url + "/CashRegister/Update",
      JSON.stringify(CashRegisterModel),
      { headers: this.headers }
    );
  }
  UpdateCashRegisterStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + "/CashRegister/UpdateStatus",
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }
  GetCashRegisterForDropdown(): Observable<any> {
    return this.http.get<any>(
      environment.url + "/CashRegister/GetDropDownData",
      { headers: this.headers }
    );
  }
  //#endregion
}