import * as Mingo from 'mingo';
import { Observable, Subject } from 'rxjs';
import { IPersistor, ChangeEvent } from './';
import { Query } from './query';

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
 * Collection
 * ...
 */
export class Collection {
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
    constructor( protected persistor: IPersistor ) {
        this._documents = [];
        this._changes = new Subject();
    }

    /**
     * find
     * ...
     */
    public find( filter: any, options: FilterOptions = {}): Query {
        this._init();
        return new Query(
            {
                filter: filter,
                sort: options.sort,
                limit: options.limit,
                skip: options.skip,
                documents: this._documents,
                changes: this._changes,
            },
        );
    }

    /**
     * insert
     * ...
     */
    public insert( doc: any ): Observable<any> {
        const cleanDoc = this._cleanObject( doc );
        const promise = this._init()
            .then(() => {
                this._removeDocument( cleanDoc );
                this._insertDocument( cleanDoc );
                this._updateQueries();
                return this.persistor.store([ cleanDoc ])
                    .then(() => cleanDoc );
            });
        return Observable.fromPromise( promise );
    }

    /**
     * update
     * ...
     */
    public update( filter: any, changes: any ): Observable<any[]> {
        const promise = this._init()
            .then(() => {
                const matches = this._filterDocuments( filter );
                this._updateDocuments( matches, changes );
                this._updateQueries();
                return this.persistor.store( matches )
                    .then(() => matches );
            });
        return Observable.fromPromise( promise );
    }

    /**
     * remove
     * ...
     */
    public remove( filter: any ): Observable<any[]> {
        const promise = this._init()
            .then(() => {
                const matches = this._filterDocuments( filter );
                this._removeDocuments( matches );
                this._updateQueries();
                return this.persistor.remove( matches )
                    .then(() => matches );
            });
        return Observable.fromPromise( promise );
    }

    /**
     * _init
     * ...
     */
    protected _init(): Promise<any> {
        if ( !this._initPromise ) {
            this._initPromise = this.persistor.load()
                .then( docs => {
                    this._documents = docs;
                    this._updateQueries();
                });
        }
        return this._initPromise;
    }

    /**
     * _cleanObject
     * ...
     */
    protected _cleanObject( doc: any ): any {
        const str = JSON.stringify( doc );
        return JSON.parse( str );
    }

    /**
     * _filterDocuments
     * ...
     */
    protected _filterDocuments( filter: any ): any[] {
        const query = new Mingo.Query( filter );
        return query.find( this._documents ).all();
    }

    /**
     * _insertDocument
     * ...
     */
    protected _insertDocument( doc: any ) {
        this._documents.push( doc );
    }

    /**
     * _removeDocuments
     * ...
     */
    protected _removeDocuments( docs: any[]) {
        docs.forEach( doc => this._removeDocument( doc ));
    }

    /**
     * _removeDocument
     * ...
     */
    protected _removeDocument( doc: any ) {
        const index = this._documents.findIndex( _doc => _doc.id === doc.id );
        if ( index !== -1 ) {
            this._documents.splice( index, 1 );
        }
    }

    /**
     * _updateDocuments
     * ...
     */
    protected _updateDocuments( docs: any[], changes: any ) {
        docs.forEach( doc => this._updateDocument( doc, changes ));
    }

    /**
     * _updateDocument
     * ...
     *
     * @todo also apply changes in nested fields
     */
    protected _updateDocument( doc: any, changes: any ) {
        if ( changes.$set ) {
            const clean$Set = this._cleanObject( changes.$set );
            Object.assign( doc, clean$Set );
        }
    }

    /**
     * _updateQueries
     * ...
     */
    protected _updateQueries( ) {
        const change: ChangeEvent = { type: 'value', data: this._documents };
        this._changes.next( change );
    }
}
