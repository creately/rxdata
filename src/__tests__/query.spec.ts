import { Observable, BehaviorSubject } from 'rxjs';
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
            const query = new Query({
                values: new BehaviorSubject( documents ),
            });
            expect( query.value() instanceof Observable ).toBeTruthy();
        });

        it( 'should return all docs on subscription if no filter is given', done => {
            const query = new Query({
                values: new BehaviorSubject( documents ),
            });
            query.value().take( 1 ).subscribe(
                data => {
                    expect( data ).toEqual([
                        { _id: 'i1', type: 'a', value: 5 },
                        { _id: 'i2', type: 'b', value: 2 },
                        { _id: 'i3', type: 'c', value: 3 },
                        { _id: 'i4', type: 'b', value: 1 },
                    ]);
                    done();
                },
                err => done.fail( err ),
            );
        });

        it( 'should return matches on subscription', done => {
            const query = new Query({
                filter: { type: 'b' },
                values: new BehaviorSubject( documents ),
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

        it( 'should return matches on "next" call on "values" Observable', done => {
            const values = new BehaviorSubject([]);
            const query = new Query({
                filter: { type: 'b' },
                values: values,
            });
            setTimeout(() => values.next( documents ), 100 );
            query.value().skip( 1 ).take( 1 ).subscribe(
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
                values: new BehaviorSubject( documents ),
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
                values: new BehaviorSubject( documents ),
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
                values: new BehaviorSubject( documents ),
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

        it( 'should not emit duplicate results', done => {
            const values = new BehaviorSubject( documents );
            const query = new Query({
                filter: {},
                values: values,
            });
            const received = [];
            setTimeout(() => values.next( documents ), 100 );
            setTimeout(
                () => {
                    expect( received ).toEqual([ documents ]);
                    done();
                },
                200,
            );
            query.value().subscribe(
                data => received.push( data ),
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
