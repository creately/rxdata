import { Observable } from 'rxjs';
import { ICollection } from '../';

/**
 * MockCollection
 * ...
 */
export class MockCollection implements ICollection {
    public find: any = jest.fn();
    public findOne: any = jest.fn();
    public insert: any = jest.fn().mockImplementation( doc => Observable.of( doc ));
    public update: any = jest.fn().mockReturnValue( Observable.of([]));
    public remove: any = jest.fn().mockReturnValue( Observable.of([]));
}
