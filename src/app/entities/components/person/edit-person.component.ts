/**
 * creator leroux
 * date 2022/08/12
 */

import {Component, Input} from "@angular/core";
import {ControlContainer, NgForm} from "@angular/forms";
import {Document} from "@jmtgit/angular";

@Component({
    selector: 'jmt-entity-person-edit',
    template: `
        <mat-expansion-panel [expanded]="true" *ngIf="entityDocument">
            <mat-expansion-panel-header>
                <mat-icon color="primary">person</mat-icon>
                Personal Information
            </mat-expansion-panel-header>
            <div fxLayout="row" fxLayout.lt-md="column" fxLayoutGap.gt-sm="10px" *ngIf="edit else view">
                <div *ngIf="entityDocument?.data.person" fxLayoutGap="10px">
                    <mat-form-field appearance="fill">
                        <mat-label>Name</mat-label>
                        <input matInput required name="firstName"
                               [(ngModel)]="entityDocument.data.person.firstName"/>
                    </mat-form-field>
                    <mat-form-field appearance="fill">
                        <mat-label>lastname</mat-label>
                        <input matInput required name="lastName"
                               [(ngModel)]="entityDocument.data.person.lastName"/>
                    </mat-form-field>
                </div>
            </div>
            <ng-template #view>
                <div>
                    <p class="text-right text-label" fxFlex="30">Name:</p>
                    <p fxFlex class="text-value">{{entityDocument.data.person.lastName}} {{entityDocument.data.person.firstName}}</p>
                </div>
            </ng-template>
        </mat-expansion-panel>
    `,
    styles: [`
    `],
    viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class EditPersonComponent {
    @Input() edit: boolean = false;
    @Input() entityDocument: Document | undefined;

    constructor() {

    }

}

