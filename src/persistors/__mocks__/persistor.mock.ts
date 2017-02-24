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
        collectionName = collectionName;
        return new MockPersistor();
    }
}

/**
 * DefaultPersistor
 * ...
 */
export class MockPersistor implements IPersistor {
    public load: any = jest.fn().mockReturnValue( Promise.resolve([]));
    public store: any = jest.fn().mockReturnValue( Promise.resolve( null ));
    public remove: any = jest.fn().mockReturnValue( Promise.resolve( null ));
}
