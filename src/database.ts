import { Collection } from './collection';
import { IPersistorFactory } from './';
import { LocalForagePersistorFactory } from './persistors/localforage';

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
    persistorFactory: new LocalForagePersistorFactory( 'rxdata' ),
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
    public collection( name ): Collection {
        if ( this._collections.has( name )) {
            return this._collections.get( name );
        }
        const collection = this._createCollection( name );
        this._collections.set( name,  collection );
        return collection;
    }

    /**
     * _createCollection
     * ...
     */
    protected _createCollection( name: string ): Collection {
        const persistor = this._options.persistorFactory.create( name );
        return new Collection( persistor );
    }
}
