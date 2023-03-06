import { environment } from 'src/environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-help-list',
  templateUrl: './help-list.component.html'})
export class HelpListComponent implements OnInit, OnDestroy {
  helpList: any[] = [];
  baseImagePath = '';
  imageBasePath;
  usermodel: any;
  SearchText="";

  constructor(private apiService: vaplongapi ,private router: Router, private storageService: StorageService) {

    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'View',
      Description: `View Development Activity Manuals`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
    }
    this.apiService.SaveActivityLog(obj).toPromise().then(x => { });
  }
  ngOnDestroy() {
  }

  ngOnInit() {
    this.baseImagePath =environment.HELP_IMAGE_PATH;
    this.apiService.GetAllHelpActive().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.helpList = response.Helps;
      }
      else {
        console.log('internal server error ! not getting api data');
      }
    });
  }

  onSearchTextChange(event){
    if(event.length>=3){
      var model ={
        ColumnName: event
      }
      this.apiService.GetAllHelpByFilter(model).pipe(untilDestroyed(this)).subscribe((response: any) => {
          
        if (response.ResponseText === 'success') {
          this.helpList = response.Helps;
        }
        else {
          console.log('internal server error ! not getting api data');
        }
      });
    }
    // else
    // {
    //   this.helpList = [];
    // }
      }

}
