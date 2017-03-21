import { Observable } from 'rxjs';
import { Collection } from '../collection';
import { MockPersistor } from '../persistors/__mocks__/persistor.mock';
import { Query, SingleDocQuery } from '../query';

describe( 'Collection', () => {
    let persistor: MockPersistor;
    let collection: Collection;

    beforeEach(() => {
        persistor = new MockPersistor();
        collection = new Collection( persistor );
    });

    describe( 'find', () => {
        it( 'should return an Query instance', () => {
            expect( collection.find({ foo: 'bar' }) instanceof Query ).toBeTruthy();
        });
    });

    describe( 'findOne', () => {
        it( 'should return a SingleDocQuery instance', () => {
            expect( collection.findOne({}) instanceof SingleDocQuery ).toBeTruthy();
        });
    });

    describe( 'insert', () => {
        it( 'should return an Observable', () => {
            expect( collection.insert({ id: 'i1' }) instanceof Observable ).toBeTruthy();
        });

        it( 'should return inserted document', done => {
            collection.insert({ id: 'i1', x: 10 }).subscribe(
                doc => {
                    expect( doc ).toEqual({ id: 'i1', x: 10 });
                    done();
                },
                err => done.fail( err ),
            );
        });

        it( 'should insert a new document in collection', done => {
            collection.insert({ id: 'i1', x: 10 })
                .switchMap(() => collection.find({}).value().take( 1 ))
                .subscribe(
                    docs => {
                        expect( docs ).toEqual([
                            { id: 'i1', x: 10 },
                        ]);
                        done();
                    },
                    err => done.fail( err ),
                );
        });

        it( 'should not store getters in the document object', done => {
            class TestDoc {
                public id = 'i1';
                private x = 10;
                get y() {
                    return 20;
                }
            }
            const doc = new TestDoc();
            collection.insert( doc )
                .switchMap(() => collection.find({}).value().take( 1 ))
                .subscribe(
                    docs => {
                        expect( docs ).toEqual([
                            { id: 'i1', x: 10 },
                        ]);
                        done();
                    },
                    err => done.fail( err ),
                );
        });

        it( 'should replace if a document already exists with id', done => {
            collection.insert({ id: 'i1', x: 10 })
                .switchMap(() => collection.insert({ id: 'i1', x: 20 }))
                .switchMap(() => collection.find({}).value().take( 1 ))
                .subscribe(
                    docs => {
                        expect( docs ).toEqual([
                            { id: 'i1', x: 20 },
                        ]);
                        done();
                    },
                    err => done.fail( err ),
                );
        });
    });

    describe( 'update', () => {
        it( 'should return an Observable', () => {
            expect( collection.update({}, {}) instanceof Observable ).toBeTruthy();
        });

        it( 'should return updated document', done => {
            collection.insert({ id: 'i1', x: 10 })
                .switchMap(() => collection.update({ id: 'i1' }, { $set: { x: 20 } }))
                .subscribe(
                    docs => {
                        expect( docs ).toEqual([
                            { id: 'i1', x: 20 },
                        ]);
                        done();
                    },
                    err => done.fail( err ),
                );
        });

        it( 'should update matching documents in collection', done => {
            collection.insert({ id: 'i1', x: 10 })
                .switchMap(() => collection.update({ id: 'i1' }, { $set: { x: 20 } }))
                .switchMap(() => collection.find({}).value().take( 1 ))
                .subscribe(
                    docs => {
                        expect( docs ).toEqual([
                            { id: 'i1', x: 20 },
                        ]);
                        done();
                    },
                    err => done.fail( err ),
                );
        });
    });

    describe( 'remove', () => {
        it( 'should return an Observable', () => {
            expect( collection.remove({}) instanceof Observable ).toBeTruthy();
        });

        it( 'should return updated document', done => {
            collection.insert({ id: 'i1', x: 10 })
                .switchMap(() => collection.remove({ id: 'i1' }))
                .subscribe(
                    docs => {
                        expect( docs ).toEqual([
                            { id: 'i1', x: 10 },
                        ]);
                        done();
                    },
                    err => done.fail( err ),
                );
        });

        it( 'should remove matching documents in collection', done => {
            collection.insert({ id: 'i1', x: 10 })
                .switchMap(() => collection.remove({ id: 'i1' }))
                .switchMap(() => collection.find({}).value().take( 1 ))
                .subscribe(
                    docs => {
                        expect( docs ).toEqual([]);
                        done();
                    },
                    err => done.fail( err ),
                );
        });
    });
});
