import * as LocalForage from 'localforage';
import { LocalForageDatabasePersistor, LocalForageCollectionPersistor } from '../localforage';
import { testDatabasePersistor, testCollectionPersistor } from './_test_persistors';

describe( 'LocalForageDatabasePersistor', () => {
    beforeEach(() => {
        LocalForage.clear();
    });

    // Run all tests which are common for all database persistors
    testDatabasePersistor(() => new LocalForageDatabasePersistor( 'test-db' ));

    describe( 'LocalForage', () => {
        let databasePersistor: LocalForageDatabasePersistor;

        beforeEach( async () => {
            databasePersistor = new LocalForageDatabasePersistor( 'test-db' );
        });

        it( 'should use same storage when there are multiple instances', done => {
            const databasePersistor2 = new LocalForageDatabasePersistor( 'test-db' );
            databasePersistor.create( 'col-1' ).store([{ x: 10 }])
                .then(() => databasePersistor2.create( 'col-1' ).load())
                .then( docs => {
                    expect( docs ).toEqual([{ x: 10 }]);
                    done();
                })
                .catch( err => done.fail( err ));
        });

        it( 'should handle if create is called multiple times for same name', done => {
            databasePersistor.create( 'test-col' );
            // FIXME: collection registering is run async!!
            setTimeout(() => {
                databasePersistor.create( 'test-col' );
                done();
            }, 100 );
        });
    });
});

describe( 'LocalForageCollectionPersistor', () => {
    beforeEach(() => {
        LocalForage.clear();
    });

    // Run all tests which are common for all collection persistors
    testCollectionPersistor(() => {
        const localForage = LocalForage.createInstance({ name: 'test-lf' });
        return new LocalForageCollectionPersistor( localForage );
    });
});
