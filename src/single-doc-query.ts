import { Observable } from 'rxjs';
import { IQuery } from './';

export class SingleDocQuery implements IQuery {
    constructor( protected _base: IQuery ) {
        // ...
    }

    public value(): Observable<any> {
        return this._base.value()
            .map( docs => docs[0]);
    }
}
