/**
 * creator leroux
 * date 2022/08/11
 */

import {Component} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs";
import {EntitiesBlueprintService} from "../services/entities.blueprint.service";
import {EntanglementEntitiesBlueprintService} from "../services/entanglement.entities.blueprint.service";

@Component({
    template: `
        <ngx-jmt-document [blueprintService]="entitiesBlueprintService">
            <mat-card>
                <mat-card-header>
                    <!--                    {{ entitiesBlueprintService.document.data.name }}-->
                    <div class="toolbar-spacer">
                        <button *ngIf="!entitiesBlueprintService.document.data.client"
                                mat-button
                                (click)="addClientInfo()">Client
                        </button>
                        <button *ngIf="!entitiesBlueprintService.document.data.vendor"
                                mat-button
                                (click)="addVendorInfo()">Vendor
                        </button>
                    </div>
                </mat-card-header>
                <mat-card-content>
                    <form #addForm=ngForm class="pt-1">
                        <jmt-entity-company-edit
                                *ngIf="entitiesBlueprintService.document.data.company"
                                [edit]="edit"
                                [entityDocument]="entitiesBlueprintService.document"></jmt-entity-company-edit>

                        <jmt-entity-person-edit
                                *ngIf="entitiesBlueprintService.document.data.person"
                                [edit]="edit"
                                [entityDocument]="entitiesBlueprintService.document"></jmt-entity-person-edit>


                        <jmt-entity-client-edit
                                *ngIf="entitiesBlueprintService.document.data.client"
                                [edit]="edit"
                                [entityDocument]="entitiesBlueprintService.document"></jmt-entity-client-edit>

                        <jmt-entity-vendor-edit
                                *ngIf="entitiesBlueprintService.document.data.vendor"
                                [edit]="edit"
                                [entityDocument]="entitiesBlueprintService.document"></jmt-entity-vendor-edit>


                        <div fxLayout="row wrap" fxLayoutAlign="space-evenly center">
                            <jmt-entity-phones-edit
                                    [edit]="edit"
                                    [entityDocument]="entitiesBlueprintService.document"></jmt-entity-phones-edit>

                            <jmt-entity-emails-edit
                                    [edit]="edit"
                                    [entityDocument]="entitiesBlueprintService.document"></jmt-entity-emails-edit>
                        </div>

                        <ngx-jmt-documents [blueprintService]="entanglementEntitiesBlueprintService"
                                           [showRefresh]="false" [showSearch]="false">
                            <mat-expansion-panel [expanded]="true"
                                                 *ngIf="entanglementEntitiesBlueprintService.documents.data">
                                <mat-expansion-panel-header>
                                    <mat-icon color="primary">leak_remove</mat-icon>
                                    Entanglements ({{ entanglementEntitiesBlueprintService.documents.data.length }})
                                </mat-expansion-panel-header>
                                <div *ngFor="let entanglement of entanglementEntitiesBlueprintService.documents.data">
                                    <div fxLayout="row">
                                        <!--                                    <mat-icon *ngIf="entanglement.update" style="color: darkorange">question_mark</mat-icon>-->
                                        <mat-spinner [diameter]="24" *ngIf="entanglement.update && !entanglement.error"
                                                     style="color: darkorange"></mat-spinner>
                                        <mat-icon *ngIf="!entanglement.update && !entanglement.error"
                                                  style="color: darkgreen">check
                                        </mat-icon>
                                        <mat-icon *ngIf="entanglement.error" color="warn">error
                                        </mat-icon>
                                        <div class="pl-1" fxFlex>
                                            <jmt-coupling-summary
                                                    [couplingId]="entanglement._idCoupling"></jmt-coupling-summary>
                                            <mat-error>{{ entanglement.errorMessage }}</mat-error>
                                        </div>
                                        <button type="button" mat-mini-fab *ngIf="entanglement.error"
                                                (click)="entanglementEntitiesBlueprintService.resetEntanglement(entanglement)"
                                                color="accent">
                                            <mat-icon>restart_alt</mat-icon>
                                        </button>
                                    </div>
                                    <!--                            {{ coupling | json }}-->
                                </div>
                            </mat-expansion-panel>
                        </ngx-jmt-documents>
                    </form>
                </mat-card-content>
                <mat-card-actions>
                    <div fxFlex fxLayoutGap="10px" fxLayoutAlign="center center">
                        <button class="m-1" mat-button color="primary"
                                *ngIf="!edit"
                                (click)="edit=!edit">
                            <mat-icon>edit</mat-icon>
                            edit
                        </button>
                        <button class="m-1" mat-button color="primary"
                                *ngIf="edit && addForm.valid && !entitiesBlueprintService.document.isSaving"
                                (click)="save()">
                            <mat-icon>save_alt</mat-icon>
                            save
                        </button>
                        <button class="m-1" mat-button color="primary"
                                *ngIf="edit"
                                (click)="cancel()">
                            <mat-icon>close</mat-icon>
                            cancel
                        </button>
                    </div>
                </mat-card-actions>
            </mat-card>
            <!--            {{ this.entanglementEntitiesBlueprintService.documents.data | json }}-->
        </ngx-jmt-document>
        <!--        dirty{{ entitiesBlueprintService.document.isDirty() }}-->
        <!--        {{ entitiesBlueprintService.document.data | json }}-->

    `,
    styles: [`
    `]
})
export class EditEntityRouteComponent {
    private readonly _paramSubscription: Subscription;

    public edit: boolean = false

    constructor(public entitiesBlueprintService: EntitiesBlueprintService,
                public entanglementEntitiesBlueprintService: EntanglementEntitiesBlueprintService,
                private _activatedRoute: ActivatedRoute,) {

        this._paramSubscription = this._activatedRoute.params.subscribe((param: Params) => {
            if (param.id) {
                if (param.id === 'new') {
                    // this._toolbarService.headerText = 'New';
                    this.entitiesBlueprintService.document.setId(undefined);
                } else {
                    // this.entityItemService = this._entityFactoryService.getEntityById(param.id);
                    this.entitiesBlueprintService.document.setId(param.id);
                    this.entanglementEntitiesBlueprintService.documents.params.match = {_idDocument: param.id}
                    this.entanglementEntitiesBlueprintService.documents.refresh()
                }
            }
        })


    }

    public save(): void {
        this.entitiesBlueprintService.save({
            next: () => {
                this.edit = false;
                // this.entitiesBlueprintService.document.setId(undefined);
                // this.companyBlueprintService.documents.refresh();
            }
        })
    }

    public editEntity(entity: any): void {
        console.log(entity)
        // this.entitiesBlueprintService.document.setId(entity._id);
    }

    public cancel(): void {
        this.edit = false;
        this.entitiesBlueprintService.document.undoEdit();
    }

    public addClientInfo(): void {
        this.entitiesBlueprintService.document.data.client = {}
    }

    public addVendorInfo(): void {
        this.entitiesBlueprintService.document.data.vendor = {}
    }

}

