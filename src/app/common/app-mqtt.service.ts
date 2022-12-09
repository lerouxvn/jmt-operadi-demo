/**
 * creator leroux
 * date 2022/07/31
 */

import {Injectable} from "@angular/core";
import {IJMTMqtt, IJMTMqttMessage} from "@jmtgit/angular";
import {IMqttMessage, IMqttServiceOptions, IOnConnectEvent, MqttService} from "ngx-mqtt";
import {Observable, Subject, Subscription} from "rxjs";
import {UserBlueprintService} from "../auth/services/user.blueprint.service";

@Injectable({providedIn: 'root'})
export class AppMqttService implements IJMTMqtt {
    private subscription: Subscription | undefined;
    private readonly _subject: Subject<IJMTMqttMessage>;

    public observable: Observable<IJMTMqttMessage> | undefined;


    constructor(private _mqttService: MqttService, private _userBlueprintService: UserBlueprintService) {
        this._subject = new Subject<IJMTMqttMessage>();
        this.observable = this._subject.asObservable();

        this._mqttService.onConnect.subscribe((value: IOnConnectEvent) => {
            console.log(value)
            this.subscription = this._mqttService.observe(this._userBlueprintService.document.data.rabbit.topic).subscribe((message: IMqttMessage) => {
                console.log(message.payload.toString());
                const m = message.payload.toString().split('|')
                this._subject.next({
                    status: m[0], collection: m[1], id: m[2], hash: m[3], data: JSON.parse(m[4] || '{}')
                })
            });
        })
        this._mqttService.onOffline.subscribe(() => {
            console.log('OFF LINE')
        })
        this._mqttService.onClose.subscribe(() => {
            console.log('CLOSE')
            this.subscription?.unsubscribe();
        })

        this._connect();
    }

    private _connect(): void {
        console.log('CONNECT TO RABBIT')
        if (this._userBlueprintService.document.data?.rabbit) {

            const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
                hostname: this._userBlueprintService.document.data.rabbit.host,
                // port: 5672,
                // port: 9001,
                // port: 15675,
                port: 443,
                path: '/ws',
                protocol: 'wss',
                url: `mqtt://${this._userBlueprintService.document.data.rabbit.user}:${this._userBlueprintService.document.data.rabbit.password}@${this._userBlueprintService.document.data.rabbit.host}:15675`
            };

            this._mqttService.connect(MQTT_SERVICE_OPTIONS);
        } else {
            console.log('_userBlueprintService subscription')
            const sub = this._userBlueprintService.observable.subscribe((val: any) => {
                if (val.document?.loaded) {
                    sub.unsubscribe();
                    this._connect();
                }
            })
        }
    }

}
