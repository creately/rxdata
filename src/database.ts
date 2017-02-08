import { Collection } from './collection';
import { Persistor, PersistorFactory } from './persistor';

export type DatabaseOptions = {
    persistorFactory: PersistorFactory,
}

/**
 * Database
 * ...
 */
export class Database {
    /**
     * _collections
     * ...
     */
    private _collections: Map<string, Collection>;

    /**
     * constructor
     * ...
     */
    constructor( private _options: DatabaseOptions ) {
        this._collections = new Map<string, Collection>();
    }

    /**
     * collection
     * ...
     */
    public collection( collectionName ): Collection {
        if ( this._collections.has( collectionName ) ) {
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
    protected _createNewPersistor( collectionName: string ): Persistor {
        const factory = this._options.persistorFactory;
        return factory.create( collectionName );
    }
}
