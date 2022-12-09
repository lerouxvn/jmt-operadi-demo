/**
 * creator leroux
 * date 2022/02/15
 */

import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {Document} from "@jmtgit/angular";
import {ControlContainer, NgForm} from "@angular/forms";

@Component({
    selector: 'jmt-entity-phones-edit',
    template: `
        <mat-expansion-panel [expanded]="true" *ngIf="entityDocument">
            <mat-expansion-panel-header>
                <mat-icon color="primary">phone</mat-icon>
                Phone Numbers
            </mat-expansion-panel-header>
            <!--            <mat-card-header>-->
            <!--                <div class="toolbar-spacer"></div>-->
            <!--                <button *ngIf="entityDocument?.data.phones[0] && entityDocument?.data.phones[0].value" class="pr-1"-->
            <!--                        mat-icon-button color="primary" (click)="edit=!edit">-->
            <!--                    <mat-icon>edit</mat-icon>-->
            <!--                </button>-->
            <!--                <button class="pr-1" mat-icon-button color="primary" (click)="add()">-->
            <!--                    <mat-icon>add</mat-icon>-->
            <!--                </button>-->
            <!--            </mat-card-header>-->
            <!--            <pre *ngIf="entityDocument?.data.phones[0]">{{ entityDocument?.data.phones[0].type}}</pre>-->
            <div *ngIf="edit else view">
                <div *ngFor="let phone of entityDocument?.data.phones let i = index;">
                    <div fxFlexFill fxLayout="row" fxLayoutGap="10px" *ngIf="phone._status">
                        <mat-form-field appearance="fill" fxFlex="30">
                            <mat-label>Type</mat-label>
                            <mat-select required name="phoneType{{i}}"
                                        [(ngModel)]="phone.type">
                                <mat-option value="Cell">Cell</mat-option>
                                <mat-option value="Work">Work</mat-option>
                                <mat-option value="Home">Home</mat-option>
                                <mat-option value="Fax">Fax</mat-option>
                            </mat-select>
                        </mat-form-field>
                        <mat-form-field appearance="fill" fxFlex>
                            <mat-label>Number</mat-label>
                            <input matInput required name="phoneValue{{i}}" [(ngModel)]="phone.value"/>
                        </mat-form-field>
                        <button class="pr-1" mat-icon-button color="primary" (click)="remove(phone)">
                            <mat-icon>delete</mat-icon>
                        </button>
                    </div>
                </div>
                <button class="pr-1" mat-mini-fab color="primary" (click)="add2()">
                    <mat-icon>add</mat-icon>
                </button>
<!--                <div *ngIf="newPhone">-->
<!--                    <div fxFlexFill fxLayout="row" fxLayoutGap="10px">-->
<!--                        <mat-form-field appearance="fill" fxFlex="30">-->
<!--                            <mat-label>Type</mat-label>-->
<!--                            <mat-select name="newPhoneType"-->
<!--                                        [(ngModel)]="newPhone.type">-->
<!--                                <mat-option value="Cell">Cell</mat-option>-->
<!--                                <mat-option value="Work">Work</mat-option>-->
<!--                                <mat-option value="Home">Home</mat-option>-->
<!--                                <mat-option value="Fax">Fax</mat-option>-->
<!--                            </mat-select>-->
<!--                        </mat-form-field>-->
<!--                        <mat-form-field appearance="fill" fxFlex>-->
<!--                            <mat-label>Number</mat-label>-->
<!--                            <input matInput name="newPhoneValue" [(ngModel)]="newPhone.value"/>-->
<!--                        </mat-form-field>-->
<!--                        <button class="pr-1" mat-mini-fab color="primary" (click)="add()">-->
<!--                            <mat-icon>add</mat-icon>-->
<!--                        </button>-->
<!--                    </div>-->
<!--                </div>-->
            </div>
            <ng-template #view>
                <div *ngFor="let phone of entityDocument?.data.phones">
                    <div *ngIf="phone._status">
                        <p class="text-right text-label" fxFlex="30">{{phone.type}}:</p>
                        <p fxFlex class="text-value">{{phone.value}}</p>
                    </div>
                </div>
            </ng-template>
        </mat-expansion-panel>

        <!--        <mat-card *ngIf="entityDocument">-->
        <!--            <mat-card-header>-->
        <!--                <mat-card-title>-->
        <!--                    <mat-icon>contact_phone</mat-icon>-->
        <!--                    Phone Numbers-->
        <!--                </mat-card-title>-->
        <!--                <div class="toolbar-spacer"></div>-->
        <!--                <button class="pr-1" mat-icon-button color="primary" (click)="edit=!edit">-->
        <!--                    <mat-icon>edit</mat-icon>-->
        <!--                </button>-->
        <!--                <button class="pr-1" mat-icon-button color="primary" (click)="add()">-->
        <!--                    <mat-icon>add</mat-icon>-->
        <!--                </button>-->
        <!--            </mat-card-header>-->
        <!--            <mat-card-content>-->
        <!--            </mat-card-content>-->
        <!--            <mat-card-actions fxFlexFill>-->
        <!--            </mat-card-actions>-->
        <!--        </mat-card>-->

    `,
    styles: [`
    `],
    viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class PhonesEditComponent implements OnInit {

    @Input() edit: boolean = false;
    @Input() entityDocument: Document | undefined;

    public newPhone: any = {};

    constructor() {
    }

    ngOnInit(): void {
        this.newPhone = this.entityDocument?.newSubDocument('phones');
    }

    public add(): void {
        this.edit = true
        this.entityDocument?.pushSubDocument('phones', this.newPhone);
        this.newPhone = this.entityDocument?.newSubDocument('phones');
    }

    public add2(): void {
        this.edit = true
        this.entityDocument?.pushSubDocument('phones', this.entityDocument?.newSubDocument('phones'));
        // this.newPhone = this.entityDocument?.newSubDocument('phones');
    }

    public remove(phone: any): void {
        this.entityDocument?.popSubDocument('phones', phone);
    }

}

