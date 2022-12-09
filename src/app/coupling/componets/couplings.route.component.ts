/**
 * creator leroux
 * date 2022/08/26
 */

import {Component} from "@angular/core";
import {CouplingBlueprintService} from "../services/coupling.blueprint.service";

@Component({
    template: `
        <!--        <div *ngFor="let coupling of couplingBlueprintService.meta">-->
        <!--            <p [routerLink]="[coupling.name,'add']">{{ coupling.description }}</p>-->
        <!--        </div>-->

        <ng-template #toolbarMore>
            <button mat-icon-button [matMenuTriggerFor]="menu" color="primary" aria-label="available couplings">
                <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
                <div fxLayout="row wrap" fxLayoutAlign="space-evenly center" style="max-width: 50px!important;">
                    <button mat-menu-item *ngFor="let coupling of couplingBlueprintService.meta"
                            [routerLink]="[coupling.name,'add']">
                        <mat-icon>dialpad</mat-icon>
                        <span>{{ coupling.description }}</span>
                    </button>
                </div>
            </mat-menu>
        </ng-template>

        <ngx-jmt-documents [blueprintService]="couplingBlueprintService" [toolbar]="toolbarMore">
            <div class="p-1" *ngIf="couplingBlueprintService.documents.data"
                 fxLayout="row wrap">
                <mat-card *ngFor="let coupling of couplingBlueprintService.documents.data"
                          (click)="editCoupling(coupling)"
                          class="link-hover m-1"
                          style="width: 250px"
                          [routerLink]="[coupling.couplingType,coupling._id]">
                    <mat-icon [color]="coupling.status?'primary':'warn'" *ngIf="!coupling.executing">leak_remove
                    </mat-icon>
                    <mat-spinner [diameter]="24" *ngIf="coupling.executing"
                                 style="color: darkorange"></mat-spinner>
                    <mat-card-header>
                        <mat-card-title>
                            {{ coupling.name }}
                        </mat-card-title>
                        <mat-card-subtitle>
                            {{ coupling.couplingType }}
                        </mat-card-subtitle>
                    </mat-card-header>
                    <mat-card-content>
                        <div fxLayout="column" fxLayoutAlign="center center">
                            <mat-progress-bar mode="determinate"
                                              *ngIf="coupling.stats"
                                              [value]="((coupling.stats?.entangled || 0)/(coupling.stats?.total || 1))*100"></mat-progress-bar>

                            <small>Documents: {{ coupling.stats?.entangled }}
                                /{{ coupling.stats?.total }}</small>
                            <mat-error *ngIf="coupling.stats?.error">Entanglement Errors: {{ coupling.stats?.error }}</mat-error>
                            <small *ngIf="coupling.executeDate">Last execute
                                Date: {{ coupling.executeDate | date : "yyyy/MM/dd HH:mm:ss" }}</small>
                        </div>
                    </mat-card-content>
                </mat-card>
            </div>
        </ngx-jmt-documents>
    `,
    styles: [`
    `]
})
export class CouplingsRouteComponent {

    constructor(public couplingBlueprintService: CouplingBlueprintService) {
    }

    public editCoupling(coupling: any): void {
        console.log(coupling)
        // this.bcCouplingBlueprintService.document.setId(coupling._id);
    }

}

