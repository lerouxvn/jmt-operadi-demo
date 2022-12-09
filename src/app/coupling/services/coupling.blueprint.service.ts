/**
 * creator leroux
 * date 2022/04/17
 */

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AppMqttService} from "../../common/app-mqtt.service";
import { BlueprintService } from "@jmtgit/angular";

@Injectable({providedIn: 'root'})
export class CouplingBlueprintService extends BlueprintService {

    public meta: any[] = [];
    public isTesting: boolean = false;

    constructor(private http: HttpClient,
                private _appMqttService: AppMqttService) {
        super({_http: http, _mqtt: _appMqttService});
        this.model.collection = 'couplings';
        this.model.schema = {
            status: {type: 'boolean', default: false},
            couplingType: {type: 'string', default: ''},
            name: {type: 'string', default: ''},
            action: {type: 'text'},
            match: {type: 'text'},
            retry: {type: 'number'},
            fallback: {type: 'number'},
            testDate: {type: 'number'},
            testResult: {type: 'boolean'},
            error: {type: 'boolean'},
            errorMessage: {type: 'text'},
            executing: {type: 'boolean'},
            executeDate: {type: 'number'},
            information: {
                // type: 'document',
                // schema: {
                //     _id: {type: 'objectId'},
                // }
            },
            stats: {}
        };
        this.model.projection = this.schemaToProjection(this.model.schema);
        this.model.defaultData = this.schemaToDefault(this.model.schema);
        this.model.defaultData.information = {};
        this.model.listProjection = {
            status: 1,
            name: 1,
            couplingType: 1,
            executeDate: 1,
            executing: 1,
            stats: 1
        };
        this.model.sort = {'name': 1};
        this.model.search = 'name';
        this.model.version = 'COUPLING1';
        this.loadMeta();
    }

    public loadMeta(args?: any): void {
        console.log('LOAD META')
        this._http?.get<any>('/api/couplings/meta')
            .subscribe(
                (response) => {
                    console.log(response)
                    this.meta = response.data || [];
                    args && args.next && args.next();
                    this.notify({metaLoaded: true});
                    if (response.error)
                        this._setError(response.message, response.errorCode);
                },
                this.errResponse.bind(this))
    }

    public testConnection(args?: any): void {
        if (this.isTesting) return;
        this.document.isSaving = this.isTesting = true;
        this._http?.post<any>(`/api/couplings/test`, this.document.data)
            .subscribe(
                (response) => {
                    this.document.isSaving = this.isTesting = false;
                    console.log(response)
                    if (response.data) {
                        if (response.data === 'Company not found') {
                            this._setError(response.data)
                        } else {
                            this.document.data = response.data;
                            args && args.next && args.next();
                        }
                    }
                    if (response.error)
                        this._setError(response.message, response.errorCode);
                },
                this.errResponse.bind(this))
    }

    public stats(args?: any): void {
        if (this.document.isSaving) return;
        this.document.isSaving = true;
        this._http?.post<any>(`/api/couplings/stats`, this.document.data)
            .subscribe(
                (response) => {
                    this.document.isSaving = false;
                    console.log(response)
                    if (response.data) {
                        this.document.data = response.data;
                        args && args.next && args.next();
                    }
                    if (response.error)
                        this._setError(response.message, response.errorCode);
                },
                this.errResponse.bind(this))
    }

    public execute(args?: any): void {
        if (this.document.isSaving) return;
        this.document.isSaving = true;
        this._http?.post<any>(`/api/couplings/execute`, this.document.data)
            .subscribe(
                (response) => {
                    this.document.isSaving = false;
                    console.log(response)
                    if (response.data) {
                        this.document.setDocument(response.data);
                        args && args.next && args.next();
                    }
                    if (response.error)
                        this._setError(response.message, response.errorCode);
                },
                this.errResponse.bind(this))
    }

    public stop(args?: any): void {
        if (this.document.isSaving) return;
        this.document.isSaving = true;
        this._http?.post<any>(`/api/couplings/stop`, this.document.data)
            .subscribe(
                (response) => {
                    this.document.isSaving = false;
                    console.log(response)
                    if (response.data) {
                        this.document.setDocument(response.data);
                        args && args.next && args.next();
                    }
                    if (response.error)
                        this._setError(response.message, response.errorCode);
                },
                this.errResponse.bind(this))
    }

    public reset(args?: any): void {
        if (this.document.isSaving) return;
        this.document.isSaving = true;
        this._http?.post<any>(`/api/couplings/reset`, this.document.data)
            .subscribe(
                (response) => {
                    this.document.isSaving = false;
                    console.log(response)
                    if (response.data) {
                        this.document.setDocument(response.data);
                        args && args.next && args.next();
                    }
                    if (response.error)
                        this._setError(response.message, response.errorCode);
                },
                this.errResponse.bind(this))
    }


}
