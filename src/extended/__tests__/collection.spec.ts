import { Observable } from 'rxjs';
import { MockCollection } from '../../__mocks__/collection.mock';
import { ExtendedCollection } from '../collection';
import { ExtendedQuery } from '../query';
import { SingleDocQuery } from '../../query';

describe( 'ExtendedCollection', () => {
    let parent: MockCollection;
    let child: MockCollection;
    let collection: ExtendedCollection;

    beforeEach(() => {
        parent = new MockCollection();
        child = new MockCollection();
        collection = new ExtendedCollection( parent, child, [ 'y' ]);
    });

    describe( 'find', () => {
        it( 'should return an Query instance', () => {
            expect( collection.find({ id: 'i1' }) instanceof ExtendedQuery ).toBeTruthy();
        });

        it( 'should call the find method on parent without options', () => {
            collection.find({ id: 'i1' }, { limit: 10 });
            expect( parent.find ).toHaveBeenCalledWith({ id: 'i1' });
        });

        it( 'should call the find method on parent with parent fields', () => {
            collection.find({ id: 'i1', x: 2, y: 3 }, { limit: 10 });
            expect( parent.find ).toHaveBeenCalledWith({ id: 'i1', x: 2 });
        });

        it( 'should call the find method on child with options', () => {
            collection.find({ id: 'i1' }, { limit: 10 });
            expect( child.find ).toHaveBeenCalledWith({ id: 'i1' }, { limit: 10 });
        });

        it( 'should call the find method on child with chlid fields', () => {
            collection.find({ id: 'i1', x: 2, y: 3 }, { limit: 10 });
            expect( child.find ).toHaveBeenCalledWith({ id: 'i1', y: 3 }, { limit: 10 });
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

        it( 'should return merged inserted document', done => {
            collection.insert({ id: 'i1', x: 10, y: 20 }).subscribe(
                doc => {
                    expect( doc ).toEqual({ id: 'i1', x: 10, y: 20 });
                    done();
                },
                err => done.fail( err ),
            );
        });

        it( 'should insert the parent sub document in parent collection', done => {
            collection.insert({ id: 'i1', x: 10, y: 20 }).subscribe(
                () => { /* ¯\_(ツ)_/¯ */ },
                err => done.fail( err ),
                () => {
                    expect( parent.insert ).toHaveBeenCalledWith({ id: 'i1', x: 10 });
                    done();
                },
            );
        });

        it( 'should insert the child sub document in child collection', done => {
            collection.insert({ id: 'i1', x: 10, y: 20 }).subscribe(
                () => { /* ¯\_(ツ)_/¯ */ },
                err => done.fail( err ),
                () => {
                    expect( child.insert ).toHaveBeenCalledWith({ id: 'i1', y: 20 });
                    done();
                },
            );
        });
    });

    describe( 'update', () => {
        it( 'should return an Observable', () => {
            expect( collection.update({}, {}) instanceof Observable ).toBeTruthy();
        });

        it( 'should return merged updated documents', done => {
            parent.update.mockReturnValue( Observable.of([{ id: 'i1', x: 10 }, { id: 'i2' }]));
            child.update.mockReturnValue( Observable.of([{ id: 'i2' }, { id: 'i1', x: 20 }]));
            collection.update({}, {}).subscribe(
                docs => {
                    expect( docs ).toEqual([
                        { id: 'i1', x: 20 },
                        { id: 'i2' },
                    ]);
                    done();
                },
                err => done.fail( err ),
            );
        });

        it( 'should update the parent sub changes in parent collection', done => {
            collection.update({ foo: 'bar' }, { $set: { x: 10, y: 20 } }).subscribe(
                () => { /* ¯\_(ツ)_/¯ */ },
                err => done.fail( err ),
                () => {
                    expect( parent.update ).toHaveBeenCalledWith({ foo: 'bar' }, { $set: { x: 10 } });
                    done();
                },
            );
        });

        it( 'should update the child sub changes in child collection', done => {
            collection.update({ foo: 'bar' }, { $set: { x: 10, y: 20 } }).subscribe(
                () => { /* ¯\_(ツ)_/¯ */ },
                err => done.fail( err ),
                () => {
                    expect( child.update ).toHaveBeenCalledWith({ foo: 'bar' }, { $set: { y: 20 } });
                    done();
                },
            );
        });
    });

    describe( 'remove', () => {
        it( 'should return an Observable', () => {
            expect( collection.remove({}) instanceof Observable ).toBeTruthy();
        });

        it( 'should return merged removed documents', done => {
            parent.remove.mockReturnValue( Observable.of([{ id: 'i1', x: 10 }, { id: 'i2' }]));
            child.remove.mockReturnValue( Observable.of([{ id: 'i2' }, { id: 'i1', x: 20 }]));
            collection.remove({}).subscribe(
                docs => {
                    expect( docs ).toEqual([
                        { id: 'i1', x: 20 },
                        { id: 'i2' },
                    ]);
                    done();
                },
                err => done.fail( err ),
            );
        });

        it( 'should remove matching documents in parent collection', done => {
            collection.remove({ foo: 'bar' }).subscribe(
                () => { /* ¯\_(ツ)_/¯ */ },
                err => done.fail( err ),
                () => {
                    expect( parent.remove ).toHaveBeenCalledWith({ foo: 'bar' });
                    done();
                },
            );
        });

        it( 'should remove matching documents in child collection', done => {
            collection.remove({ foo: 'bar' }).subscribe(
                () => { /* ¯\_(ツ)_/¯ */ },
                err => done.fail( err ),
                () => {
                    expect( child.remove ).toHaveBeenCalledWith({ foo: 'bar' });
                    done();
                },
            );
        });
    });
});
