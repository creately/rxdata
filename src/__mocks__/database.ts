import { spyOn } from '../__test_utils';
import { Database } from '../database';

export class MockDatabase extends Database {
    spyOnCollection(): jest.Mock<any> {
        return spyOn( this, 'collection' );
    }

    spyOnCreateNewCollection(): jest.Mock<any> {
        return spyOn( this, '_createNewCollection' );
    }

    spyOnCreateNewPersistor(): jest.Mock<any> {
        return spyOn( this, '_createNewPersistor' );
    }
}
