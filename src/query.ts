import * as Mingo from 'mingo';
import { Observable } from 'rxjs';
import { ChangeEvent } from './index';

/**
 * QueryOptions
 * ...
 */
export type QueryOptions = {
    filter: any,
    options: FilterOptions,
    documents: any[],
    changes: Observable<ChangeEvent>,
};

/**
 * FilterOptions
 * ...
 */
export type FilterOptions = {
    sort?: any,
    limit?: number,
    skip?: number,
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
            .map( docs => this._filterDocuments( docs, this._options.options ));
    }

    /**
     * _createUpdatedValueObservable
     * ...
     */
    protected _createUpdatedValueObservable(): Observable<any[]> {
        return this._options.changes
            .filter( e => e.type === 'value' )
            .map( e => this._filterDocuments( e.data, this._options.options ));
    }

    /**
     * _filterDocuments
     * ...
     *
     * @todo store and reuse the Mingo query if it's faster.
     */
    protected _filterDocuments( documents: any[], options: FilterOptions ): any[] {
        const query = new Mingo.Query( this._options.filter );
        let cursor = query.find( documents );
        if ( options.sort ) {
            cursor = cursor.sort( options.sort );
        }
        if ( options.skip ) {
            cursor = cursor.skip( options.skip );
        }
        if ( options.limit ) {
            cursor = cursor.limit( options.limit );
        }
        return cursor.all();
    }
}
