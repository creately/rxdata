import { Observable } from 'rxjs';
import { Query } from '../query';

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
                err => done( err ),
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
                err => done( err ),
            );
        });
    });
});
