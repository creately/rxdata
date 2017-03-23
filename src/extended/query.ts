import { Observable } from 'rxjs';
import * as isEqual from 'lodash.isequal';
import { IQuery } from '../';
import { mergeDocumentArrays } from '../doc-utilities/merge-documents';

/**
 * ExtendedQuery
 * ...
 */
export class ExtendedQuery implements IQuery {
    /**
     * constructor
     * ...
     */
    constructor( protected parent: IQuery, protected child: IQuery, protected fields: String[]) {
        // ...
    }

    /**
     * value
     * ...
     */
    public value(): Observable<any[]> {
        return Observable
            .combineLatest(
                this.parent.value(),
                this.child.value(),
            )
            .map( sets => this._mergeDocumentArrays( ...sets ))
            .distinctUntilChanged( isEqual );
    }

    /**
     * _mergeDocumentArrays
     * ...
     */
    protected _mergeDocumentArrays( ...sets: any[][]): any[] {
        return mergeDocumentArrays( ...sets );
    }
}
