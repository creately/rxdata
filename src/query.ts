import Mingo from 'mingo';
import { Observable } from 'rxjs';

export class Query {
    /**
     * _resultObservers
     * ...
     */
    private _resultObservers: Set<any>;

    /**
     * _resultObservable
     * ...
     */
    private _resultObservable: Observable<any>;

    /**
     * _filterMingoQuery
     * ...
     */
    private _filterMingoQuery: Mingo.Query;

    /**
     * constructor
     * ...
     */
    constructor( public filter: any, private expire: Function ) {
        this._resultObservers = new Set<any>();
        this._resultObservable = this._createObservableWithSet( this._resultObservers );
        this._filterMingoQuery = new Mingo.Query( this.filter );
    }

    /**
     * get id
     * ...
     */
    public get id(): string {
        return '';
    }

    /**
     * get value
     * ...
     */
    public get value(): Observable<any> {
        return this._resultObservable;
    }

    /**
     * update
     * ...
     */
    public update( documents: any[]) {
        const result = this._filterMingoQuery.find( documents ).all();
        this._updateResultObservers( result );
    }

    /**
     * _getTotalObservers
     * ...
     */
    private _getTotalObservers(): number {
        return this._resultObservers.size;
    }

    /**
     * _updateResultObservers
     * ...
     */
    protected _updateResultObservers( result: any[]) {
        this._resultObservers.forEach( observer => observer.next( result ));
    }

    /**
     * _createObservableWithSet
     * ...
     */
    protected _createObservableWithSet( observers: Set<any> ) {
        return Observable.create( observer => {
            observers.add( observer );
            return this._createObserverUnsubFn( observers, observer );
        });
    }

    /**
     * _createObserverUnsubFn
     * ...
     */
    protected _createObserverUnsubFn( observers: Set<any>, observer: any ): Function {
        return () => {
            observers.delete( observer );
            if ( !this._getTotalObservers()) {
                this.expire();
            }
        };
    }
}
