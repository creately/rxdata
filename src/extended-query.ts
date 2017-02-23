import { Observable } from 'rxjs';
import { IQuery } from './index';

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
            .map( sets => this._mergeDocumentArrays( ...sets ));
    }

    /**
     * _mergeDocumentArrays
     * ...
     */
    protected _mergeDocumentArrays( ...sets: any[][]): any[] {
        const groups = {};
        sets.forEach( set => {
            set.forEach( doc => {
                groups[ doc.id ] = ( groups[ doc.id ] || []).concat( doc );
            });
        });
        return Object.keys( groups )
            .filter( id => groups[id].length === sets.length )
            .map( id => this._mergeDocuments( ...groups[id]));
    }

    /**
     * _mergeDocuments
     * ...
     */
    protected _mergeDocuments( ...docs: any[]): any {
        return Object.assign({}, ...docs );
    }
}
