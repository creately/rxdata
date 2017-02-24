import { Observable, Subject } from 'rxjs';
import { IQuery, ICollection, IPersistor } from './';
import { Query } from './query';
import { SingleDocQuery } from './single-doc-query';
import { FilterOptions, filterDocuments } from './doc-utilities/filter-documents';
import { updateDocuments } from './doc-utilities/update-documents';

/**
 * ChangeEvent
 * ...
 */
export type ChangeEvent = {
    type: String,
    data: any,
};

/**
 * Collection
 * ...
 */
export class Collection implements ICollection {
    /**
     * _documents
     * ...
     */
    protected _documents: any[];

    /**
     * _changes
     * ...
     */
    protected _changes: Subject<ChangeEvent>;

    /**
     * _initPromise
     * ...
     */
    protected _initPromise: Promise<any>;

    /**
     * constructor
     * ...
     */
    constructor( protected _persistor: IPersistor ) {
        this._changes = new Subject();
        this._initPromise = this._init();
    }

    /**
     * find
     * ...
     */
    public find( filter: any, options: FilterOptions = {}): IQuery {
        const queryOptions = {
            filter: filter,
            filterOptions: options,
            initialDocuments: this._documents,
            changes: this._changes,
        };
        return new Query( queryOptions );
    }

    /**
     * findOne
     * ...
     */
    public findOne( filter: any, options: FilterOptions = {}): IQuery {
        const findOneOptions = Object.assign( options, { limit: 1 });
        const query = this.find( filter, findOneOptions );
        return new SingleDocQuery( query );
    }

    /**
     * insert
     * ...
     */
    public insert( rawDoc: any ): Observable<any> {
        const promise = this._insertPromise( rawDoc );
        return Observable.fromPromise( promise );
    }

    /**
     * update
     * ...
     */
    public update( filter: any, changes: any ): Observable<any[]> {
        const promise = this._updatePromise( filter, changes );
        return Observable.fromPromise( promise );
    }

    /**
     * remove
     * ...
     */
    public remove( filter: any ): Observable<any[]> {
        const promise = this._removePromise( filter );
        return Observable.fromPromise( promise );
    }

    /**
     * _init
     * ...
     */
    protected _init(): Promise<any> {
        return this._persistor
            .load()
            .then( docs => {
                this._documents = docs;
                this._updateQueries();
            });
    }

    /**
     * _insertPromise
     * ...
     */
    public _insertPromise( rawDoc: any ): Promise<any> {
        return this._initPromise.then(() => {
            const doc = this._copyObject( rawDoc );
            this._removeDocument( doc );
            this._insertDocument( doc );
            this._updateQueries();
            return this._persistor
                .store([ doc ])
                .then(() => doc );
        });
    }

    /**
     * _updatePromise
     * ...
     */
    public _updatePromise( filter: any, changes: any ): Promise<any[]> {
        return this._initPromise.then(() => {
            const matches = this._filterDocuments( filter );
            this._updateDocuments( matches, changes );
            this._updateQueries();
            return this._persistor
                .store( matches )
                .then(() => matches );
        });
    }

    /**
     * _removePromise
     * ...
     */
    public _removePromise( filter: any ): Promise<any[]> {
        return this._initPromise.then(() => {
            const matches = this._filterDocuments( filter );
            this._removeDocuments( matches );
            this._updateQueries();
            return this._persistor
                .remove( matches )
                .then(() => matches );
        });
    }

    /**
     * _cleanObject
     * ...
     */
    protected _copyObject( doc: any ): any {
        const str = JSON.stringify( doc );
        return JSON.parse( str );
    }

    /**
     * _filterDocuments
     * ...
     */
    protected _filterDocuments( filter: any ): any[] {
        return filterDocuments( filter, this._documents );
    }

    /**
     * _insertDocument
     * ...
     */
    protected _insertDocument( doc: any ): void {
        this._documents.push( doc );
    }

    /**
     * _updateDocuments
     * ...
     */
    protected _updateDocuments( matches: any[], changes: any ): void {
        updateDocuments( matches, changes );
    }

    /**
     * _removeDocuments
     * ...
     */
    protected _removeDocuments( docs: any[]): void {
        docs.forEach( doc => this._removeDocument( doc ));
    }

    /**
     * _removeDocument
     * ...
     */
    protected _removeDocument( doc: any ): void {
        const index = this._documents.findIndex( _doc => _doc.id === doc.id );
        if ( index !== -1 ) {
            this._documents.splice( index, 1 );
        }
    }

    /**
     * _updateQueries
     * ...
     */
    protected _updateQueries( ): void {
        const change: ChangeEvent = { type: 'value', data: this._documents };
        this._changes.next( change );
    }
}
