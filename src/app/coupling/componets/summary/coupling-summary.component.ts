/**
 * creator leroux
 * date 2022/06/17
 */

import {AfterViewInit, Component, Input, OnChanges, OnDestroy} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {SimpleChanges} from "@angular/core";
import {CouplingBlueprintService} from "../../services/coupling.blueprint.service";
import {Document} from "@jmtgit/angular";

@Component({
    selector: 'jmt-coupling-summary',
    template: `
        <div *ngIf="couplingDocument" class="pt-1">
            <ngx-jmt-document [document]="couplingDocument">
                <span i18n class="text-label">Name:</span><span class="text-value">{{ couplingDocument.data.name }}</span>
<!--                {{ couplingDocument.data | json }}-->
            </ngx-jmt-document>
        </div>
    `,
    styles: []
})
export class CouplingSummaryComponent implements AfterViewInit, OnDestroy, OnChanges {

    public couplingDocument: Document | undefined;

    @Input() couplingId: string | undefined;

    constructor(public couplingBlueprintService: CouplingBlueprintService,
                private _dialog: MatDialog) {

    }

    ngAfterViewInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.couplingId && this.couplingId) {
            this.couplingDocument = this.couplingBlueprintService.factory.getDocumentById(this.couplingId);
        }
    }

    ngOnDestroy(): void {
    }


}

