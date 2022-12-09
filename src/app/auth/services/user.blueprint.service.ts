/**
 * creator leroux
 * date 2022/03/02
 */

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BlueprintService} from "@jmtgit/angular";

@Injectable({providedIn: 'root'})
export class UserBlueprintService extends BlueprintService {

    constructor(private http: HttpClient) {
        super({_http: http});
        this.document.getUrl = `/auth/users/:id`;
        this.model.collection = 'users';
        this.model.version = 'v1';
    }

    public loadMe(): void {
        this.document.getUrl = `/auth/me`;
        this.document.load();
        this.documents.load();
    }

}
