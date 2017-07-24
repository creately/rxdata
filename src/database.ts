import { Collection } from './collection';
import { IDatabase, ICollection, IDatabasePersistor } from './';
import { LocalForageDatabasePersistor } from './persistors/localforage';
import { Observable } from 'rxjs';

/**
 * DatabaseOptions
 * DatabaseOptions is used to customize database behavior.
 */
export type DatabaseOptions = {
  persistor: IDatabasePersistor;
};

/**
 * Database
 * Database is a collection of collections.
 */
export class Database implements IDatabase {
  /**
     * static defaultOptions
     * defaultOptions is the DatabaseOptions object which will be used
     * if an options argument is not provided when creating a database.
     */
  protected static defaultOptions: DatabaseOptions = {
    persistor: new LocalForageDatabasePersistor('rxdata'),
  };

  /**
     * static configure
     * configure sets the default options which will
     * @param _options: An options object to set as default options.
     */
  public static configure(options: DatabaseOptions) {
    this.defaultOptions = options;
  }

  /**
     * static create
     * create creates a new Database class with default configurations.
     * This method can be used as a factory function to create new
     * Database instances. (eg: with Angular2 AOT compilation)
     */
  public static create(): IDatabase {
    return new Database();
  }

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
  constructor(protected _options: DatabaseOptions = Database.defaultOptions) {
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
  public collection(name: string): ICollection {
    if (this._collections.has(name)) {
      return this._collections.get(name);
    }
    const collection = this._createCollection(name);
    this._collections.set(name, collection);
    return collection;
  }

  /**
     * drop
     * drop clears all data in all collections in the database.
     * It also closes all active subscriptions in all collections.
     */
  public drop(): Observable<any> {
    const observables = [];
    this._collections.forEach(col => observables.push(col.unsub()));
    observables.push(Observable.fromPromise(this._options.persistor.drop()));
    this._collections = new Map<string, Collection>();
    return Observable.forkJoin(observables);
  }

  /**
     * _createCollection
     * _createCollection creates a collection with given name. It will also
     * create a new persistor for the collection.
     *
     * @param name: The name of the collection to create.
     */
  protected _createCollection(name: string): Collection {
    const persistor = this._options.persistor.create(name);
    return new Collection(persistor);
  }
}
