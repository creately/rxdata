import { Observable } from 'rxjs';
import { ICollection, IPersistorFactory } from '../';
import { Database, DEFAULT_OPTIONS } from '../database';
import { Collection } from '../collection';
import { MockPersistor, MockPersistorFactory } from '../persistors/__mocks__/persistor.mock';
import { createCollections } from '../__mocks__/database.mock';

describe( 'Database', () => {
    describe( 'constructor', () => {
        it( 'should create a new instance with default options', () => {
            const database = new Database();
            expect(( database as any )._options ).toBe( DEFAULT_OPTIONS );
        });
    });

    describe( 'collection', () => {
        let factory: IPersistorFactory;
        let database: Database;
        let collection: ICollection;

        beforeEach(() => {
            const persistor = new MockPersistor();
            factory = { create: jest.fn().mockReturnValue( persistor ) };
            database = new Database({ persistorFactory: factory });
            collection = database.collection( 'col' );
        });

        it( 'should create a new collection if one does not exist with given name', () => {
            expect( collection instanceof Collection ).toBeTruthy();
        });
        it( 'should return collection if one exists with given collection name', () => {
            expect( database.collection( 'col' )).toBe( collection );
        });

        it( 'should always return the same collection instance for a given name', () => {
            for ( let i = 0; i < 5; i++ ) {
                expect( database.collection( 'col' )).toBe( collection );
            }
        });

        it( 'should create a new persister with the collection name', () => {
            expect( factory.create ).toHaveBeenCalledWith( 'col' );
        });
    });

    describe( 'drop', () => {
        let database: Database;

        beforeEach(() => {
            const persistor = new MockPersistor();
            const factory = { create: jest.fn().mockReturnValue( persistor ) };
            database = new Database({ persistorFactory: factory });
        });

        it( 'should call remove method on all collections', done => {
            const collections = createCollections( database, 3 );
            database.drop().subscribe({
                error: err => done.fail( err ),
                complete: () => {
                    collections.forEach( col => {
                        expect( col.remove ).toHaveBeenCalledWith({});
                    });
                    done();
                },
            });
        });
    });
});
