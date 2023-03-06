import { ExtrasService } from './../../extras.service';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';


@Injectable()
export class ClientSourceResolver implements Resolve<any> {
    constructor(private extrasService: ExtrasService) { }

    async resolve() {
        const AllClientSourceList: any = await this.extrasService.GetAllClientSource();
        // const bankAccountType: any = await this.extrasService.getAllBankAccountType();
        return {
            AllClientSourceList,
            // bankAccountType
        };
    }
}
