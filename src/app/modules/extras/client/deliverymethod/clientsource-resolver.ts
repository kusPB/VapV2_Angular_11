import { ExtrasService } from '../../extras.service';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';


@Injectable()
export class DeliverymethodResolver implements Resolve<any> {
    constructor(private extrasService: ExtrasService) { }

    async resolve() {
        const AllDeliveryMethodList: any = await this.extrasService.GetAllDeliveryMethod();
        // const bankAccountType: any = await this.extrasService.getAllBankAccountType();
        return {
            AllDeliveryMethodList,
            // bankAccountType
        };
    }
}
