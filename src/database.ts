import { Collection, IDocument } from './collection';

// ErrDatabaseClosed
// ErrDatabaseClosed is thrown when an operation is attempted when the database is closed.
export const ErrDatabaseClosed = new Error('database is closed');

// Database
// Database is a collection of collections.
export class Database {
  // collections
  // collections is a map of collections by their names.
  protected collections: Map<string, Collection<any>>;

  // create
  // create creates a new Database instance with defaults.
  public static create(): Database {
    return new Database('default');
  }

  // constructor
  // constructor creates a new Database instance.
  constructor(public name: string) {
    this.collections = new Map();
  }

  // close
  // close stops all database activities and disables all public methods.
  // This also closes all collection instances created by this database.
  public close() {
    this.collections.forEach(col => col.close());
    ['close', 'drop', 'collection'].forEach(name => {
      (this as any)[name] = () => {
        throw ErrDatabaseClosed;
      };
    });
  }

  // collection
  // collection will return a collection for a given collection name.
  // If a collection does not already exists with the given name,
  // a new collection will be created.
  public collection<T extends IDocument>(cname: string): Collection<T> {
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
  protected get collectionsListKey(): string {
    return `rxdata.${this.name}.collections`;
  }

  // get collectionsList
  // collectionsList is stored in browser localStorage therefore the
  // collections name list is created by parsing the stored JSON string.
  protected get collectionsList(): string[] {
    const str = localStorage.getItem(this.collectionsListKey);
    return JSON.parse(str || '[]');
  }

  // set collectionsList
  // collectionsList is stored in browser localStorage therefore the
  // collections name list is serialized into a JSON and stored.
  protected set collectionsList(arr: string[]) {
    const str = JSON.stringify(arr);
    localStorage.setItem(this.collectionsListKey, str);
  }

  // registerCollection
  // registerCollection registers the collection with the database
  // so that the database can know names of collections it has.
  protected registerCollection(name: string) {
    const list = this.collectionsList;
    if (list.indexOf(name) === -1) {
      this.collectionsList = list.concat(name);
    }
  }

  // createCollection
  // createCollection creates a collection with given name and registers
  // the collection with this database instance.
  protected createCollection<T extends IDocument>(name: string): Collection<T> {
    this.registerCollection(name);
    return new Collection<T>(name);
  }
}
