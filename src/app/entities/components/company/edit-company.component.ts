/**
 * creator leroux
 * date 2022/08/10
 */

import {Component, Input} from "@angular/core";
import {ControlContainer, NgForm} from "@angular/forms";
import {Document} from "@jmtgit/angular";

@Component({
    selector: 'jmt-entity-company-edit',
    template: `
        <mat-expansion-panel [expanded]="true" *ngIf="entityDocument">
            <mat-expansion-panel-header>
                <mat-icon color="primary">corporate_fare</mat-icon>
                Company Information
            </mat-expansion-panel-header>
            <div fxLayout="row" fxLayout.lt-md="column" fxLayoutGap.gt-sm="10px" *ngIf="edit else view">
                <div *ngIf="entityDocument?.data.company" fxLayoutGap="10px">
                    <mat-form-field appearance="fill">
                        <mat-label>Name</mat-label>
                        <input matInput required name="regName"
                               [(ngModel)]="entityDocument.data.company.regName"/>
                    </mat-form-field>
                    <mat-form-field appearance="fill">
                        <mat-label>Registration Number</mat-label>
                        <input matInput required name="regNumber"
                               [(ngModel)]="entityDocument.data.company.regNumber"/>
                    </mat-form-field>
                </div>
            </div>
            <ng-template #view>
                <div>
                    <p class="text-right text-label" fxFlex="30">Company Name:</p>
                    <p fxFlex class="text-value">{{entityDocument.data.company.regName}}</p>
                </div>
                <div>
                    <p class="text-right text-label" fxFlex="30">Registration Number:</p>
                    <p fxFlex class="text-value">{{entityDocument.data.company.regNumber}}</p>
                </div>
            </ng-template>
        </mat-expansion-panel>
        
    `,
    styles: [`
    `],
    viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class EditCompanyComponent {
    @Input() edit: boolean = false;
    @Input() entityDocument: Document | undefined;

    constructor() {

    }

}

