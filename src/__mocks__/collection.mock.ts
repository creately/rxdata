import { Observable } from 'rxjs';
import { ICollection } from '../';

/**
 * MockCollection
 * ...
 */
export class MockCollection implements ICollection {
    public find: any = jest.fn();
    public findOne: any = jest.fn();
    public insert: any = jest.fn( doc => Observable.of( doc ));
    public update: any = jest.fn(() => Observable.of([]));
    public remove: any = jest.fn(() => Observable.of([]));
    public unsub: any = jest.fn(() => Observable.of([]));
}

/**
 * mockify
 * ...
 */
export const mockify = ( col: ICollection ) => {
    Object.assign( col, new MockCollection());
};
