import {AfterViewInit, Component, ElementRef, HostListener} from '@angular/core';
import {Document} from "@jmtgit/angular";
import {UserBlueprintService} from "./auth/services/user.blueprint.service";
import {EntitiesBlueprintService} from "./entities/services/entities.blueprint.service";
import {IMqttMessage, MqttService} from "ngx-mqtt";
import {MqttConnectionState} from "ngx-mqtt/lib/mqtt.model";
import {Subscription} from "rxjs";
import {AppMqttService} from "./common/app-mqtt.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
    title = 'jmt-app';
    // private readonly subscription: Subscription;
    public numberOfCols: number = 7;
    public selectedEntity: Document | undefined;

    constructor(public userBlueprintService: UserBlueprintService,
                public entitiesBlueprintService: EntitiesBlueprintService,
                private _appMqttService: AppMqttService,
                private _elRef: ElementRef) {
        entitiesBlueprintService.document.setId(undefined);
        entitiesBlueprintService.documents.load();
        userBlueprintService.loadMe();
        console.log('AppComponent')

    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this._calcCols();
    }

    public logout(): void {
        location.href = '/auth/logout'
    }

    ngAfterViewInit(): void {
        this._calcCols();
    }

    private _calcCols(): void {
        setTimeout(() => {
            this.numberOfCols = this._elRef.nativeElement.offsetWidth / 200;
        }, 0)
    }

    public save(): void {
        this.entitiesBlueprintService.save({
            next: () => {
                this.entitiesBlueprintService.documents.refresh();
                this.entitiesBlueprintService.document.setId(undefined);
            }
        })
    }

    public editEntity(entity: any): void {
        console.log(entity)
        this.selectedEntity = this.entitiesBlueprintService.factory.getDocumentById(entity._id);
    }
}
