/**
 * creator leroux
 * date 2022/08/27
 */

import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from "@angular/core";
import {ControlContainer, NgForm, NgModelGroup} from "@angular/forms";
import {formViewProvider} from "./pipes";
import {MatOptionSelectionChange} from "@angular/material/core";

@Component({
    selector: 'jmt-document-schema',
    template: `
        <div *ngIf="data && schema" style="display: block">
            <div fxLayout="row wrap" fxLayoutAlign="start center">
                <div class="m-1" *ngFor="let item of schema | keys">
                    <mat-form-field appearance="fill"
                                    *ngIf="item.key && ['text','number'].includes(item.value.type)">
                        <mat-label>{{ item.value.description }}</mat-label>
                        <input matInput
                               [type]="item.value.type"
                               [required]="item.value.required"
                               [readonly]="item.value.disabled"
                               name="{{ item.key }}"
                               [(ngModel)]="data[item.key]"/>
                        <mat-hint *ngIf="item.value.hint">{{item.value.hint}}</mat-hint>
                        <mat-error *ngIf="item.value.error">{{item.value.error}}</mat-error>
                    </mat-form-field>
                    <mat-form-field appearance="fill"
                                    *ngIf="item.key && item.value.type === 'select'">
                        <mat-label>{{ item.value.description }}</mat-label>
                        <mat-select
                                [required]="item.value.required"
                                [disabled]="item.value.disabled"
                                name="{{ item.key }}"
                                [(ngModel)]="data[item.key]">
                            <mat-option *ngFor="let opt of item.value.options"
                                        [value]="opt.key">{{ opt.value }}</mat-option>
                        </mat-select>
                        <mat-hint *ngIf="item.value.hint">{{item.value.hint}}</mat-hint>
                        <mat-error *ngIf="item.value.error">{{item.value.error}}</mat-error>
                    </mat-form-field>
                    <mat-form-field appearance="fill"
                                    *ngIf="item.key && item.value.type === 'selectInfo'">
                        <mat-label>{{ item.value.description }}</mat-label>
                        <mat-select
                                [required]="item.value.required"
                                [disabled]="item.value.disabled"
                                name="{{ item.key }}"
                                [(ngModel)]="data[item.key]">
                            <mat-option *ngFor="let opt of (data.meta || [])[item.value.source]"
                                        (onSelectionChange)="selectionChange($event,data,item,opt.value)"
                                        [value]="opt.key">{{ opt.value }}</mat-option>
                        </mat-select>
                        <mat-hint *ngIf="item.value.hint">{{item.value.hint}}</mat-hint>
                        <mat-error *ngIf="item.value.error">{{item.value.error}}</mat-error>
                    </mat-form-field>
                </div>

            </div>
        </div>
    `,
    styles: [],
    viewProviders: [formViewProvider]
    // viewProviders: [{provide: ControlContainer, useExisting: NgModelGroup}]
})
export class DocumentSchema implements AfterViewInit, OnChanges {

    @Input() schema: any | undefined;
    @Input() data: any | undefined;

    @Output() onResized: EventEmitter<number> = new EventEmitter();

    constructor(private _elRef: ElementRef) {
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        // console.log('window resized')
        this._emitResize();
    }

    ngAfterViewInit(): void {
        this._emitResize();
    }

    private _emitResize(timeout: number = 0): void {
        setTimeout(() => {
            // console.log('list _emitResize')
            if (this._elRef.nativeElement.offsetWidth === 0)
                this._emitResize(100);
            else
                this.onResized.emit(this._elRef.nativeElement.offsetWidth);
        }, timeout)
    }

    public selectionChange(event: MatOptionSelectionChange, data: any, item: any, value: string): void {
        if (event.isUserInput) {
            if (item.value.valueField) {
                data[item.value.valueField] = value;
            }
        }
    }
}

