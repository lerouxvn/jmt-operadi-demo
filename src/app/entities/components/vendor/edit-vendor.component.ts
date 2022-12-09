/**
 * creator leroux
 * date 2022/08/14
 */

import {Component, Input} from "@angular/core";
import {ControlContainer, NgForm} from "@angular/forms";
import {Document} from "@jmtgit/angular";

@Component({
    selector: 'jmt-entity-vendor-edit',
    template: `
        <mat-expansion-panel [expanded]="true" *ngIf="entityDocument">
            <mat-expansion-panel-header>
                <mat-icon color="primary">shopping_cart</mat-icon>
                Vendor Information
            </mat-expansion-panel-header>
            <div fxLayout="row" fxLayout.lt-md="column" fxLayoutGap.gt-sm="10px" *ngIf="edit else view">
                <div *ngIf="entityDocument?.data.vendor" fxLayoutGap="10px">
                    <mat-form-field appearance="fill">
                        <mat-label>Discount</mat-label>
                        <input matInput required name="vendorDiscount" type="number"
                               [(ngModel)]="entityDocument.data.vendor.discount"/>
                    </mat-form-field>
                    <mat-form-field appearance="fill">
                        <mat-label>Credit Limit</mat-label>
                        <input matInput required name="vendorCreditLimit" type="curency"
                               [(ngModel)]="entityDocument.data.vendor.creditLimit"/>
                    </mat-form-field>
                </div>
            </div>
            <ng-template #view>
                <div *ngIf="entityDocument?.data.vendor.accNumber">
                    <p class="text-right text-label" fxFlex="30">Account Number:</p>
                    <p fxFlex class="text-value">{{entityDocument.data.vendor.accNumber}}</p>
                </div>
                <div>
                    <p class="text-right text-label" fxFlex="30">Discount:</p>
                    <p fxFlex class="text-value">{{entityDocument.data.vendor.discount}}</p>
                </div>
                <div>
                    <p class="text-right text-label" fxFlex="30">Credit Limit:</p>
                    <p fxFlex class="text-value">{{entityDocument.data.vendor.creditLimit}}</p>
                </div>
            </ng-template>
        </mat-expansion-panel>
        
    `,
    styles: [`
    `],
    viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class EditVendorComponent {
    @Input() edit: boolean = false;
    @Input() entityDocument: Document | undefined;

    constructor() {

    }

}

