import { Observable } from 'rxjs';
import { Query, QueryOne } from '../query';
import { FilterOptions } from '../collection';

describe( 'Query', () => {
    describe( 'value', () => {
        it( 'should return an Observable', () => {
            const query = new Query({
                filter: {},
                documents: [],
                changes: Observable.of(),
            });
            expect( query.value() instanceof Observable ).toBeTruthy();
        });

        it( 'should return matches on subscription', done => {
            const query = new Query({
                filter: { type: 'b' },
                documents: [
                    { _id: 'i1', type: 'a' },
                    { _id: 'i2', type: 'b' },
                    { _id: 'i3', type: 'c' },
                    { _id: 'i4', type: 'b' },
                ],
                changes: Observable.of(),
            });
            query.value().take( 1 ).subscribe(
                data => {
                    expect( data ).toEqual([
                        { _id: 'i2', type: 'b' },
                        { _id: 'i4', type: 'b' },
                    ]);
                    done();
                },
                err => done.fail( err ),
            );
        });

        it( 'should return matches on "value" event', done => {
            const query = new Query({
                filter: { type: 'b' },
                documents: [],
                changes: Observable.of({
                    type: 'value',
                    data: [
                        { _id: 'i1', type: 'a' },
                        { _id: 'i2', type: 'b' },
                        { _id: 'i3', type: 'c' },
                        { _id: 'i4', type: 'b' },
                    ],
                }),
            });
            query.value().skip( 1 ).take( 1 ).subscribe(
                data => {
                    expect( data ).toEqual([
                        { _id: 'i2', type: 'b' },
                        { _id: 'i4', type: 'b' },
                    ]);
                    done();
                },
                err => done.fail( err ),
            );
        });

        it( 'should sort values by a field', done => {
            const query = new Query({
                filter: { type: 'b' },
                sort: { value: 1 },
                documents: [
                    { _id: 'i1', type: 'a' },
                    { _id: 'i2', type: 'b', value: 2 },
                    { _id: 'i3', type: 'c' },
                    { _id: 'i4', type: 'b', value: 1 },
                ],
                changes: Observable.of(),
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
                limit: 1 ,
                documents: [
                    { _id: 'i1', type: 'a' },
                    { _id: 'i2', type: 'b' },
                    { _id: 'i3', type: 'c' },
                    { _id: 'i4', type: 'b' },
                ],
                changes: Observable.of(),
            });
            query.value().take( 1 ).subscribe(
                data => {
                    expect( data ).toEqual([
                        { _id: 'i2', type: 'b' },
                    ]);
                    done();
                },
                err => done.fail( err ),
            );
        });

        it( 'should skip a number of results', done => {
            const query = new Query({
                filter: { type: 'b' },
                skip: 1 ,
                documents: [
                    { _id: 'i1', type: 'a' },
                    { _id: 'i2', type: 'b' },
                    { _id: 'i3', type: 'c' },
                    { _id: 'i4', type: 'b' },
                ],
                changes: Observable.of(),
            });
            query.value().take( 1 ).subscribe(
                data => {
                    expect( data ).toEqual([
                        { _id: 'i4', type: 'b' },
                    ]);
                    done();
                },
                err => done.fail( err ),
            );
        });
    });
});

describe( 'QueryOne', () => {
    describe( 'value', () => {
        it( 'should return an Observable', () => {
            const query = new QueryOne({
                filter: {},
                documents: [],
                changes: Observable.of(),
            });
            expect( query.value() instanceof Observable ).toBeTruthy();
        });

        it( 'should return the first match on subscription', done => {
            const query = new QueryOne({
                filter: { type: 'b' },
                documents: [
                    { _id: 'i1', type: 'a' },
                    { _id: 'i2', type: 'b' },
                    { _id: 'i3', type: 'c' },
                    { _id: 'i4', type: 'b' },
                ],
                changes: Observable.of(),
            });
            query.value().take( 1 ).subscribe(
                data => {
                    expect( data ).toEqual({ _id: 'i2', type: 'b' });
                    done();
                },
                err => done.fail( err ),
            );
        });

        it( 'should return the first match on "value" event', done => {
            const query = new QueryOne({
                filter: { type: 'b' },
                documents: [],
                changes: Observable.of({
                    type: 'value',
                    data: [
                        { _id: 'i1', type: 'a' },
                        { _id: 'i2', type: 'b' },
                        { _id: 'i3', type: 'c' },
                        { _id: 'i4', type: 'b' },
                    ],
                }),
            });
            query.value().skip( 1 ).take( 1 ).subscribe(
                data => {
                    expect( data ).toEqual({ _id: 'i2', type: 'b' });
                    done();
                },
                err => done.fail( err ),
            );
        });

        it( 'should sort values by a field', done => {
            const query = new QueryOne({
                filter: { type: 'b' },
                sort: { value: 1 },
                documents: [
                    { _id: 'i1', type: 'a' },
                    { _id: 'i2', type: 'b', value: 2 },
                    { _id: 'i3', type: 'c' },
                    { _id: 'i4', type: 'b', value: 1 },
                ],
                changes: Observable.of(),
            });
            query.value().take( 1 ).subscribe(
                data => {
                    expect( data ).toEqual({ _id: 'i4', type: 'b', value: 1 });
                    done();
                },
                err => done.fail( err ),
            );
        });

        it( 'should skip a number of results', done => {
            const query = new QueryOne({
                filter: { type: 'b' },
                skip: 1 ,
                documents: [
                    { _id: 'i1', type: 'a' },
                    { _id: 'i2', type: 'b' },
                    { _id: 'i3', type: 'c' },
                    { _id: 'i4', type: 'b' },
                ],
                changes: Observable.of(),
            });
            query.value().take( 1 ).subscribe(
                data => {
                    expect( data ).toEqual({ _id: 'i4', type: 'b' });
                    done();
                },
                err => done.fail( err ),
            );
        });
    });
});
