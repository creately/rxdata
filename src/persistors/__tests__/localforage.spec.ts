import * as LocalForage from 'localforage';
import { LocalForageDatabasePersistor, LocalForageCollectionPersistor } from '../localforage';
import { testDatabasePersistor, testCollectionPersistor } from './_test_persistors';

describe( 'LocalForageDatabasePersistor', () => {
    testDatabasePersistor(() => new LocalForageDatabasePersistor( 'test-db' ));
});

describe( 'LocalForageCollectionPersistor', () => {
    testCollectionPersistor(() => {
        const localForage = LocalForage.createInstance({ name: 'test-lf' });
        return new LocalForageCollectionPersistor( localForage );
    });
});
