import { IPersistor } from '../../';

/**
 * MockPersistorFactory
 * ...
 */
export class MockPersistorFactory {
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
export class MockPersistor {
    public load: any = jest.fn().mockReturnValue( Promise.resolve([]));
    public store: any = jest.fn().mockReturnValue( Promise.resolve( null ));
    public remove: any = jest.fn().mockReturnValue( Promise.resolve( null ));
}
