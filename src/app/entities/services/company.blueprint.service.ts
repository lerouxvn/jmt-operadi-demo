/**
 * creator leroux
 * date 2022/03/02
 */

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BlueprintService, objectId} from "@jmtgit/angular";
import {EntitiesBlueprintService} from "./entities.blueprint.service";
import {AppMqttService} from "../../common/app-mqtt.service";

@Injectable({providedIn: 'root'})
export class CompanyBlueprintService extends BlueprintService {

    constructor(private http: HttpClient,
                private _entitiesBlueprintService: EntitiesBlueprintService,
                private _appMqttService: AppMqttService) {
        super({_http: http, _mqtt: _appMqttService});
        this.model = JSON.parse(JSON.stringify(_entitiesBlueprintService.model))
        this.model.schema.company = {
            type: 'document',
            schema: {
                _id: {type: 'objectId'},
                regName: {type: 'text', default: '', required: true},
                vatNumber: {type: 'text'},
                regNumber: {type: 'text'}
            }
        };
        this.model.schema.emails.defaultItems = [
            {type: 'Work', status: true}
        ]
        this.model.schema.phones.defaultItems = [
            {type: 'Work', status: true}
        ]
        this.model.projection = this.schemaToProjection(this.model.schema);
        this.model.defaultData = this.schemaToDefault(this.model.schema);
        this.model.defaultMatch = {company: {$exists: true}};
        this.model.version = 'C1';
        console.log(this.model.defaultData)
    }

    public save(args?: any) {
        if (this.document.data.company)
            this.document.data.name = this.document.data.company.regName;
        this.document.save(args);
    }

}
