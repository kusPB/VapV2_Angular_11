// import { AppMainComponent } from '../../../app.main.component';
import {Component} from '@angular/core';
import {SelectItem} from 'primeng/api';
import { ShellComponent } from '../shell.component';

@Component({
    selector: 'app-rightmenu',
    templateUrl: './rightmenu.component.html',
})
export class AppRightmenuComponent{

    amount: SelectItem[];

    selectedAmount: any;

    constructor(public app: ShellComponent) {
        this.amount = [
            {label: '*****24', value: {id: 1, name: '*****24', code: 'A1'}},
            {label: '*****75', value: {id: 2, name: '*****75', code: 'A2'}}
        ];
    }
}
