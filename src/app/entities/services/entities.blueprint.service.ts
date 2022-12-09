/**
 * creator leroux
 * date 2022/03/02
 */

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BlueprintService} from "@jmtgit/angular";
import {AppMqttService} from "../../common/app-mqtt.service";

@Injectable({providedIn: 'root'})
export class EntitiesBlueprintService extends BlueprintService {

    constructor(private http: HttpClient,
                private _appMqttService: AppMqttService) {
        super({_http: http, _mqtt: _appMqttService});
        this.model.collection = 'entities';
        this.model.schema = {
            status: {type: 'boolean', default: true},
            name: {type: 'string', default: ''},
            emails: {
                type: 'documents',
                schema: {
                    _id: {type: 'objectId'},
                    value: {type: 'text', default: '', required: true},
                    type: {type: 'text', default: 'Work', required: true},
                    status: {type: 'boolean', default: true}
                },
                default: []
            },
            phones: {
                type: 'documents', schema: {
                    _id: {type: 'objectId'},
                    value: {type: 'text', default: '', required: true},
                    type: {type: 'text', default: 'Cell', required: true},
                    status: {type: 'boolean', default: true}
                },
                default: []
            },
        };
        // this.model.projection =  this.schemaToProjection(this.model.schema);
        this.model.defaultData = this.schemaToDefault(this.model.schema);
        this.model.listProjection = {
            status: 1,
            phones: {value: 1, type: 1},
            emails: 1,
            company: {status: 1},
            person: {status: 1},
            name: 1
        };
        this.model.sort = {'name': 1};
        this.model.search = 'name';
        this.model.version = 'E1';
        this.aggregate.pipeline = [
            {$match: {$or: [{person: {$exists: true}}, {company: {$exists: true}}]}},
            {$unwind: '$phones'},
            {$sort: {name: 1}},
            {$limit: 20},
            {$project: {name: 1, phoneType: '$phones.type', number: '$phones.value'}}
        ]
    }

    public save(args?: any) {
        if (this.document.data.person)
            this.document.data.name = `${this.document.data.person.lastName} ${this.document.data.person.firstName}`;
        else if (this.document.data.company)
            this.document.data.name = this.document.data.company.regName;
        this.document.save(args);
    }

}
