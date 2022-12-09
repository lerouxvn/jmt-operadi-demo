/**
 * creator leroux
 * date 2022/08/11
 */

import {Component, Input} from "@angular/core";
import {ControlContainer, NgForm} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
    selector: 'jmt-entity-card',
    template: `
        <mat-card class="m-1" [ngClass]="{'link-hover':entityData._id}" style="width: 250px" *ngIf="entityData"
                  (click)="open()">
            <div fxLayout="row">
                <mat-icon class="pr-1 pb-1" style="color: darkgray; font-size: xx-large" *ngIf="entityData.company">
                    corporate_fare
                </mat-icon>
                <mat-icon class="pr-1 pb-1" style="color: darkgray; font-size: xx-large " *ngIf="entityData.person">
                    person
                </mat-icon>
                <mat-card-header>
                    <mat-card-title style="min-height: 40px">
                        {{ entityData.name }}
                    </mat-card-title>
                </mat-card-header>
            </div>
            <mat-card-content style="height: 100px">
                <div *ngFor="let phone of entityData.phones">
                    <p class="text-right text-label" fxFlex="30">{{phone.type}}:</p>
                    <p class="text-value" fxFlex>{{phone.value}}</p>
                </div>
                <div *ngFor="let email of entityData.emails">
                    <p class="text-right text-label" fxFlex="30">{{email.type}}:</p>
                    <p class="text-value" fxFlex>{{email.value}}</p>
                </div>
            </mat-card-content>
            <mat-card-actions>
                <div fxFlex>
                </div>
                <!--                <button type="button" mat-raised-button (click)="editEntity(entity)">Edit</button>-->
            </mat-card-actions>
        </mat-card>
    `,
    styles: [`
    `]
})
export class EntityCardComponent {
    @Input() entityData: any | undefined;

    constructor(private _router: Router) {

    }

    public open(): void {
        if (this.entityData?._id)
            this._router.navigate(['/entity', this.entityData._id]).catch(console.error)
    }

}

