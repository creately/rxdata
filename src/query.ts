import Mingo from 'mingo';
import { Observable } from 'rxjs';

export class Query {
    /**
     * _resultObservers
     * ...
     */
    protected _valueObservers: Set<any>;

    /**
     * _resultObservable
     * ...
     */
    protected _valueObservable: Observable<any>;

    /**
     * constructor
     * ...
     */
    constructor( public filter: any, protected expire: Function ) {
        this._valueObservers = new Set<any>();
        this._valueObservable = this._createObservableWithSet( this._valueObservers );
    }

    /**
     * get value
     * ...
     */
    public get value(): Observable<any> {
        return this._valueObservable;
    }

    /**
     * update
     * ...
     */
    public update( documents: any[]) {
        const result = this._filterDocuments( this.filter, documents );
        this._updateValueObservers( result );
    }

    /**
     * _filterDocuments
     */
    protected _filterDocuments( filter: any, documents: any[]): any[] {
        const query = this._createMingoQuery( filter );
        return query.find( documents ).all();
    }

    /**
     * _createMingoQuery
     * ...
     */
    protected _createMingoQuery( filter: any ): any {
        return new Mingo.Query( filter );
    }

    /**
     * _getTotalObservers
     * ...
     */
    protected _getTotalObservers(): number {
        return this._valueObservers.size;
    }

    /**
     * _updateResultObservers
     * ...
     */
    protected _updateValueObservers( result: any[]) {
        this._valueObservers.forEach( observer => observer.next( result ));
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
