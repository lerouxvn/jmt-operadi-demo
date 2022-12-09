// /**
//  * creator leroux
//  * date 2022/03/03
//  */
//
//
// import {
//     AfterViewInit,
//     Component,
//     ElementRef,
//     EventEmitter,
//     HostListener,
//     Input,
//     OnChanges,
//     Output,
//     SimpleChanges
// } from "@angular/core";
// import {BlueprintService} from "@jmtgit/angular";
//
// @Component({
//     selector: 'jmt-list',
//     template: `
//         <div *ngIf="blueprintService" style="display: block">
//             <div>
//                 <mat-form-field appearance="outline" *ngIf="showSearch">
//                     <mat-label>Search</mat-label>
//                     <input matInput name="listSearchTerm" [(ngModel)]="blueprintService.documents.searchTerm"
//                            (keyup)="blueprintService.searchKeyUp($event)"
//                            autofocus/>
//                     <button mat-icon-button matSuffix (click)="blueprintService.clearSearch()"
//                             [attr.aria-label]="'Clear search'">
//                         <mat-icon>clear</mat-icon>
//                     </button>
//                 </mat-form-field>
//                 <div fxFlex></div>
//                 <button class="pr-1" mat-icon-button color="primary" *ngIf="showRefresh"
//                         (click)="blueprintService.documents.refresh()">
//                     <mat-icon>refresh</mat-icon>
//                 </button>
//                 <button class="pr-1" mat-icon-button color="primary" *ngIf="showAdd && add" (click)="add()">
//                     <mat-icon>add</mat-icon>
//                 </button>
//             </div>
//             <div *ngIf="!blueprintService.documents.isLoading && !blueprintService.hasError else loadingSaving">
//                 <ng-content *ngIf="blueprintService.documents.data"></ng-content>
//
//                 <mat-paginator [length]="blueprintService.documents.total"
//                                [pageSize]="blueprintService.documents.pageSize"
//                                [pageIndex]="blueprintService.documents.page"
//                                [pageSizeOptions]="[2,10,20]"
//                                (page)="blueprintService.documents.setPageIndex($event.pageIndex,$event.pageSize) "
//                                aria-label="Select page">
//                 </mat-paginator>
//
//             </div>
//             <ng-template #loadingSaving>
//                 <mat-error class="p-2" *ngIf="blueprintService.hasError">
//                     <strong>{{ blueprintService.errorMessage }}</strong>
//                 </mat-error>
//                 <mat-progress-bar mode="query" *ngIf="blueprintService.documents.isLoading"></mat-progress-bar>
//                 <div class="p-1 text-center" fxFlexFill
//                      *ngIf="blueprintService.documents.isLoading">{{ loadingDescription }}</div>
//             </ng-template>
//         </div>
//     `,
//     styles: []
// })
// export class ListComponent implements AfterViewInit, OnChanges {
//
//     @Input() showSearch: boolean = true;
//     @Input() showRefresh: boolean = true;
//     @Input() showAdd: boolean = true;
//     @Input() blueprintService: BlueprintService | undefined;
//     @Input() add: (() => void) | undefined;
//     @Input() loadingDescription: string = 'Loading. Please Wait... '
//
//     @Output() onResized: EventEmitter<number> = new EventEmitter();
//
//     constructor(private _elRef: ElementRef) {
//         this.load();
//     }
//
//     ngOnChanges(changes: SimpleChanges): void {
//         if (changes.blueprintService)
//             this.load();
//     }
//
//     @HostListener('window:resize', ['$event'])
//     onResize(event: any) {
//         // console.log('window resized')
//         this._emitResize();
//     }
//
//     ngAfterViewInit(): void {
//         this._emitResize();
//     }
//
//     private load(): void {
//         if (this.blueprintService && this.blueprintService.documents.dataAge < ((new Date()).getTime() - 60 * 1000)) {
//             console.log('RELOAD')
//             this.blueprintService.documents.refresh();
//         }
//     }
//
//     private _emitResize(timeout: number = 0): void {
//         setTimeout(() => {
//             // console.log('list _emitResize')
//             if (this._elRef.nativeElement.offsetWidth === 0)
//                 this._emitResize(100);
//             else
//                 this.onResized.emit(this._elRef.nativeElement.offsetWidth);
//         }, timeout)
//     }
//
// }
//
