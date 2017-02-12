import * as Mingo from 'mingo';
import { Observable } from 'rxjs';
import { ChangeEvent } from './index';

/**
 * QueryOptions
 * ...
 */
export type QueryOptions = {
    filter: any,
    documents: any[],
    changes: Observable<ChangeEvent>,
};

/**
 * Query
 * ...
 */
export class Query {
    /**
     * constructor
     * ...
     */
    constructor( protected _options: QueryOptions ) {
        // ...
    }

    /**
     * value
     * ...
     */
     public value(): Observable<any[]> {
        return Observable.merge(
            this._createInitialValueObservable(),
            this._createUpdatedValueObservable(),
        );
     }

    /**
     * _createInitialValueObservable
     * ...
     */
    protected _createInitialValueObservable(): Observable<any[]> {
        return Observable.of( this._options.documents )
            .map( docs => this._filterDocuments( docs ));
    }

    /**
     * _createUpdatedValueObservable
     * ...
     */
    protected _createUpdatedValueObservable(): Observable<any[]> {
        return this._options.changes
            .filter( e => e.type === 'value' )
            .map( e => this._filterDocuments( e.data ));
    }

    /**
     * _filterDocuments
     * ...
     *
     * @todo store and reuse the Mingo query if it's faster.
     */
    protected _filterDocuments( documents: any[]): any[] {
        const query = new Mingo.Query( this._options.filter );
        return query.find( documents ).all();
    }
}
