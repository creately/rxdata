/**
 * Persistor
 * ...
 */
export interface PersistorFactory {
    create( collectionName: string ): Persistor;
}

/**
 * Persistor
 * ...
 */
export interface Persistor {
    load(): Promise<any[]>;
    store( docs: any[] ): Promise<any>;
    remove( docs: any[] ): Promise<any>;
}