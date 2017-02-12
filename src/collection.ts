import Mingo from 'mingo';
import { Observable, Subject } from 'rxjs';
import { IPersistor, ChangeEvent } from './';
import { Query } from './query';

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
    public find( filter: any ): Query {
        return new Query({
            filter: filter,
            documents: this._documents,
            changes: this._changes,
        });
    }

    /**
     * insert
     * ...
     */
    public insert( doc: any ): Observable<any> {
        const promise = this._init()
            .then(() => {
                this._removeDocument( doc );
                this._insertDocument( doc );
                this._updateQueries();
                return this.persistor.store([ doc ])
                    .then(() => doc );
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
        return this.persistor.load()
            .then( docs => this._documents = docs );
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
        Object.assign( doc, changes );
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
