import { Observable, Subject } from 'rxjs';
import { IQuery, ICollection, IPersistor } from './';
import { Query, SingleDocQuery } from './query';
import { FilterOptions, filterDocuments } from './doc-utilities/filter-documents';
import { updateDocuments } from './doc-utilities/update-documents';

/**
 * ChangeEvent
 * ChangeEvent describes a change in the collection. Collections
 * will emit these events to notify active queries to update their
 * results accordingly. Valid ChangeEvent types are:
 *  - value: documents in the collection has changed
 *  - inserted: documents are inserted into the collection
 *  - modified: documents are modified in the collection
 *  - removed: documents are removed from the collection
 */
export type ChangeEvent = {
    type: String,
    data: any,
};

/**
 * Collection
 * Collection is a collection of documents.
 */
export class Collection implements ICollection {
    /**
     * _documents
     * _documents is a cached array of documents kept in memory.
     * This field can have one of 2 states:
     *  - null:  the collection has not completed initializing
     *  - array: the collection is ready to perform operations
     */
    protected _documents: any[];

    /**
     * _changes
     * _changes is a subject which emits ChangeEvents. Queries
     * subscribe to this subject and emit new results if changed.
     */
    protected _changes: Subject<ChangeEvent>;

    /**
     * _initPromise
     * _initPromise resolves when the collection has completed loading
     * data from the persistor. All change operations should wait until
     * the collection has completed initialization.
     */
    protected _initPromise: Promise<any>;

    /**
     * constructor
     * constructor creates a new Collection instance and prepares it.
     *
     * @param _persistor: A IPersistor instance to store and load data.
     */
    constructor( protected _persistor: IPersistor ) {
        this._changes = new Subject();
        this._initPromise = this._init();
    }

    /**
     * find
     * find creates a query which will emit all matching documents.
     *
     * @param filter: A mongodb like filter object.
     * @param filterOptions: An optional object to customize the filter.
     */
    public find( filter: any, filterOptions: FilterOptions = {}): IQuery {
        const queryOptions = {
            filter: filter,
            filterOptions: filterOptions,
            initialDocuments: this._documents,
            changes: this._changes,
        };
        return new Query( queryOptions );
    }

    /**
     * findOne
     * findOne creates a query which will emit the first matching document.
     *
     * @param filter: A mongodb like filter object.
     * @param filterOptions: An optional object to customize the filter.
     *  Note that the limit field will be set to 1 before it's used.
     */
    public findOne( filter: any, options: FilterOptions = {}): IQuery {
        const findOneOptions = Object.assign( options, { limit: 1 });
        const query = this.find( filter, findOneOptions );
        return new SingleDocQuery( query );
    }

    /**
     * insert
     * insert adds a new document to the collection. If a document already
     * exists in the collection with the same 'id', it'll be replaced.
     *
     * @param rawDoc: The document object. The only requirement is that it
     *  should have an 'id' field to uniquely identify the document.
     */
    public insert( rawDoc: any ): Observable<any> {
        const promise = this._initPromise.then(() => {
            const doc = this._copyObject( rawDoc );
            this._removeDocument( doc );
            this._insertDocument( doc );
            return this._persistor
                .store([ doc ])
                .then(() => doc );
        });
        return Observable.fromPromise( promise );
    }

    /**
     * update
     * update updates all matching documents in the collection.
     *
     * @param filter: A mongodb like filter object.
     * @param changes: A mongodb like changes object.
     */
    public update( filter: any, changes: any ): Observable<any[]> {
        const promise = this._initPromise.then(() => {
            const matches = this._filterDocuments( filter );
            this._updateDocuments( matches, changes );
            return this._persistor
                .store( matches )
                .then(() => matches );
        });
        return Observable.fromPromise( promise );
    }

    /**
     * remove
     * remove removes all matching documents from the collection.
     *
     * @param filter: A mongodb like filter object.
     */
    public remove( filter: any ): Observable<any[]> {
        const promise = this._initPromise.then(() => {
            const matches = this._filterDocuments( filter );
            this._removeDocuments( matches );
            return this._persistor
                .remove( matches )
                .then(() => matches );
        });
        return Observable.fromPromise( promise );
    }

    /**
     * _init
     * _init initializes the collection by loading available documents
     * from the persistor. This function needs to run once before use.
     */
    protected _init(): Promise<any> {
        return this._persistor
            .load()
            .then( docs => {
                this._documents = docs;
                this._sendValueEvent();
            });
    }

    /**
     * _copyObject
     * _copyObject creates a deep copy of the object.
     *
     * @param doc: A document object to copy.
     */
    protected _copyObject( doc: any ): any {
        const str = JSON.stringify( doc );
        return JSON.parse( str );
    }

    /**
     * _filterDocuments
     * _filterDocuments returns matching documents from the collection.
     *
     * @param filter: A mongodb like filter object.
     */
    protected _filterDocuments( filter: any ): any[] {
        return filterDocuments( filter, this._documents );
    }

    /**
     * _insertDocument
     * _insertDocument inserts a new document to the collection.
     *
     * @param doc: A document object to insert.
     */
    protected _insertDocument( doc: any ): void {
        this._documents.push( doc );
        this._sendValueEvent();
    }

    /**
     * _updateDocuments
     * _updateDocuments updates matching documents to the collection.
     *
     * @param: docs: An array of documents to update.
     * @param changes: A mongodb like changes object.
     */
    protected _updateDocuments( docs: any[], changes: any ): void {
        updateDocuments( docs, changes );
        this._sendValueEvent();
    }

    /**
     * _removeDocuments
     * _removeDocuments removes matching documents from the collection.
     *
     * @param: docs: An array of documents to remove.
     */
    protected _removeDocuments( docs: any[]): void {
        docs.forEach( doc => this._removeDocument( doc ));
        this._sendValueEvent();
    }

    /**
     * _removeDocument
     * _removeDocument removes a document from the collection.
     *
     * @param doc: A document object to remove.
     */
    protected _removeDocument( doc: any ): void {
        const index = this._documents.findIndex( _doc => _doc.id === doc.id );
        if ( index !== -1 ) {
            this._documents.splice( index, 1 );
        }
    }

    /**
     * _sendValueEvent
     * _sendValueEvent sends a 'value' event to all active queries.
     */
    protected _sendValueEvent( ): void {
        const event: ChangeEvent = { type: 'value', data: this._documents };
        this._changes.next( event );
    }
}
