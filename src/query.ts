import * as Mingo from 'mingo';
import { Observable } from 'rxjs';
import { IQuery } from './';
import { ChangeEvent } from './collection';

/**
 * QueryOptions
 * ...
 */
export type QueryOptions = {
    filter: any,
    sort?: any,
    limit?: number,
    skip?: number,
    documents: any[],
    changes: Observable<ChangeEvent>,
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
    constructor( protected _options: QueryOptions ) {
        // ...
    }

    /**
     * value
     * ...
     */
     public value(): Observable<any[]> {
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
        return Observable.of( this._options.documents )
            .map( docs => this._filterDocuments( docs ));
    }

    /**
     * _createUpdatedValueObservable
     * ...
     */
    protected _createUpdatedValueObservable(): Observable<any[]> {
        return this._options.changes
            .filter( e => e.type === 'value' )
            .map( e => this._filterDocuments( e.data ));
    }

    /**
     * _filterDocuments
     * ...
     *
     * @todo store and reuse the Mingo query if it's faster.
     */
    protected _filterDocuments( documents: any[]): any[] {
        const query = new Mingo.Query( this._options.filter );
        let cursor = query.find( documents );
        if ( this._options.sort ) {
            cursor = cursor.sort( this._options.sort );
        }
        if ( this._options.skip ) {
            cursor = cursor.skip( this._options.skip );
        }
        if ( this._options.limit ) {
            cursor = cursor.limit( this._options.limit );
        }
        return cursor.all();
    }
}

/**
 * QueryOne
 * ...
 */
export class QueryOne implements IQuery {
    private _query: Query;

    /**
     * constructor
     * ...
     */
    constructor( protected _options: QueryOptions ) {
        this._query = new Query( this._options );
    }

    /**
     * value
     * ...
     */
     public value(): Observable<any> {
        return this._query
            .value()
            .map( docs => docs[0]);
     }
}

/**
 * ExtendedQuery
 * ...
 */
export class ExtendedQuery implements IQuery {
    /**
     * constructor
     * ...
     */
    constructor( protected parent: IQuery, protected child: IQuery, protected fields: String[]) {
        // ...
    }

    /**
     * value
     * ...
     */
    public value(): Observable<any[]> {
        return Observable
            .combineLatest(
                this.parent.value(),
                this.child.value(),
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
}
