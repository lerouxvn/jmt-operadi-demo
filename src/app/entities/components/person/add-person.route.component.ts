/**
 * creator leroux
 * date 2022/08/12
 */

import {Component, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {PersonBlueprintService} from "../../services/person.blueprint.service";
import {NgForm} from "@angular/forms";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";

@Component({
    template: `
        <ngx-jmt-document [blueprintService]="personBlueprintService">
            <mat-card>
                <mat-card-header>
                    <!--                    {{ entitiesBlueprintService.document.data.name }}-->
                    <div class="toolbar-spacer"></div>
                </mat-card-header>
                <mat-card-content>
                    <form #addForm=ngForm class="pt-1">
                        <mat-vertical-stepper [linear]="false" #stepper>
                            <mat-step [stepControl]="addForm.controls['personalInfo']" state="personal">
                                <ng-template matStepLabel>Personal Information</ng-template>
                                <fieldset ngModelGroup="personalInfo" class="pt-1">
                                    <!--                                    {{ addForm.controls }}-->
                                    <div fxLayout.lt-md="column" fxLayout="row" fxLayoutGap="10px">
                                        <mat-form-field appearance="fill">
                                            <mat-label>Name</mat-label>
                                            <input matInput required name="firstName"
                                                   [(ngModel)]="personBlueprintService.document.data.person.firstName"/>
                                        </mat-form-field>
                                        <mat-form-field appearance="fill">
                                            <mat-label>Last name</mat-label>
                                            <input matInput required name="lastName"
                                                   [(ngModel)]="personBlueprintService.document.data.person.lastName"/>
                                        </mat-form-field>
                                    </div>
                                    <div class="m-1">
                                        <button mat-button matStepperNext>Next</button>
                                    </div>
                                </fieldset>
                            </mat-step>
                            <mat-step [stepControl]="addForm.controls['phonesInfo']" state="phones">
                                <ng-template matStepLabel>Phone Numbers</ng-template>
                                <fieldset ngModelGroup="phonesInfo" class="pt-1">
                                    <div *ngFor="let phone of personBlueprintService.document.data.phones let i = index;">
                                        <div fxFlexFill fxLayout="row" fxLayoutGap="10px" *ngIf="phone.status">
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
                                                <input matInput required name="phoneValue{{i}}"
                                                       [(ngModel)]="phone.value"/>
                                            </mat-form-field>
                                            <button class="pr-1" mat-icon-button color="primary"
                                                    (click)="removePhone(phone)">
                                                <mat-icon>delete</mat-icon>
                                            </button>
                                        </div>
                                    </div>
                                    <button class="pr-1" mat-mini-fab color="primary" (click)="addPhone()">
                                        <mat-icon>add</mat-icon>
                                    </button>
                                    <div class="m-1">
                                        <button mat-button matStepperPrevious>Back</button>
                                        <button mat-button matStepperNext>Next</button>
                                    </div>
                                </fieldset>
                            </mat-step>
                            <mat-step [stepControl]="addForm.controls['emailsInfo']" state="emails">
                                <ng-template matStepLabel>E-Mails</ng-template>
                                <fieldset ngModelGroup="emailsInfo" class="pt-1">
                                    <div *ngFor="let email of personBlueprintService.document.data.emails let i = index;">
                                        <div fxFlexFill fxLayout="row" fxLayoutGap="10px" *ngIf="email.status">
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
                                                <input matInput required name="emailValue{{i}}"
                                                       [(ngModel)]="email.value"/>
                                            </mat-form-field>
                                            <button class="pr-1" mat-icon-button color="primary"
                                                    (click)="removeEmail(email)">
                                                <mat-icon>delete</mat-icon>
                                            </button>
                                        </div>
                                    </div>
                                    <button class="pr-1" mat-mini-fab color="primary" (click)="addEmail()">
                                        <mat-icon>add</mat-icon>
                                    </button>
                                    <div class="m-1">
                                        <button mat-button matStepperPrevious>Back</button>
                                        <button mat-button matStepperNext>Next</button>
                                    </div>
                                </fieldset>
                            </mat-step>
                            <mat-step state="confirm">
                                <ng-template matStepLabel>Confirm Information</ng-template>
                                <div class="m-1">
                                    <jmt-entity-card [entityData]="personBlueprintService.document.data" ></jmt-entity-card>
                                    <button mat-button matStepperPrevious>Back</button>
                                    <button class="pr-1" mat-raised-button color="primary"
                                            *ngIf="addForm.valid && !personBlueprintService.document.isSaving"
                                            (click)="save()">
                                        <mat-icon>save_alt</mat-icon>
                                        save
                                    </button>
                                </div>
                            </mat-step>
                            <ng-template matStepperIcon="personal">
                                <mat-icon>person</mat-icon>
                            </ng-template>
                            <ng-template matStepperIcon="phones">
                                <mat-icon>call</mat-icon>
                            </ng-template>
                            <ng-template matStepperIcon="emails">
                                <mat-icon>mail</mat-icon>
                            </ng-template>
                            <ng-template matStepperIcon="confirm">
                                <mat-icon>done_outline</mat-icon>
                            </ng-template>
                        </mat-vertical-stepper>
                    </form>
                </mat-card-content>
                <mat-card-actions fxFlexFill>
                    <div fxFlex="100%"></div>
                    <button class="pr-1" mat-button color="primary"
                            (click)="cancel()">
                        <mat-icon>close</mat-icon>
                        cancel
                    </button>
                </mat-card-actions>
            </mat-card>
        </ngx-jmt-document>

    `,
    styles: [`
    `],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: {displayDefaultIndicatorType: false, showError: true},
        },
    ],
})
export class AddPersonRouteComponent {

    @ViewChild('addForm') addForm: NgForm | undefined;

    constructor(public personBlueprintService: PersonBlueprintService,
                private _router: Router,) {

        this.personBlueprintService.document.setId(undefined);

    }

    public save(): void {
        this.personBlueprintService.save({
            next: (data: any) => {
                this._router.navigate(['/entity', data._id], {replaceUrl: true}).catch(console.error)
            }
        })
    }

    public cancel(): void {
        this.personBlueprintService.document.setId(undefined);
    }

    public addEmail(): void {
        this.personBlueprintService.document.pushSubDocument('emails', this.personBlueprintService.document.newSubDocument('emails'));
    }

    public removeEmail(email: any): void {
        this.personBlueprintService.document.popSubDocument('emails', email);
    }

    public addPhone(): void {
        this.personBlueprintService.document.pushSubDocument('phones', this.personBlueprintService.document.newSubDocument('phones'));
    }

    public removePhone(phone: any): void {
        this.personBlueprintService.document.popSubDocument('phones', phone);
    }
}

