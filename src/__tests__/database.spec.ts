import { Database } from '../database';
import { Collection } from '../collection';

describe( 'Database', () => {
    describe( 'collection', () => {
        it( 'should create a new collection if one does not exist with given name', () => {
            const database = new Database();
            const collection = database.collection( 'col' );
            expect( collection instanceof Collection ).toBeTruthy();
        });

        it( 'should return collection if one exists with given collection name', () => {
            const database = new Database();
            const collection = database.collection( 'col' );
            expect( database.collection( 'col' )).toBe( collection );
        });

        it( 'should always return the same collection instance for a given name', () => {
            const database = new Database();
            const collection = database.collection( 'col' );
            for ( let i = 0; i < 5; i++ ) {
                expect( database.collection( 'col' )).toBe( collection );
            }
        });

        it( 'should create a new persister with the collection name', () => {
            const factory = { create: jest.fn() };
            const database = new Database({ persistorFactory: factory });
            database.collection( 'col' );
            expect( factory.create ).toHaveBeenCalledWith( 'col' );
        });
    });
});
