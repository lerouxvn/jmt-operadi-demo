/**
 * creator leroux
 * date 2022/08/11
 */

import {Component, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {CompanyBlueprintService} from "../../services/company.blueprint.service";
import {NgForm} from "@angular/forms";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";

@Component({
    template: `
        <ngx-jmt-document [blueprintService]="companyBlueprintService">
            <mat-card>
                <mat-card-header>
                    <!--                    {{ entitiesBlueprintService.document.data.name }}-->
                    <div class="toolbar-spacer"></div>
                </mat-card-header>
                <mat-card-content>
                    <form #addForm=ngForm class="pt-1">
                        <mat-vertical-stepper [linear]="false" #stepper>
                            <mat-step [stepControl]="addForm.controls['companyInfo']" state="company"
                                      [editable]="isEditable" errorMessage="Name is required.">
                                <ng-template matStepLabel>Company Information</ng-template>
                                <fieldset ngModelGroup="companyInfo" class="pt-1">
                                    <!--                                    {{ addForm.controls }}-->
                                    <div fxLayout.lt-md="column" fxLayout="row" fxLayoutGap="10px">
                                        <mat-form-field appearance="fill" fxFlex="60">
                                            <mat-label>Name</mat-label>
                                            <input matInput required name="regName"
                                                   [(ngModel)]="companyBlueprintService.document.data.company.regName"/>
                                        </mat-form-field>
                                        <mat-form-field appearance="fill" fxFlex="40">
                                            <mat-label>Registration Number</mat-label>
                                            <input matInput required name="regNumber"
                                                   [(ngModel)]="companyBlueprintService.document.data.company.regNumber"/>
                                        </mat-form-field>
                                    </div>
                                    <div class="m-1">
                                        <button mat-button matStepperNext>Next</button>
                                    </div>
                                </fieldset>
                            </mat-step>
                            <mat-step [stepControl]="addForm.controls['phonesInfo']" state="phones"
                                      [editable]="isEditable">
                                <ng-template matStepLabel>Phone Numbers</ng-template>
                                <fieldset ngModelGroup="phonesInfo">
                                    <div *ngFor="let phone of companyBlueprintService.document.data.phones let i = index;">
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
                                        <button class="pr-1" mat-icon-button color="primary"
                                                (click)="removePhone(phone)">
                                            <mat-icon>delete</mat-icon>
                                        </button>
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
                            <mat-step [stepControl]="addForm.controls['emailsInfo']" state="emails"
                                      [editable]="isEditable">
                                <ng-template matStepLabel>E-Mails</ng-template>
                                <fieldset ngModelGroup="emailsInfo">
                                    <div *ngFor="let email of companyBlueprintService.document.data.emails let i = index;">
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
                            <mat-step state="confirm" [editable]="isEditable">
                                <ng-template matStepLabel>Confirm Information</ng-template>
                                <div class="m-1">
                                    <jmt-entity-card
                                            [entityData]="companyBlueprintService.document.data"></jmt-entity-card>
                                    <button mat-button matStepperPrevious>Back</button>
                                    <button class="pr-1" mat-raised-button color="primary"
                                            *ngIf="addForm.valid && !companyBlueprintService.document.isSaving"
                                            (click)="save()">
                                        <mat-icon>save_alt</mat-icon>
                                        save
                                    </button>
                                </div>
                            </mat-step>
                            <ng-template matStepperIcon="company">
                                <mat-icon>corporate_fare</mat-icon>
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
export class AddCompanyRouteComponent {
    public isEditable: boolean = true;
    @ViewChild('addForm') addForm: NgForm | undefined;

    constructor(public companyBlueprintService: CompanyBlueprintService,
                private _router: Router,) {

        this.companyBlueprintService.document.setId(undefined);

    }

    public save(): void {
        this.companyBlueprintService.save({
            next: (data: any) => {
                this._router.navigate(['/entity', data._id], {replaceUrl: true}).catch(console.error)
            }
        })
    }

    public cancel(): void {
        this.companyBlueprintService.document.setId(undefined);
    }

    public addEmail(): void {
        this.companyBlueprintService.document.pushSubDocument('emails', this.companyBlueprintService.document.newSubDocument('emails'));
    }

    public removeEmail(email: any): void {
        this.companyBlueprintService.document.popSubDocument('emails', email);
    }

    public addPhone(): void {
        this.companyBlueprintService.document.pushSubDocument('phones', this.companyBlueprintService.document.newSubDocument('phones'));
    }

    public removePhone(phone: any): void {
        this.companyBlueprintService.document.popSubDocument('phones', phone);
    }
}

