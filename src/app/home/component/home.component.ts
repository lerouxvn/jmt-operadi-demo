/**
 * creator leroux
 * date 2021/10/04
 */

import {Component} from "@angular/core";

@Component({
    template: `
        <h1>HOME</h1>
    `,
    styles: [`
    `]
})
export class HomeComponent {

    public data: any[] = [
        [
            {desc: 'Errors', list: []}
        ], [], []
    ]

    constructor() {
        // personBlueprintService.refreshDocuments();
    }

}

