import { Observable } from 'rxjs';
import { ICollection, IDatabasePersistor } from '../';
import { Database, DEFAULT_OPTIONS } from '../database';
import { Collection } from '../collection';
import { MockCollectionPersistor, MockDatabasePersistor } from '../persistors/__mocks__/persistor.mock';
import { createCollections } from '../__mocks__/database.mock';

describe( 'Database', () => {
    describe( 'constructor', () => {
        it( 'should create a new instance with default options', () => {
            const database = new Database();
            expect(( database as any )._options ).toBe( DEFAULT_OPTIONS );
        });
    });

    describe( 'collection', () => {
        let databasePersistor: MockDatabasePersistor;
        let database: Database;
        let collection: ICollection;

        beforeEach(() => {
            databasePersistor = new MockDatabasePersistor();
            database = new Database({ persistor: databasePersistor });
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
            expect( databasePersistor.create ).toHaveBeenCalledWith( 'col' );
        });
    });

    describe( 'drop', () => {
        let databasePersistor: MockDatabasePersistor;
        let database: Database;

        beforeEach(() => {
            databasePersistor = new MockDatabasePersistor();
            database = new Database({ persistor: databasePersistor });
        });

        it( 'should call drop method on database persistor', done => {
            database.drop().subscribe({
                error: err => done.fail( err ),
                complete: () => {
                    expect( databasePersistor.drop ).toHaveBeenCalled();
                    done();
                },
            });
        });
    });
});
