/**
 * creator leroux
 * date 2022/09/06
 */

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BlueprintService} from "@jmtgit/angular";
import {AppMqttService} from "../../common/app-mqtt.service";
import {EntanglementEntitiesDocuments} from "./documents/entanglement.entities.documents";

@Injectable({providedIn: 'root'})
export class EntanglementEntitiesBlueprintService extends BlueprintService {

    constructor(private http: HttpClient,
                private _appMqttService: AppMqttService) {
        super({_http: http, _mqtt: _appMqttService, Documents: EntanglementEntitiesDocuments});
        this.model.collection = 'entanglements.entities';
        this.model.schema = {
            name: {type: 'string', default: ''},
            _idDocument: {type: 'objectId'},
            _idCoupling: {type: 'objectId'},
            update: {type: 'boolean'},
            error: {type: 'boolean'},
            errorMessage: {type: 'string'},
            _hash: {type: 'string'},
        };
        this.model.projection = this.schemaToProjection(this.model.schema);
        this.model.defaultData = this.schemaToDefault(this.model.schema);
        this.model.sort = {'name': 1};
        this.model.search = 'name';
        this.model.version = 'EE1';
    }

    public resetEntanglement(entanglement: any): void {
        this.document.setDocument(entanglement);
        this.document.data.error = {__delete: true};
        this.document.data.errorMessage = {__delete: true};
        this.document.data.sourceHash = {__delete: true};
        this.document.data.update = true;
        console.log(this.document.data)
        this.document.save({
            next: () => {
            }
        })
    }

}
