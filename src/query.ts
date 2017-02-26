import { Observable } from 'rxjs';
import { IQuery } from './';
import { ChangeEvent } from './collection';
import { FilterOptions, filterDocuments } from './doc-utilities/filter-documents';

/**
 * QueryOptions
 * ...
 */
export type QueryOptions = {
    filter?: any,
    filterOptions?: FilterOptions,
    initialDocuments?: any[],
    changes?: Observable<ChangeEvent>,
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
    constructor( protected _options: QueryOptions = {}) {
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
        if ( !this._options.initialDocuments ) {
            return Observable.of();
        }
        return Observable.of( this._options.initialDocuments )
            .map( docs => this._filterDocuments( docs ));
    }

    /**
     * _createUpdatedValueObservable
     * ...
     */
    protected _createUpdatedValueObservable(): Observable<any[]> {
        if ( !this._options.changes ) {
            return Observable.of();
        }
        return this._options.changes
            .filter( e => e.type === 'value' )
            .map( e => this._filterDocuments( e.data ));
    }

    /**
     * _filterDocuments
     * ...
     */
    protected _filterDocuments( docs: any[]): any[] {
        const filter = this._options.filter || {};
        return filterDocuments( filter, docs, this._options.filterOptions );
    }
}

/**
 * SingleDocQuery
 * ...
 */
export class SingleDocQuery implements IQuery {
    /**
     * constructor
     * ...
     */
    constructor( protected _base: IQuery ) {
        // ...
    }

    /**
     * value
     * ...
     */
    public value(): Observable<any> {
        return this._base.value()
            .map( docs => docs[0]);
    }
}
