import { spyOn } from '../../__test_utils';
import { LocalForagePersistorFactory, LocalForagePersistor } from '../localforage';

export class MockLocalForagePersistorFactory extends LocalForagePersistorFactory {
    spyOnCreate(): jest.Mock<any> {
        return spyOn( this, 'create' );
    }

    spyOn_createLocalForage(): jest.Mock<any> {
        return spyOn( this, '_createLocalForage' );
    }

    spyOn_createFullName(): jest.Mock<any> {
        return spyOn( this, '_createFullName' );
    }
}

export class MockLocalForagePersistor extends LocalForagePersistor {
    spyOnLoad(): jest.Mock<any> {
        return spyOn( this, 'load' );
    }

    spyOnStore(): jest.Mock<any> {
        return spyOn( this, 'store' );
    }

    spyOnRemove(): jest.Mock<any> {
        return spyOn( this, 'remove' );
    }
}
