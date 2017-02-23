import { Observable } from 'rxjs';
import { IQuery } from './';
import { ExtendedMerger } from './extended-merger';

/**
 * ExtendedQuery
 * ...
 */
export class ExtendedQuery implements IQuery {
    /**
     * _merger
     * ...
     */
    protected _merger: ExtendedMerger;

    /**
     * constructor
     * ...
     */
    constructor( protected parent: IQuery, protected child: IQuery, protected fields: String[]) {
        this._merger = new ExtendedMerger();
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
            .map( sets => this._merger.mergeDocumentArrays( ...sets ));
    }
}
