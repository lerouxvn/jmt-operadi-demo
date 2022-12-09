/**
 * creator leroux
 * date 2022/08/12
 */

import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {Document} from "@jmtgit/angular";
import {ControlContainer, NgForm} from "@angular/forms";

@Component({
    selector: 'jmt-entity-emails-edit',
    template: `
        <mat-expansion-panel [expanded]="true" *ngIf="entityDocument">
            <mat-expansion-panel-header>
                <mat-icon color="primary">mail</mat-icon>
                E-Mail Addresses
            </mat-expansion-panel-header>
            <div *ngIf="edit else view">
                <div *ngFor="let email of entityDocument?.data.emails let i = index;">
                    <div fxFlexFill fxLayout="row" fxLayoutGap="10px" *ngIf="email._status">
                        <mat-form-field appearance="fill" fxFlex="30">
                            <mat-label>Type</mat-label>
                            <mat-select required name="emailType{{i}}"
                                        [(ngModel)]="email.type">
                                <mat-option value="Work">Work</mat-option>
                                <mat-option value="Home">Personal</mat-option>
                            </mat-select>
                        </mat-form-field>
                        <mat-form-field appearance="fill" fxFlex>
                            <mat-label>Address</mat-label>
                            <input matInput required name="emailValue{{i}}" [(ngModel)]="email.value"/>
                        </mat-form-field>
                        <button class="pr-1" mat-icon-button color="primary" (click)="remove(email)">
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
                <div *ngFor="let email of entityDocument?.data.emails">
                    <div *ngIf="email._status">
                        <p class="text-right text-label" fxFlex="30">{{email.type}}:</p>
                        <p fxFlex class="text-value">{{email.value}}</p>
                    </div>
                </div>
            </ng-template>
        </mat-expansion-panel>
    `,
    styles: [`
    `],
    viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class EmailsEditComponent implements OnInit {

    @Input() edit: boolean = false;
    @Input() entityDocument: Document | undefined;

    public newPhone: any = {};

    constructor() {
    }

    ngOnInit(): void {
        this.newPhone = this.entityDocument?.newSubDocument('emails');
    }

    public add(): void {
        this.edit = true
        this.entityDocument?.pushSubDocument('emails', this.newPhone);
        this.newPhone = this.entityDocument?.newSubDocument('emails');
    }

    public add2(): void {
        this.edit = true
        this.entityDocument?.pushSubDocument('emails', this.entityDocument?.newSubDocument('emails'));
        // this.newPhone = this.entityDocument?.newSubDocument('phones');
    }

    public remove(email: any): void {
        this.entityDocument?.popSubDocument('emails', email);
    }

}

