import * as Mingo from 'mingo';
import { Observable } from 'rxjs';
import { IQuery } from './';
import { ChangeEvent } from './collection';

/**
 * QueryOptions
 * ...
 */
export type QueryOptions = {
    filter: any,
    sort?: any,
    limit?: number,
    skip?: number,
    documents: any[],
    changes: Observable<ChangeEvent>,
};

/**
 * Query
 * ...
 */
export class Query implements IQuery {
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
     public value(): Observable<any> {
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
        if ( !this._options.documents ) {
            return Observable.of();
        }
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
        let cursor = query.find( documents );
        if ( this._options.sort ) {
            cursor = cursor.sort( this._options.sort );
        }
        if ( this._options.skip ) {
            cursor = cursor.skip( this._options.skip );
        }
        if ( this._options.limit ) {
            cursor = cursor.limit( this._options.limit );
        }
        return cursor.all();
    }
}
