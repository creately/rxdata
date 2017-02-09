import { spyOn } from '../__test_utils';
import { DefaultPersistorFactory, DefaultPersistor } from '../persistor_default';

export class MockDefaultPersistorFactory extends DefaultPersistorFactory {
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

export class MockDefaultPersistor extends DefaultPersistor {
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
