import { Observable } from 'rxjs';
import { IQuery } from './';
import { FilterOptions, filterDocuments } from './doc-utilities/filter-documents';
import { createCompareFn } from './doc-utilities/compare-documents';

/**
 * QueryOptions
 * QueryOptions is used to create a new Query instance.
 */
export type QueryOptions = {
    filter?: any,
    filterOptions?: FilterOptions,
    values?: Observable<any[]>,
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
        return this._options.values
            .map( docs => this._filterDocuments( docs ))
            .distinctUntilChanged( createCompareFn());
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
            .map( docs => docs[0])
            .distinctUntilChanged( createCompareFn());
    }
}
