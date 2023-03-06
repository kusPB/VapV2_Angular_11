import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-qr-print',
  templateUrl: './qr-print.component.html',
  styleUrls: ['./qr-print.component.scss']
})
export class QRPrintComponent implements OnInit {
  environmentData: any;
  imageBasePath:string;
  @Input() ProductDetails: any = null;
  @Input() isHidden: boolean = true;
  
  constructor() {
    this.environmentData = environment;
    this.imageBasePath = this.environmentData.imageBasePath;
  }

  ngOnInit() {
  }


}
