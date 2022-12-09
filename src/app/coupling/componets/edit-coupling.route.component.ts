/**
 * creator leroux
 * date 2022/08/26
 */

import {Component, OnDestroy, ViewChild} from "@angular/core";
import {MatStep} from "@angular/material/stepper";
import {CouplingBlueprintService} from "../services/coupling.blueprint.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {NgForm} from "@angular/forms";

@Component({
    template: `
        <div *ngIf="meta">
            <!--            {{meta | json}}-->

            <ngx-jmt-document [blueprintService]="couplingBlueprintService">
                <mat-card>
                    <mat-card-header>
                        <mat-card-title>{{ couplingBlueprintService.document.data.name || meta.description || 'Coupling - no description found !!' }}</mat-card-title>
                        <div fxFlex fxLayoutAlign="end center">
                            <section>
                                <mat-slide-toggle
                                        color="primary"
                                        #status
                                        [(ngModel)]="couplingBlueprintService.document.data.status"
                                        [disabled]="!couplingBlueprintService.document.id">
                                    {{ couplingBlueprintService.document.data.status ? 'Enabled' : 'Disabled'}}
                                </mat-slide-toggle>
                            </section>
                        </div>
                    </mat-card-header>
                    <mat-card-content>
                        <form #addForm=ngForm class="pt-1">
                            <mat-vertical-stepper [linear]="true" #stepper
                                                  *ngIf="!couplingBlueprintService.document.data.executing else executing">
                                <mat-step [stepControl]="addForm.controls['auth']"
                                          state="company"
                                          [editable]="true"
                                          errorMessage="Name is required.">
                                    <ng-template matStepLabel>Auth Information</ng-template>
                                    <fieldset ngModelGroup="auth" class="pt-1">
                                        <jmt-document-schema [data]="couplingBlueprintService.document.data.information"
                                                             [schema]="meta.auth"></jmt-document-schema>
                                        <button class="pr-1" mat-button color="primary"
                                                *ngIf="!couplingBlueprintService.isTesting && addForm.controls['auth']"
                                                [disabled]="!addForm.controls['auth'].valid"
                                                (click)="testConnection(serverInfo)">
                                            <mat-icon>cloud_sync</mat-icon>
                                            Test Connection
                                        </button>
                                    </fieldset>
                                </mat-step>
                                <mat-step #serverInfo
                                          [stepControl]="addForm.controls['serverInfo']"
                                          state="company"
                                          [editable]="true"
                                          errorMessage="Name is required.">
                                    <ng-template matStepLabel>Data Information</ng-template>
                                    <fieldset ngModelGroup="serverInfo" class="pt-1">
                                        <jmt-document-schema [data]="couplingBlueprintService.document.data.information"
                                                             [schema]="meta.data"></jmt-document-schema>
                                        <div class="m-1">
                                            <button mat-button matStepperNext>Next
                                            </button>
                                        </div>
                                    </fieldset>
                                </mat-step>
                                <mat-step #serverInfo
                                          [stepControl]="addForm.controls['matchInfo']"
                                          state="company"
                                          [editable]="true"
                                          errorMessage="Name is required.">
                                    <ng-template matStepLabel>Information</ng-template>
                                    <div fxLayout="row">
                                        <fieldset ngModelGroup="matchInfo" class="pt-1">
                                            <div>
                                                <mat-form-field appearance="fill">
                                                    <mat-label>Failed retry interval</mat-label>
                                                    <input matInput name="retry" type="number"
                                                           [(ngModel)]="couplingBlueprintService.document.data.retry"/>
                                                    <mat-hint>Seconds</mat-hint>
                                                </mat-form-field>
                                            </div>
                                        </fieldset>
                                        <fieldset ngModelGroup="matchInfo" class="pt-1">
                                            <div>
                                                <mat-form-field appearance="fill" fxFlex>
                                                    <mat-label>Fallback interval</mat-label>
                                                    <input matInput name="fallback" type="number"
                                                           [(ngModel)]="couplingBlueprintService.document.data.fallback"/>
                                                    <mat-hint>Number of seconds</mat-hint>
                                                </mat-form-field>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <fieldset ngModelGroup="matchInfo" class="pt-1">
                                        <div>
                                            <mat-form-field appearance="fill" fxFlex>
                                                <mat-label>Match</mat-label>
                                                <textarea matInput name="match"
                                                          style="min-height: 120px"
                                                          [(ngModel)]="couplingBlueprintService.document.data.match"></textarea>
                                            </mat-form-field>
                                        </div>
                                    </fieldset>
                                </mat-step>
                            </mat-vertical-stepper>
                            <ng-template #executing>
                                <div fxLayoutAlign="center center">
                                    <mat-spinner></mat-spinner>
                                </div>
                            </ng-template>
                        </form>
                        <!--                        {{ couplingBlueprintService.document.data | json}}-->
                    </mat-card-content>
                    <mat-card-actions>
                        <div fxLayout="column">
                            <div fxLayout="column" *ngIf="couplingBlueprintService.document.data.stats"
                                 fxLayoutAlign="center center">
                                <mat-progress-bar mode="determinate"
                                                  [value]="((couplingBlueprintService.document.data.stats?.entangled || 0)/(couplingBlueprintService.document.data.stats?.total || 1))*100"></mat-progress-bar>

                                <small>Documents: {{ couplingBlueprintService.document.data.stats?.entangled }}
                                    /{{ couplingBlueprintService.document.data.stats?.total }}</small>
                                <mat-error *ngIf="couplingBlueprintService.document.data.stats?.error">Entanglement
                                    Errors: {{ couplingBlueprintService.document.data.stats?.error }}</mat-error>
                                <small *ngIf="couplingBlueprintService.document.data.executeDate">
                                    Last execute Date:
                                    {{ couplingBlueprintService.document.data.executeDate | date : "yyyy/MM/dd HH:mm:ss" }}</small>
                            </div>
                            <div class="pt-1" *ngIf="couplingBlueprintService.document.data.error">
                                <mat-card>
                                    <mat-card-header>
                                        <mat-card-title>
                                            <!--                                            <mat-icon color="warn">priority_high</mat-icon>-->
                                            Error
                                        </mat-card-title>
                                    </mat-card-header>
                                    <mat-card-content>
                                        <mat-error>{{ couplingBlueprintService.document.data.errorMessage }}</mat-error>
                                    </mat-card-content>
                                </mat-card>
                            </div>
                            <div fxFlex fxLayout="row wrap" fxLayoutGap="10px" fxLayoutAlign="center center"
                                 class="pt-1"
                                 *ngIf="couplingBlueprintService.document.data.executing">
                                <button mat-raised-button color="accent"
                                        *ngIf="addForm.valid && couplingBlueprintService.document.id"
                                        [disabled]="couplingBlueprintService.document.data.stopExecute"
                                        (click)="couplingBlueprintService.stop()">
                                    <mat-icon>dangerous</mat-icon>
                                    {{couplingBlueprintService.document.data.stopExecute ? 'stopping' : 'stop'}}
                                </button>
                            </div>
                            <div fxFlex fxLayout="row wrap" fxLayoutGap="10px" fxLayoutAlign="center center"
                                 class="pt-1"
                                 *ngIf="!couplingBlueprintService.document.data.executing">
                                <button mat-raised-button color="primary"
                                        *ngIf="addForm.valid && couplingBlueprintService.document.id"
                                        (click)="couplingBlueprintService.reset()">
                                    <mat-icon>restart_alt</mat-icon>
                                    reset
                                </button>
                                <button mat-raised-button color="primary"
                                        *ngIf="addForm.valid && couplingBlueprintService.document.id"
                                        (click)="couplingBlueprintService.execute()">
                                    <mat-icon>run_circle</mat-icon>
                                    execute
                                </button>
                                <button mat-button color="primary"
                                        *ngIf="addForm.valid && couplingBlueprintService.document.id"
                                        (click)="couplingBlueprintService.stats()">
                                    <mat-icon>query_stats</mat-icon>
                                    stats
                                </button>
                                <button mat-button color="primary"
                                        *ngIf="addForm.valid"
                                        [disabled]="!couplingBlueprintService.document.isDirty()"
                                        (click)="save()">
                                    <mat-icon>save_alt</mat-icon>
                                    save
                                </button>
                                <!--        <button class="pr-1" mat-button color="primary"-->
                                <!--                (click)="cancel()">-->
                                <!--                    <mat-icon>close</mat-icon>-->
                                <!--          cancel-->
                                <!--        </button>-->
                            </div>
                        </div>
                    </mat-card-actions>
                </mat-card>
            </ngx-jmt-document>
        </div>
    `,
    styles: [`
    `]
})
export class EditCouplingRouteComponent implements OnDestroy {

    private readonly _activatedRouteSubscription: Subscription;
    private readonly _blueprintSubscription: Subscription;

    public couplingType: string | undefined;
    public meta: any | undefined;

    @ViewChild('addForm') addForm: NgForm | undefined;


    constructor(public couplingBlueprintService: CouplingBlueprintService,
                private _router: Router,
                private _activatedRoute: ActivatedRoute) {
        couplingBlueprintService.document.setId(undefined);
        // companyBlueprintService.refreshDocuments();
        console.log(couplingBlueprintService.document.dataAge)
        this._blueprintSubscription = this.couplingBlueprintService.observable.subscribe((val: any) => {
            if (val.metaLoaded)
                this._getMeta();
        })

        this._activatedRouteSubscription = this._activatedRoute.params.subscribe((params: Params) => {
            console.log(params)
            if (params.couplingType) {
                this.couplingType = params.couplingType;
                this._getMeta();
            }
            if (params.id && params.id === 'add') {
                this.couplingBlueprintService.document.setId(undefined);
            } else {
                this.couplingBlueprintService.document.setId(params.id);
            }
        })
    }

    private _getMeta(): void {
        if (this.couplingBlueprintService.meta.length > 0) {
            for (let m of this.couplingBlueprintService.meta) {
                if (m.name === this.couplingType) {
                    this.meta = m
                    break;
                }
            }
        }
    }

    ngOnDestroy(): void {
        this._activatedRouteSubscription && this._activatedRouteSubscription.unsubscribe();
    }

    public save(): void {
        console.log(this.addForm)
        if (this.meta.descriptionTemplate) {
            let name = this.meta.descriptionTemplate;
            for (let m of name.match(/{{\w+}}/ig)) {
                let key = m.replace(/{/ig, '').replace(/}/ig, '')
                if (this.couplingBlueprintService.document.data.information[key]) {
                    name = name.replace(m, this.couplingBlueprintService.document.data.information[key])
                }
            }
            this.couplingBlueprintService.document.data.name = name;
        }
        this.couplingBlueprintService.document.save({
            next: (data: any) => {
                // this.couplingBlueprintService.document.setId(undefined);
                // this.couplingBlueprintService.documents.refresh();
                this._router.navigate(['couplings', data.couplingType, data._id], {replaceUrl: true}).catch(console.error);
            }
        })
    }

    public editCoupling(coupling: any): void {
        console.log(coupling)
        this.couplingBlueprintService.document.setId(coupling._id);
    }

    public testConnection(nextStep: MatStep): void {
        this.couplingBlueprintService.document.data.couplingType ||= this.couplingType;
        this.couplingBlueprintService.testConnection({
            next: () => {
                nextStep.select();
            }
        })
    }

}

