/**
 * creator leroux
 * date 2021/10/04
 */

import {Component} from "@angular/core";
import {CompanyBlueprintService} from "../services/company.blueprint.service";
import {Router} from "@angular/router";

@Component({
    template: `
        <!--        <ngx-jmt-document [blueprintService]="companyBlueprintService">-->
        <!--            <mat-card>-->
        <!--                <mat-card-header>-->
        <!--                    <mat-card-title>Company</mat-card-title>-->
        <!--                    <div class="toolbar-spacer"></div>-->
        <!--                </mat-card-header>-->
        <!--                <mat-card-content>-->
        <!--                    <form #addForm=ngForm class="pt-1">-->
        <!--                        <jmt-entity-company-edit-->
        <!--                                [entityDocument]="companyBlueprintService.document"-->
        <!--                                [edit]="edit"></jmt-entity-company-edit>-->

        <!--                        <jmt-entity-phones-edit-->
        <!--                                [entityDocument]="companyBlueprintService.document"-->
        <!--                                [edit]="edit"></jmt-entity-phones-edit>-->
        <!--                    </form>-->

        <!--                    {{ companyBlueprintService.document.data | json }}-->

        <!--                </mat-card-content>-->
        <!--                <mat-card-actions fxFlexFill>-->
        <!--                    <div fxFlex="100%"></div>-->
        <!--                    <button class="pr-1" mat-raised-button color="primary"-->
        <!--                            (click)="edit =!edit">-->
        <!--                        <mat-icon>save_alt</mat-icon>-->
        <!--                        edit-->
        <!--                    </button>-->
        <!--                    <button class="pr-1" mat-raised-button color="primary"-->
        <!--                            *ngIf="addForm.valid && !companyBlueprintService.document.isSaving"-->
        <!--                            (click)="save()">-->
        <!--                        <mat-icon>save_alt</mat-icon>-->
        <!--                        save-->
        <!--                    </button>-->
        <!--                    <button class="pr-1" mat-button color="primary"-->
        <!--                            (click)="cancel()">-->
        <!--                        <mat-icon>close</mat-icon>-->
        <!--                        cancel-->
        <!--                    </button>-->
        <!--                </mat-card-actions>-->
        <!--            </mat-card>-->
        <!--        </ngx-jmt-document>-->

        <ngx-jmt-documents [blueprintService]="companyBlueprintService" [add]="add">
            <div class="p-1" fxLayout="row wrap" fxLayoutAlign="center space-evenly"
                 *ngIf="companyBlueprintService.documents.data">
                <jmt-entity-card *ngFor="let entity of companyBlueprintService.documents.data"
                                 [entityData]="entity"></jmt-entity-card>

                <!--                    <pre *ngFor="let entity of companyBlueprintService.documents.data" (click)="editEntity(entity)">-->
                <!--                        {{ entity | json }}-->
                <!--                    </pre>-->
            </div>


        </ngx-jmt-documents>
    `,
    styles: [`
    `]
})
export class CompanyRouteComponent {
    public edit: boolean = false

    constructor(public companyBlueprintService: CompanyBlueprintService, private _router: Router) {
        companyBlueprintService.document.setId(undefined);
        // companyBlueprintService.refreshDocuments();
    }

    public save(): void {
        this.companyBlueprintService.save({
            next: () => {
                this.companyBlueprintService.document.setId(undefined);
                this.edit = false
                // this.companyBlueprintService.documents.refresh();
            }
        })
    }

    public add = () => {
        this._router.navigate(['company', 'add']).catch(console.error)
    }

    public editEntity(entity: any): void {
        console.log(entity)
        this.edit = true;
        this.companyBlueprintService.document.setId(entity._id);
    }

    public cancel(): void {
        this.companyBlueprintService.document.setId(undefined);
    }

}

