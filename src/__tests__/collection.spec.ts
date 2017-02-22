import { Collection } from '../collection';
import { MockPersistor } from '../persistors/__mocks__/persistor.mock';
import { Observable } from 'rxjs';

describe( 'Collection', () => {
    describe( 'find', () => {
        it( 'should return an Observable' );
        it( 'should create a query with the filter' );
        it( 'should insert the query into active queries set' );
        it( 'should update the query with current documents' );
        it( 'should remove the query from active queries set on unsub' );
    });

    describe( 'insert', () => {
        it( 'should return an Observable' );
        it( 'should initialize the collection' );
        it( 'should remove if a document already exists with id' );
        it( 'should insert the document in memory' );
        it( 'should insert the document in persistor' );
        it( 'should update active queries with new documents' );
        it( 'should return inserted document' );
    });

    describe( 'update', () => {
        it( 'should return an Observable' );
        it( 'should initialize the collection' );
        it( 'should update matching documents in memory' );
        it( 'should update matching documents in persistor' );
        it( 'should update active queries with new documents' );
        it( 'should return updated documents' );

        /**
         * testUpdate
         * ...
         */
        const testUpdate = ( testCases: any[]) => {
            testCases.forEach( t => {
                it( t.description, done => {
                    const collection = new Collection( new MockPersistor());
                    Observable
                        .forkJoin( t.initialData.map( doc => collection.insert( doc )))
                        .switchMap(() => collection.update( t.updateQuery, t.updateChange ))
                        .subscribe(
                            data => {
                                expect( data ).toEqual( t.updatedData );
                                done();
                            },
                            err => done.fail( err ),
                        );
                });
            });
        };

        describe( '$set', () => {
            it( 'should modify all fields' );
            it( 'should modify nested fields' );
        });

        describe( '$push', () => {
            testUpdate([
                {
                    description: 'should push an item into an existing array',
                    initialData: [{ id: 'i1', arr: [ 10 ] }],
                    updateQuery: {},
                    updateChange: { $push: { arr: 20 } },
                    updatedData: [{ id: 'i1', arr: [ 10, 20 ] }],
                },
                {
                    description: 'should create an array if the field is missing',
                    initialData: [{ id: 'i1', arr: [ 10 ] }],
                    updateQuery: {},
                    updateChange: { $push: { arr: 20 } },
                    updatedData: [{ id: 'i1', arr: [ 10, 20 ] }],
                },
            ]);
        });

        describe( '$pull', () => {
            testUpdate([
                {
                    description: 'should pull an item from an array field',
                    initialData: [{ id: 'i1', arr: [ 10, 20, 30 ] }],
                    updateQuery: {},
                    updateChange: { $pull: { arr: 20 } },
                    updatedData: [{ id: 'i1', arr: [ 10, 30 ] }],
                },
                {
                    description: 'should pull an item from an array using $elemMatch',
                    initialData: [{ id: 'i1', arr: [{ x: 10 }, { x: 20, y: 5 }, { x: 30 }] }],
                    updateQuery: {},
                    updateChange: { $pull: { arr: { $elemMatch: { x: 20 } } } },
                    updatedData: [{ id: 'i1', arr: [{ x: 10 }, { x: 30 }] }],
                },
            ]);
        });
    });

    describe( 'remove', () => {
        it( 'should return an Observable' );
        it( 'should initialize the collection' );
        it( 'should remove matching documents in memory' );
        it( 'should remove matching documents in persistor' );
        it( 'should update active queries with new documents' );
        it( 'should return removed documents' );
    });
});
