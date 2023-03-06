import { Component, ElementRef, AfterViewInit, Input, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-code',
    template: `
        <pre [ngClass]="'language-' + lang"><code #code><ng-content></ng-content>
</code></pre>
    `,
    styleUrls: ['./app.code.component.scss']
})
export class AppCodeComponent implements AfterViewInit {

    @Input() lang = 'markup';

    @ViewChild('code') codeViewChild: ElementRef;

    constructor(public el: ElementRef) { }

    ngAfterViewInit() {
        // tslint:disable-next-line: no-string-literal
        if (window['Prism']) {
            // tslint:disable-next-line: no-string-literal
            window['Prism'].highlightElement(this.codeViewChild.nativeElement);
        }
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [AppCodeComponent],
    declarations: [AppCodeComponent]
})
export class AppCodeModule { }
