import { Persistor } from './';

/**
 * DebugPersistorFactory
 * ...
 */
export class DebugPersistorFactory {
    /**
     * create
     * ...
     */
    public create( collectionName: string ): Persistor {
        console.info('DebugPersistorFactory.create:', collectionName);
        return new DebugPersistor();
    }
}

/**
 * DebugPersistor
 * ...
 */
export class DebugPersistor {
    /**
     * load
     * ...
     */
    public load(): Promise<any[]> {
        console.info('DebugPersistor.load:');
        return Promise.resolve([]);
    }

    /**
     * store
     * ...
     */
    public store( docs: any[] ): Promise<any> {
        console.info('DebugPersistor.store:', docs);
        return Promise.resolve( null );
    }

    /**
     * remove
     * ...
     */
    public remove( docs: any[] ): Promise<any> {
        console.info('DebugPersistor.remove:', docs);
        return Promise.resolve( null );
    }
}
