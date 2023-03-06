import { Component,OnInit, OnDestroy } from '@angular/core';

import { StorageService } from 'src/app/shared/services/storage.service';
import { NotificationService } from 'src/app/modules/shell/services/notification.service';
import { Subscription,interval } from 'rxjs';

@Component({
  selector: 'app-session-time-counter',
  templateUrl: './session-time-counter.component.html',
  styleUrls: ['./session-time-counter.component.scss']
})
export class SessionTimeCounterComponent implements OnInit ,OnDestroy{

  private subscription: Subscription;
  
  public dateNow = new Date();
  public dDay = new Date();
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;

  public timeDifference;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;

  SessionStartTime:any;

  constructor(
    private storageService: StorageService,
    private notificationService: NotificationService) {
      this.SessionStartTime = this.storageService.getItem('SessionStartTime');
      this.dDay = new Date(this.SessionStartTime);      
      //this.dDay.setHours(this.dDay.getHours() + 4);
      
      //const inc = 1000 * 60 * 60 // an hour
      //const dec = (1000 * 60 * 60) * -1 // an hour
      // new Date( _date.getTime() + inc )
      // new Date( _date.getTime() + dec )
      // 4 hours is total session time but i am setting 10 mins margin between session timeout that why subtracted 10 mins
      const inc = (4*(1000 * 60 * 60)) - 600000;
      this.dDay = new Date(this.dDay.getTime()+inc)
  }
 


  private getTimeDifference () {
      this.timeDifference = this.dDay.getTime() - new  Date().getTime();
      this.allocateTimeUnits(this.timeDifference);
  }

private allocateTimeUnits (timeDifference) {
      this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
      this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
      this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
      this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
}
  
  ngOnInit() {
     this.subscription = interval(1000)
         .subscribe(x => { this.getTimeDifference(); });
  }

 ngOnDestroy() {
    this.subscription.unsubscribe();
 }

}
