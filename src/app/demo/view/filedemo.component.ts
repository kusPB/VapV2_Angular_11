import { Component } from '@angular/core';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { NotificationEnum } from 'src/app/shared/Enum/notification.enum';
/* import {BreadcrumbService} from '../../app.breadcrumb.service'; */

@Component({
    templateUrl: './filedemo.component.html',
})
export class FileDemoComponent {

    uploadedFiles: any[] = [];

    constructor(private notificationService: NotificationService, /* private breadcrumbService: BreadcrumbService */) {
        /* this.breadcrumbService.setItems([
            {label: 'File'}
        ]); */
    }

    onUpload(event) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.notificationService.notify(NotificationEnum.INFO, 'Success', 'File Uploaded');
    }

    onBasicUpload(event) {
        this.notificationService.notify(NotificationEnum.INFO, 'Success', 'File Uploaded with Basic Mode');
    }
}
