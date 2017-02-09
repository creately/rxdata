/**
 * Persistor
 * ...
 */
export interface IPersistorFactory {
    create( collectionName: string ): IPersistor;
}

/**
 * Persistor
 * ...
 */
export interface IPersistor {
    load(): Promise<any[]>;
    store( docs: any[]): Promise<any>;
    remove( docs: any[]): Promise<any>;
}
