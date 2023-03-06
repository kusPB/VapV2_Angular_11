import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
// import { Message } from 'primeng/components/common/api';

type Severities = 'success' | 'info' | 'warn' | 'error';

@Injectable()
export class NotificationService {

  public notificationChange = new Subject<any>();

  notify(severity: Severities, summary: string, detail: string) {
    this.notificationChange.next({ severity, summary, detail });
  }
  getMessage(): Observable<any> {
    return this.notificationChange.asObservable();
}
}
