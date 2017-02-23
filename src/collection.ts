import * as Mingo from 'mingo';
import { Observable, Subject } from 'rxjs';
import { IQuery, ICollection, IPersistor } from './';
import { Query, QueryOne } from './query';

/**
 * ChangeEvent
 * ...
 */
export type ChangeEvent = {
    type: String,
    data: any,
};

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
        this._documents = [];
        this._changes = new Subject();
    }

    /**
     * find
     * ...
     */
    public find( filter: any, options: FilterOptions = {}): IQuery {
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
     * findOne
     * ...
     */
    public findOne( filter: any, options: FilterOptions = {}): IQuery {
        this._init();
        return new QueryOne(
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
                return this._persistor.store([ cleanDoc ])
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
                const matches = this._filterDocuments( filter, this._documents );
                this._updateDocuments( matches, changes );
                this._updateQueries();
                return this._persistor.store( matches )
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
                const matches = this._filterDocuments( filter, this._documents );
                this._removeDocuments( matches );
                this._updateQueries();
                return this._persistor.remove( matches )
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
            this._initPromise = this._persistor.load()
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
    protected _filterDocuments( filter: any, docs: any[]): any[] {
        const query = new Mingo.Query( filter );
        return query.find( docs ).all();
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
        if ( changes.$push ) {
            const clean$Push = this._cleanObject( changes.$push );
            Object.keys( clean$Push ).forEach( key => {
                const val = clean$Push[ key ];
                if ( !doc[ key ] || !Array.isArray( doc[ key ])) {
                    doc[ key ] = [];
                }
                doc[ key ].push( val );
            });
        }
        if ( changes.$pull ) {
            const clean$Pull = this._cleanObject( changes.$pull );
            Object.keys( clean$Pull ).forEach( key => {
                const val = clean$Pull[ key ];
                const docVal = doc[ key ];
                if ( !docVal || !Array.isArray( docVal )) {
                    return;
                }
                if ( val && val.$elemMatch ) {
                    const matches = this._filterDocuments( val.$elemMatch, docVal );
                    doc[ key ] = docVal.filter( elem => matches.indexOf( elem ) === -1 );
                } else {
                    doc[ key ] = docVal.filter( elem => elem !== val );
                }
            });
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

/**
 * ExtendedCollection
 * ...
 */
export class ExtendedCollection implements ICollection {
    /**
     * _filterParent
     * ...
     */
    private _filterParent: Function;

    /**
     * _filterChild
     * ...
     */
    private _filterChild: Function;

    /**
     * constructor
     * ...
     */
    constructor( protected parent: ICollection, protected child: ICollection, protected fields: String[]) {
        this._filterParent = key => key === 'id' || this.fields.indexOf( key ) === -1;
        this._filterChild = key => key === 'id' || this.fields.indexOf( key ) !== -1;
    }

    /**
     * find
     * ...
     */
    public find( filter: any, options: FilterOptions = {}): IQuery {
        const parentQuery = this.parent.find( filter, undefined );
        const childQuery = this.child.find( filter, options );
        return new ExtendedQuery( parentQuery, childQuery, this.fields );
    }

    /**
     * insert
     * ...
     */
    public insert( doc: any ): Observable<any> {
        return Observable
            .combineLatest(
                this.parent.insert( this._pickSubDocument( this._filterParent, doc )),
                this.child.insert( this._pickSubDocument( this._filterChild, doc )),
            )
            .map( docs => this._mergeDocuments( ...docs ));
    }

    /**
     * update
     * ...
     */
    public update( filter: any, changes: any ): Observable<any[]> {
        return Observable
            .combineLatest(
                this.parent.update( filter, this._pickSubChanges( this._filterParent, changes )),
                this.child.update( filter, this._pickSubChanges( this._filterChild, changes )),
            )
            .map( sets => this._mergeDocumentArrays( ...sets ));
    }

    /**
     * remove
     * ...
     */
    public remove( filter: any ): Observable<any[]> {
        return Observable
            .combineLatest(
                this.parent.remove( filter ),
                this.child.remove( filter ),
            )
            .map( sets => this._mergeDocumentArrays( ...sets ));
    }

    /**
     * _mergeDocumentArrays
     * ...
     */
    protected _mergeDocumentArrays( ...sets: any[][]): any[] {
        const groups = {};
        sets.forEach( set => {
            set.forEach( doc => {
                groups[ doc.id ] = ( groups[ doc.id ] || []).concat( doc );
            });
        });
        return Object.keys( groups )
            .filter( id => groups[id].length === sets.length )
            .map( id => this._mergeDocuments( ...groups[id]));
    }

    /**
     * _mergeDocuments
     * ...
     */
    protected _mergeDocuments( ...docs: any[]): any {
        return Object.assign({}, ...docs );
    }

    /**
     * _pickSubDocument
     * ...
     */
    protected _pickSubDocument( filter: Function, doc: any ): any {
        return Object.keys( doc )
            .filter( key => filter( key ))
            .reduce(
                ( result, key ) => Object.assign( result, { [ key ]: doc[ key ] }),
                {},
            );
    }

    /**
     * _pickSubChanges
     * ...
     */
    protected _pickSubChanges( filter: Function, changes: any ): any {
        return Object.keys( changes )
            .reduce(
                ( result, operator ) => {
                    const opChanges = this._pickSubDocument( filter, result[ operator ]);
                    return Object.assign( result, { [ operator ]: opChanges });
                },
                {},
            );
    }
}
