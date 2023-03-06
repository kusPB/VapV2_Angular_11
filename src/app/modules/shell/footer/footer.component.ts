import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class AppFooterComponent implements OnInit {
  environmentData: any;

  constructor() { 
    this.environmentData =  environment;
  }

  ngOnInit() {
  }

}
