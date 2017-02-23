import { IPersistor, IPersistorFactory } from '../../';

/**
 * MockPersistorFactory
 * ...
 */
export class MockPersistorFactory implements IPersistorFactory {
    /**
     * create creates a new MockPersistor instance.
     */
    public create( collectionName: string ): IPersistor {
        return new MockPersistor();
    }
}

/**
 * DefaultPersistor
 * ...
 */
export class MockPersistor implements IPersistor {
    public load: any = jest.fn();
    public store: any = jest.fn();
    public remove: any = jest.fn();
}
