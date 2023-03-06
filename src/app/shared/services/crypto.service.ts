import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class CryptoService {

    // SECRET_KEY= 'y_#U$.&^$*fcx@t28mu';

    constructor() { }
    encrypt(value: any) {
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(value), environment.SECRET_KEY).toString();
        return ciphertext;
    }

    decrypt(encryptedValue: string) {
        const bytes = CryptoJS.AES.decrypt(encryptedValue.toString(), environment.SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
    }
}
