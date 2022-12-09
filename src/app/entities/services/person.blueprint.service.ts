/**
 * creator leroux
 * date 2022/03/02
 */

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {EntitiesBlueprintService} from "./entities.blueprint.service";
import {AppMqttService} from "../../common/app-mqtt.service";
import {BlueprintService}  from "@jmtgit/angular";

@Injectable({providedIn: 'root'})
export class PersonBlueprintService extends BlueprintService {

    constructor(private http: HttpClient,
                private _entitiesBlueprintService: EntitiesBlueprintService,
                private _appMqttService: AppMqttService) {
        super({_http: http, _mqtt: _appMqttService});
        this.model = JSON.parse(JSON.stringify(_entitiesBlueprintService.model))
        this.model.schema.person = {
            type: 'document',
            schema: {
                _id: {type: 'objectId'},
                firstName: {type: 'text', default: '', required: true},
                lastName: {type: 'text', default: '', required: true}
            }
        };
        this.model.schema.emails.defaultItems = [
            {type: 'Work', status: true}
        ]
        this.model.schema.phones.defaultItems = [
            {type: 'Cell', status: true},
            {type: 'Home', status: true},
            {type: 'Work', status: true}
        ]
        this.model.projection = this.schemaToProjection(this.model.schema);
        this.model.defaultData = this.schemaToDefault(this.model.schema);
        this.model.defaultMatch = {person: {$exists: true}};
        this.model.version = 'P1';
    }

    public save(args?: any) {
        if (this.document.data.person)
            this.document.data.name = `${this.document.data.person.lastName} ${this.document.data.person.firstName}`;

        this.document.save(args);
    }

}
