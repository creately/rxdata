import Mingo from 'mingo';
import { Observable } from 'rxjs';
import { IPersistor } from './';
import { Query } from './query';

/**
 * Collection
 * ...
 */
export class Collection {
    /**
     * _queries
     * ...
     */
    protected _queries: Set<Query>;

    /**
     * _documents
     * ...
     */
    protected _documents: any[];

    /**
     * constructor
     * ...
     */
    constructor( protected persistor: IPersistor ) {
        this._queries = new Set<Query>();
        this._documents = [];
    }

    /**
     * find
     * ...
     */
    public find( filter: any ): Observable<any[]> {
        const query = new Query( filter, () => this._removeQuery( query ));
        this._insertQuery( query );
        this._updateQuery( query );
        return query.value();
    }

    /**
     * insert
     * ...
     */
    public insert( doc: any ): Observable<any> {
        const promise = this._initCollection()
            .then(() => {
                this._removeDocument( doc );
                this._documents.push( doc );
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
        const promise = this._initCollection()
            .then(() => {
                const matches = this._filterDocuments( filter );
                matches.forEach( doc => this._updateDocument( doc, changes ));
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
        const promise = this._initCollection()
            .then(() => {
                const matches = this._filterDocuments( filter );
                matches.forEach( doc => this._removeDocument( doc ));
                return this.persistor.remove( matches )
                    .then(() => matches );
            });
        return Observable.fromPromise( promise );
    }

    /**
     * _filterDocuments
     * ...
     */
    protected _filterDocuments( filter: any ): any[] {
        const query = this._createMingoQuery( filter );
        return query.find( this._documents ).all();
    }

    /**
     * _createMingoQuery
     * ...
     */
    protected _createMingoQuery( filter: any ): any {
        return new Mingo.Query( filter );
    }

    /**
     * _initCollection
     * ...
     */
    protected _initCollection(): Promise<any> {
        return this.persistor.load()
            .then( docs => this._documents = docs );
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
     * _updateDocument
     * ...
     */
    protected _updateDocument( doc: any, changes: any ) {
        // TODO also apply changes in nested fields
        Object.assign( doc, changes );
    }

    /**
     * _insertQuery
     * ...
     */
    protected _insertQuery( query: Query ) {
        this._queries.add( query );
    }

    /**
     * _removeQuery
     * ...
     */
    protected _removeQuery( query: Query ) {
        this._queries.delete( query );
    }

    /**
     * _updateQuery
     * ...
     */
    protected _updateQuery( query: Query ) {
        query.update( this._documents );
    }
}
