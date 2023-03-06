import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-help-detail',
  templateUrl: './help-detail.component.html',
  styleUrls: ['./help-detail.component.scss']
})
export class HelpDetailComponent implements OnInit, OnDestroy {
  events1 = [
    { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi-align-justify', color: '#9C27B0', image: 'game-controller.jpg' },
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi-align-justify', color: '#673AB7' },
    { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi-align-justify', color: '#FF9800' },
    { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi-align-justify', color: '#607D8B' }
  ];
  help: any = {
    HelpDetails: []
  };
  baseImagePath = '';
  imgSrc: any = '';
  displayImage = false;
  constructor(private apiService: vaplongapi, private activatedRoute: ActivatedRoute) { }
  ngOnDestroy() {
  }

  ngOnInit() {
    this.baseImagePath = environment.HELP_IMAGE_PATH;
    const snapshot = this.activatedRoute.snapshot;
    const Param = { ID: snapshot.params.id };
    this.apiService.GetHelpById(Param).pipe(untilDestroyed(this)).subscribe(x => {
      if (x.ResponseCode == 0) {
        this.help = x.Help;
        this.help.HelpDetails.forEach(element1 => {
          element1.Color = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ","
            +
            Math.floor(Math.random() * 255) + ")";
        });
      }
    });
  }
  popUpImageFuction(imgSrc) {
    this.imgSrc = [imgSrc];
    this.displayImage = true;
  }
}
