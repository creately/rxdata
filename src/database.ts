import { Collection } from './collection';
import { IDatabase, ICollection, IPersistorFactory } from './';
import { LocalForagePersistorFactory } from './persistors/localforage';

/**
 * DatabaseOptions
 * DatabaseOptions is used to customize database behavior.
 */
export type DatabaseOptions = {
    persistorFactory: IPersistorFactory,
};

/**
 * DEFAULT_OPTIONS
 * DEFAULT_OPTIONS will be used if database options are not
 * provided when creating a new database.
 */
export const DEFAULT_OPTIONS = {
    persistorFactory: new LocalForagePersistorFactory( 'rxdata' ),
};

/**
 * Database
 * Database is a collection of collections.
 */
export class Database implements IDatabase {
    /**
     * _collections
     * _collections is a map of collections by their names.
     */
    protected _collections: Map<string, Collection>;

    /**
     * constructor
     * constructor creates a new Database instance.
     *
     * @param _options: An options object to customize the database.
     */
    constructor( protected _options: DatabaseOptions = DEFAULT_OPTIONS ) {
        this._collections = new Map<string, Collection>();
    }

    /**
     * collection
     * collection will return a collection for a given collection name.
     * If a collection does not already exists with the given name,
     * a new collection will be created.
     *
     * @param name: The name of the collection to fetch/create.
     */
    public collection( name: string ): ICollection {
        if ( this._collections.has( name )) {
            return this._collections.get( name );
        }
        const collection = this._createCollection( name );
        this._collections.set( name,  collection );
        return collection;
    }

    /**
     * _createCollection
     * _createCollection creates a collection with given name. It will also
     * create a new persistor for the collection.
     *
     * @param name: The name of the collection to create.
     */
    protected _createCollection( name: string ): Collection {
        const persistor = this._options.persistorFactory.create( name );
        return new Collection( persistor );
    }
}
