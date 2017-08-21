import { Observable } from 'rxjs';
import { IDatabase, IDatabaseOptions, ICollection } from './types';
import { Collection } from './collection';

// Database
// Database is a collection of collections.
export class Database implements IDatabase {
  // collections
  // collections is a map of collections by their names.
  protected collections: Map<string, ICollection<any>>;

  // constructor
  // constructor creates a new Database instance.
  constructor(protected options: IDatabaseOptions) {
    this.collections = new Map<string, ICollection<any>>();
  }

  // collection
  // collection will return a collection for a given collection name.
  // If a collection does not already exists with the given name,
  // a new collection will be created.
  public collection<T>(name: string): ICollection<T> {
    if (this.collections.has(name)) {
      return this.collections.get(name) as ICollection<T>;
    }
    const collection = this.createCollection<T>(name);
    this.collections.set(name, collection);
    return collection;
  }

  // drop
  // drop clears all data in all collections in the database.
  // It also closes all active subscriptions in all collections.
  public drop(): Observable<void> {
    this.collections.forEach(col => col.unsub());
    this.collections = new Map<string, Collection<any>>();
    const promise = this.options.persistor.drop();
    return Observable.fromPromise(promise);
  }

  // createCollection
  // createCollection creates a collection with given name. It will also
  // create a new persistor for the collection.
  protected createCollection<T>(name: string): Collection<T> {
    const persistor = this.options.persistor.create(name);
    return new Collection<T>(name, persistor);
  }
}
