import { UpdateStatus } from './../../Helper/models/UpdateStatus';
import { ClientSource } from './../../Helper/models/ClientSource';

import { environment } from './../../../environments/environment';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { DeliveryMethod } from 'src/app/Helper/models/DeliveryMethod';

@Injectable({
  providedIn: "root",
})
export class ExtrasService {
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

 

  //#region   Client Source API's

  GetAllClientSource() {
    return this.http.get<any>(environment.url + "/ClientSource/GetAll", {
      headers: this.headers,
    });
  }

  AddClientSource(ClientSourceModel: ClientSource): Observable<any> {
    return this.http.post<any>(
      environment.url + "/ClientSource/Add",
      JSON.stringify(ClientSourceModel),
      { headers: this.headers }
    );
  }
  UpdateClientSource(ClientSourceModel: ClientSource): Observable<any> {
    return this.http.post<any>(
      environment.url + "/ClientSource/Update",
      JSON.stringify(ClientSourceModel),
      { headers: this.headers }
    );
  }
  DeleteClientSource(body): Observable<any> {
    return this.http.post<any>(
      environment.url + "/ClientSource/Delete",
      JSON.stringify(body),
      { headers: this.headers }
    );
  }
  UpdateClientSourceStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + "/ClientSource/UpdateStatus",
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

    //#endregion

  //#region   Delivery Method API's
  GetAllDeliveryMethod() {
    return this.http.get<any>(environment.url + "/ShippingMethod/GetAll", {
      headers: this.headers,
    });
  }
  UpdateClassificationStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + "/Classification/UpdateStatus",
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }
  AddDeliveryMethod(DeliveryMethodModel: DeliveryMethod): Observable<any> {
    return this.http.post<any>(
      environment.url + "/ShippingMethod/Add",
      JSON.stringify(DeliveryMethodModel),
      { headers: this.headers }
    );
  }
  UpdateDeliveryMethod(DeliveryMethodModel: DeliveryMethod): Observable<any> {
    return this.http.post<any>(
      environment.url + "/ShippingMethod/Update",
      JSON.stringify(DeliveryMethodModel),
      { headers: this.headers }
    );
  }
  UpdateDeliveryMethodStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + "/ShippingMethod/UpdateStatus",
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion

}