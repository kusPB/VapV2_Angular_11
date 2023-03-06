import { CryptoService } from './crypto.service';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../modules/shell/services/notification.service';
import { NotificationEnum } from '../Enum/notification.enum';
@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor(private cryptoService: CryptoService, private notificationService: NotificationService) { }

    setItem(key: string, data: string | any) {
        if (data) {
            try {
                localStorage.setItem(key, this.cryptoService.encrypt(JSON.stringify(data)));
            } catch (e) {
                this.catchException();
            }
        }
    }

    getItem(key: string) {
        if (key) {
            try {
                const storage = localStorage.getItem(key);
                return storage ? JSON.parse(this.cryptoService.decrypt(storage)) : '';
            } catch (e) {
                this.catchException();
                return null;
            }
        }
        return null;
    }

    removeItem(key: string) {
        if (key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                this.catchException();
            }
        }
    }

    clearAll() {
        try {
            localStorage.clear();
        } catch (e) {

            this.catchException()
        }
    }

    private catchException() {
        this.notificationService.notify(NotificationEnum.ERROR, 'Error', "An error has occured.");
    }
}