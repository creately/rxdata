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
     * value
     * ...
     */
    public value(): Observable<any> {
        return this._valueObservable;
    }

    /**
     * update
     * ...
     */
    public update( documents: any[]) {
        const result = this._filterDocuments( documents );
        this._updateValueObservers( result );
    }

    /**
     * _filterDocuments
     * ...
     *
     * @todo Store and reuse the Mingo query if it's faster.
     */
    protected _filterDocuments( documents: any[]): any[] {
        const query = this._createMingoQuery();
        return query.find( documents ).all();
    }

    /**
     * _createMingoQuery
     * ...
     */
    protected _createMingoQuery(): any {
        return new Mingo.Query( this.filter );
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
