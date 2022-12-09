/**
 * creator leroux
 * date 2022/09/07
 */

import {Injectable} from "@angular/core";
import {Documents, IJMTMqttMessage} from "@jmtgit/angular";

@Injectable({providedIn: 'root'})
export class EntanglementEntitiesDocuments extends Documents {

    public mqttUpdate(message: IJMTMqttMessage): void {
        console.log('EntanglementEntitiesDocuments', message)
        super.mqttUpdate(message);
        if (message.status === '99')
            this.refresh();
    }

}
