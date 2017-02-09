import { Collection } from './collection';
import { IPersistor, IPersistorFactory } from './persistor';
import { DefaultPersistorFactory } from './persistor_default';

/**
 * DatabaseOptions
 * ...
 */
export type DatabaseOptions = {
    persistorFactory: IPersistorFactory,
};

/**
 * DEFAULT_OPTIONS
 * ...
 */
export const DEFAULT_OPTIONS = {
    persistorFactory: new DefaultPersistorFactory( 'rxdata' ),
};

/**
 * Database
 * ...
 */
export class Database {
    /**
     * _collections
     * ...
     */
    protected _collections: Map<string, Collection>;

    /**
     * constructor
     * ...
     */
    constructor( protected _options: DatabaseOptions = DEFAULT_OPTIONS ) {
        this._collections = new Map<string, Collection>();
    }

    /**
     * collection
     * ...
     */
    public collection( collectionName ): Collection {
        if ( this._collections.has( collectionName )) {
            return this._collections.get( collectionName );
        }
        const collection = this._createNewCollection( collectionName );
        this._collections.set( collectionName,  collection );
        return collection;
    }

    /**
     * _createNewCollection
     * ...
     */
    protected _createNewCollection( collectionName: string ): Collection {
        const persistor = this._createNewPersistor( collectionName );
        const collection = new Collection( persistor );
        return collection;
    }

    /**
     * _createNewPersistor
     * ...
     */
    protected _createNewPersistor( collectionName: string ): IPersistor {
        const factory = this._options.persistorFactory;
        return factory.create( collectionName );
    }
}
