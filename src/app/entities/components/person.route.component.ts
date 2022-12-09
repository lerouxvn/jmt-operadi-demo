/**
 * creator leroux
 * date 2021/10/04
 */

import {Component} from "@angular/core";
import {PersonBlueprintService} from "../services/person.blueprint.service";
import {Router} from "@angular/router";

@Component({
    template: `
        <ngx-jmt-documents [blueprintService]="personBlueprintService" [add]="add">
            <div class="p-1" fxLayout="row wrap" fxLayoutAlign="center space-evenly"
                 *ngIf="personBlueprintService.documents.data">
                <jmt-entity-card *ngFor="let entity of personBlueprintService.documents.data"
                                 [entityData]="entity"></jmt-entity-card>
                <!--                    <pre *ngFor="let entity of personBlueprintService.documents.data" (click)="editEntity(entity)">-->
                <!--                        {{ entity | json }}-->
                <!--                    </pre>-->
            </div>
        </ngx-jmt-documents>
    `,
    styles: [`
    `]
})
export class PersonRouteComponent {

    constructor(public personBlueprintService: PersonBlueprintService, private _router: Router) {
        personBlueprintService.document.setId(undefined)
        // personBlueprintService.refreshDocuments();
    }

    public save(): void {
        this.personBlueprintService.save({
            next: () => {
                this.personBlueprintService.document.setId(undefined);
                // this.personBlueprintService.documents.refresh();
            }
        })
    }

    public add = () => {
        this._router.navigate(['person', 'add']).catch(console.error)
    }
}

