import { Observable } from 'rxjs';
import * as isEqual from 'lodash.isequal';
import { IQuery } from './';
import { ChangeEvent } from './collection';
import { FilterOptions, filterDocuments } from './doc-utilities/filter-documents';

/**
 * QueryOptions
 * QueryOptions is used to create a new Query instance.
 */
export type QueryOptions = {
    filter?: any,
    filterOptions?: FilterOptions,
    initialDocuments?: any[],
    changes?: Observable<ChangeEvent>,
};

/**
 * Query
 * Query is a reactive getter for a subset of the database.
 */
export class Query implements IQuery {
    /**
     * constructor
     * constructor creates a new Query instance
     *
     * @param _options: An options object to customize the query.
     */
    constructor( protected _options: QueryOptions = {}) {
        // ...
    }

    /**
     * value
     * value creates an observable which returns the query result
     * once initially and also whenever it changes.
     */
     public value(): Observable<any> {
        return Observable
            .merge(
                this._createInitialValueObservable(),
                this._createUpdatedValueObservable(),
            )
            .distinctUntilChanged( isEqual );
     }

    /**
     * _createInitialValueObservable
     * _createInitialValueObservable creates an observable with initially
     * available set of documents. This is done so that users will receive
     * data as soon as they subscribe.
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
     * _createUpdatedValueObservable creates an observable which will return
     * updated results to the user when it changes.
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
     * _filterDocuments returns matching documents from an array of documents.
     *
     * @param docs: The array of documents to pick matching documents from.
     */
    protected _filterDocuments( docs: any[]): any[] {
        const filter = this._options.filter || {};
        return filterDocuments( filter, docs, this._options.filterOptions );
    }
}

/**
 * SingleDocQuery
 * SingleDocQuery wraps query and returns only the first matching document.
 */
export class SingleDocQuery implements IQuery {
    /**
     * constructor
     * constructor creates a new SingleDocQuery instance
     *
     * @param _base: The base query to get the document from.
     */
    constructor( protected _base: IQuery ) {
        // ...
    }

    /**
     * value
     * value creates an observable which returns the query result
     * once initially and also whenever it changes. Unlike Query.value
     * this will only return the first matching document.
     */
    public value(): Observable<any> {
        return this._base.value()
            .map( docs => docs[0]);
    }
}
