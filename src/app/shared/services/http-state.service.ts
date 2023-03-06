import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IHttpState } from "src/app/Helper/models/http-state.model";

@Injectable({
    providedIn: 'root'
})
export class HttpStateService {
    public state = new BehaviorSubject<any>(false);

    constructor() { }
}