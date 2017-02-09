import { IPersistor } from './';

/**
 * log
 * ...
 */
const log = ( ...args ) => {
    console.log.apply( null, args );
};

/**
 * DebugPersistorFactory
 * ...
 */
export class DebugPersistorFactory {
    /**
     * create
     * ...
     */
    public create( collectionName: string ): IPersistor {
        log( 'DebugPersistorFactory.create:', collectionName );
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
        log( 'DebugPersistor.load:' );
        return Promise.resolve([]);
    }

    /**
     * store
     * ...
     */
    public store( docs: any[]): Promise<any> {
        log( 'DebugPersistor.store:', docs );
        return Promise.resolve( null );
    }

    /**
     * remove
     * ...
     */
    public remove( docs: any[]): Promise<any> {
        log( 'DebugPersistor.remove:', docs );
        return Promise.resolve( null );
    }
}
