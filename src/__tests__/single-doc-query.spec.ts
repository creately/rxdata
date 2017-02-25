import { Observable } from 'rxjs';
import { SingleDocQuery } from '../single-doc-query';
import { MockQuery } from '../__mocks__/query.mock';

describe( 'SingleDocQuery', () => {
    describe( 'value', () => {
        let mockQuery: MockQuery;
        let query: SingleDocQuery;
        const matches = [
            { _id: 'i1', type: 'a', value: 5 },
            { _id: 'i2', type: 'b', value: 2 },
        ];

        beforeEach(() => {
            mockQuery = new MockQuery();
            mockQuery.value.mockReturnValue( Observable.of( matches ));
            query = new SingleDocQuery( mockQuery );
        });

        it( 'should return an Observable', () => {
            expect( query.value() instanceof Observable ).toBeTruthy();
        });

        it( 'should get the first document returned by base query', done => {
            query.value().take( 1 ).subscribe(
                data => {
                    expect( data ).toEqual({ _id: 'i1', type: 'a', value: 5 });
                    done();
                },
                err => done.fail( err ),
            );
        });
    });
});
