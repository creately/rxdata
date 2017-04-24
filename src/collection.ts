import { Observable, BehaviorSubject } from 'rxjs';
import { IQuery, ICollection, ICollectionPersistor } from './';
import { Query, SingleDocQuery } from './query';
import { FilterOptions, createFilterFunction } from './doc-utilities/filter-documents';
import { updateDocument } from './doc-utilities/update-documents';

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
     * _values
     * _values is an observable which emits all documents in the
     * collection when any of them change. This is a BehaviorSubject
     * therefore it'll always emit the latest value when subscribed.
     */
    protected _values: BehaviorSubject<any[]>;

    /**
     * _initp
     * _initp promise resolves when the collection has completed loading
     * data from the persistor. All change operations should wait until
     * the collection has completed initialization.
     */
    protected _initp: Promise<any>;

    /**
     * constructor
     * constructor creates a new Collection instance and initializes it.
     *
     * @param _persistor: A ICollectionPersistor instance to store and load data.
     */
    constructor( protected _persistor: ICollectionPersistor ) {
        this._documents = [];
        this._resetValuesSubject();
        this._initp = this._init();
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
            values: this._values,
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
    public findOne( filter: any, filterOptions: FilterOptions = {}): IQuery {
        const findOneOptions = Object.assign( filterOptions, { limit: 1 });
        const query = this.find( filter, findOneOptions );
        return new SingleDocQuery( query );
    }

    /**
     * insert
     * insert adds a new document to the collection. If a document already
     * exists in the collection with the same 'id', it'll be replaced.
     *
     * @param rawDocOrDocs: The document object. The only requirement is that
     *  it should have an 'id' field to uniquely identify the document.
     */
    public insert( rawDocOrDocs: any ): Observable<any[]> {
        const promise = this._initp.then(() => {
            const rawDocs = [].concat( rawDocOrDocs );
            const docs = rawDocs.map( rawDoc => this._copyObject( rawDoc ));
            this._insertDocuments( docs );
            this._sendValueEvent();
            return this._persistor
                .store( docs )
                .then(() => docs );
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
        const promise = this._initp.then(() => {
            const filterFunction = createFilterFunction( filter );
            const updatedDocuments = this._updateDocuments( filterFunction, changes );
            this._sendValueEvent();
            return this._persistor
                .store( updatedDocuments )
                .then(() => updatedDocuments );
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
        const promise = this._initp.then(() => {
            const filterFunction = createFilterFunction( filter );
            const removedDocuments = this._removeDocuments( filterFunction );
            this._sendValueEvent();
            return this._persistor
                .remove( removedDocuments )
                .then(() => removedDocuments );
        });
        return Observable.fromPromise( promise );
    }

    /**
     * unsub
     * unsub closes all query subscriptions with a complete.
     */
    public unsub(): Observable<any> {
        this._resetValuesSubject();
        return Observable.of();
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
     * _resetValuesSubject
     * _resetValuesSubject closes all subscriptions and resets values subject.
     */
    protected _resetValuesSubject() {
        if ( this._values ) {
            this._values.complete();
        }
        this._values = new BehaviorSubject( this._documents );
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
     * _insertDocument
     * _insertDocument inserts a new document to the collection.
     *
     * @param doc: A document object to insert.
     */
    protected _insertDocuments( docs: any[]): void {
        const docIds = docs.map( doc => doc.id );
        this._removeDocuments( doc => docIds.indexOf( doc.id ) >= 0 );
        this._documents.push( ...docs );
    }

    /**
     * _updateDocuments
     * _updateDocuments updates matching documents in the collection.
     *
     * @param: filterFunction: Afunction to filter documents
     * @param: changes: A mongodb like changes object.
     */
    protected _updateDocuments( filterFunction: Function, changes: any ): any[] {
        const updatedDocuments = [];
        this._documents = this._documents.map( doc => {
            if ( !filterFunction( doc )) {
                return doc;
            }
            const updated = updateDocument( doc, changes );
            updatedDocuments.push( updated );
            return updated;
        });
        return updatedDocuments;
    }

    /**
     * _removeDocuments
     * _removeDocuments removes matching documents from the collection.
     *
     * @param: filterFunction: Afunction to filter documents
     */
    protected _removeDocuments( filterFunction: Function ): any[] {
        const removedDocuments = [];
        this._documents = this._documents.filter( doc => {
            if ( filterFunction( doc )) {
                removedDocuments.push( doc );
                return false;
            }
            return true;
        });
        return removedDocuments;
    }

    /**
     * _sendValueEvent
     * _sendValueEvent sends a 'value' event to all active queries.
     */
    protected _sendValueEvent( ): void {
        this._values.next( this._documents.slice());
    }
}
