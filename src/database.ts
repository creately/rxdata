import { Collection } from './collection';

// Database
// Database is a collection of collections.
export class Database {
  // collections
  // collections is a map of collections by their names.
  private collections: Map<string, Collection<any>>;

  // constructor
  // constructor creates a new Database instance.
  constructor(public name: string) {
    this.collections = new Map();
  }

  // collection
  // collection will return a collection for a given collection name.
  // If a collection does not already exists with the given name,
  // a new collection will be created.
  public collection<T>(cname: string): Collection<T> {
    const name = `rxdata.${this.name}.${cname}`;
    if (this.collections.has(name)) {
      return this.collections.get(name) as Collection<T>;
    }
    const collection = this.createCollection<T>(name);
    this.collections.set(name, collection);
    return collection;
  }

  // drop
  // drop clears all data in all collections in the database.
  // It also closes all active subscriptions in all collections.
  public async drop(): Promise<void> {
    this.collections = new Map();
    const collections = this.collectionsList;
    this.collectionsList = [];
    await Promise.all(collections.map(name => new Collection<any>(name).remove({})));
  }

  // collectionsListKey
  private get collectionsListKey(): string {
    return `rxdata.${this.name}.collections`;
  }

  // get collectionsList
  // collectionsList is stored in browser localStorage therefore the
  // collections name list is created by parsing the stored JSON string.
  private get collectionsList(): string[] {
    const str = localStorage.getItem(this.collectionsListKey);
    return JSON.parse(str || '[]');
  }

  // set collectionsList
  // collectionsList is stored in browser localStorage therefore the
  // collections name list is serialized into a JSON and stored.
  private set collectionsList(arr: string[]) {
    const str = JSON.stringify(arr);
    localStorage.setItem(this.collectionsListKey, str);
  }

  // registerCollection
  // registerCollection registers the collection with the database
  // so that the database can know names of collections it has.
  private registerCollection(name: string) {
    const list = this.collectionsList;
    if (list.indexOf(name) === -1) {
      this.collectionsList = list.concat(name);
    }
  }

  // createCollection
  // createCollection creates a collection with given name and registers
  // the collection with this database instance.
  private createCollection<T>(name: string): Collection<T> {
    this.registerCollection(name);
    return new Collection<T>(name);
  }
}
