import {Optional, Pipe, PipeTransform, Provider} from "@angular/core";
import {ControlContainer, NgForm, NgModelGroup} from "@angular/forms";

@Pipe({
    name: 'keys'
})
export class KeysPipe implements PipeTransform {
    constructor() {
    }

    transform(value: any = {}) {
        const result: { key: string, value: any }[] = [];

        for (let item in value) {
            result.push({key: item, value: value[item]})
        }
        return result;
    }
}

export const formViewProvider: Provider = {
    provide: ControlContainer,
    useFactory: _formViewProviderFactory,
    deps: [
        [new Optional(), NgForm],
        [new Optional(), NgModelGroup]
    ]
};

export function _formViewProviderFactory(
    ngForm: NgForm, ngModelGroup: NgModelGroup
) {
    return ngModelGroup || ngForm || null;
}