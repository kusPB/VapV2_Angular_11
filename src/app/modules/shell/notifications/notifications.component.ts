import { NotificationService } from './../services/notification.service';

import { Component, OnInit, OnDestroy } from '@angular/core';

// import { Message } from 'primeng/components/common/api';
import { Subscription } from 'rxjs';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit, OnDestroy {

  messages: any[] = [];

  constructor(
    private messageService: MessageService,
    private readonly notificationService: NotificationService) {
  }

  ngOnInit() {
    //this.subscribeToNotifications();
    this.notificationService.getMessage()
    .subscribe(notification => {
      this.messageService.add(notification);
      // this.messages.push(notification);
      // this.changeDetector.markForCheck();
    });
  }

  ngOnDestroy() {
  }

  private subscribeToNotifications() {
    this.notificationService.getMessage()
      .subscribe(notification => {
        
        this.messageService.add(notification);
        // this.messages.push(notification);
        // this.changeDetector.markForCheck();
      });
  }

  
}
