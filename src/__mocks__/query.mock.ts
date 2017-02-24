import { Observable } from 'rxjs';
import { IQuery } from '../';

/**
 * MockQuery
 * ...
 */
export class MockQuery implements IQuery {
    public value: any = jest.fn().mockReturnValue( Observable.of([]));
}
