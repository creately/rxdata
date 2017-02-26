import { Observable } from 'rxjs';
import { Query, SingleDocQuery } from '../query';
import { MockQuery } from '../__mocks__/query.mock';

describe( 'Query', () => {
    describe( 'value', () => {
        const documents = [
            { _id: 'i1', type: 'a', value: 5 },
            { _id: 'i2', type: 'b', value: 2 },
            { _id: 'i3', type: 'c', value: 3 },
            { _id: 'i4', type: 'b', value: 1 },
        ];

        it( 'should return an Observable', () => {
            const query = new Query();
            expect( query.value() instanceof Observable ).toBeTruthy();
        });

        it( 'should return matches on subscription', done => {
            const query = new Query({
                filter: { type: 'b' },
                initialDocuments: documents,
                changes: Observable.of(),
            });
            query.value().take( 1 ).subscribe(
                data => {
                    expect( data ).toEqual([
                        { _id: 'i2', type: 'b', value: 2 },
                        { _id: 'i4', type: 'b', value: 1 },
                    ]);
                    done();
                },
                err => done.fail( err ),
            );
        });

        it( 'should return matches on "value" event', done => {
            const query = new Query({
                filter: { type: 'b' },
                changes: Observable.of({
                    type: 'value',
                    data: documents,
                }),
            });
            query.value().take( 1 ).subscribe(
                data => {
                    expect( data ).toEqual([
                        { _id: 'i2', type: 'b', value: 2 },
                        { _id: 'i4', type: 'b', value: 1 },
                    ]);
                    done();
                },
                err => done.fail( err ),
            );
        });

        it( 'should sort values by a field', done => {
            const query = new Query({
                filter: { type: 'b' },
                filterOptions: { sort: { value: 1 } },
                initialDocuments: documents,
            });
            query.value().take( 1 ).subscribe(
                data => {
                    expect( data ).toEqual([
                        { _id: 'i4', type: 'b', value: 1 },
                        { _id: 'i2', type: 'b', value: 2 },
                    ]);
                    done();
                },
                err => done.fail( err ),
            );
        });

        it( 'should limit number of results', done => {
            const query = new Query({
                filter: { type: 'b' },
                filterOptions: { limit: 1 },
                initialDocuments: documents,
            });
            query.value().take( 1 ).subscribe(
                data => {
                    expect( data ).toEqual([
                        { _id: 'i2', type: 'b', value: 2 },
                    ]);
                    done();
                },
                err => done.fail( err ),
            );
        });

        it( 'should skip a number of results', done => {
            const query = new Query({
                filter: { type: 'b' },
                filterOptions: { skip: 1 },
                initialDocuments: documents,
            });
            query.value().take( 1 ).subscribe(
                data => {
                    expect( data ).toEqual([
                        { _id: 'i4', type: 'b', value: 1 },
                    ]);
                    done();
                },
                err => done.fail( err ),
            );
        });
    });
});

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
