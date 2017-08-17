import * as LocalForage from 'localforage';
import { Subject } from 'rxjs';
import { ICollectionPersistor, IDatabasePersistor } from './types';

// DatabasePersistor
// DatabasePersistor creates collection persistors and maintains a registry.
export class DatabasePersistor implements IDatabasePersistor {
  // metadata
  private metadata: LocalForage;

  //constructor
  constructor(private databaseName: string) {
    this.metadata = LocalForage.createInstance({ name: `${this.databaseName}.metadata` });
  }

  // create
  // create creates a new collection persistor with given name and registers it.
  public create(collectionName: string): ICollectionPersistor {
    // FIXME: collection register is async!!
    this.metadata.setItem(collectionName, { id: collectionName });
    return new CollectionPersistor(collectionName);
  }

  // drop
  // drop clears all collections and removes collection names from the registry.
  public async drop(): Promise<void> {
    const names = await this.metadata.keys();
    await Promise.all(names.map(name => LocalForage.createInstance({ name }).clear()));
    await this.metadata.clear();
  }
}

// CollectionPersistor
// CollectionPersistor stores documents in a localforage for a collection.
export class CollectionPersistor implements ICollectionPersistor {
  // lf
  // lf is the localforage instance used for this collection.
  private lf: LocalForage;

  // oplog
  // oplog emits events when changes occur in the collection.
  public oplog: Subject<null>;

  // constructor
  // constructor creates a collection persistor with given name.
  constructor(public name: string) {
    this.lf = LocalForage.createInstance({ name });
    this.oplog = new Subject();
  }

  // find
  // find fetches a set of documents which belongs to a collection.
  // If a filter is given, only return documents passing the filter.
  // Returns a promise which resolves to an array of documents.
  public async find(): Promise<any[]> {
    const docs: any[] = [];
    await this.lf.iterate((value: any) => {
      docs.push(value);
      // If a non-undefined value is returned,
      // the localforage iterator will stop.
      return undefined;
    });
    return docs;
  }

  // insert
  // insert inserts an array of documents into the database.
  public async insert(docs: any[]): Promise<void> {
    await Promise.all(docs.map(doc => this.lf.setItem(doc.id, doc)));
    this.oplog.next(null);
  }

  // remove
  // remove removes documents in the collection with given ids.
  public async remove(ids: string[]): Promise<void> {
    await Promise.all(ids.map(id => this.lf.removeItem(id)));
    this.oplog.next(null);
  }

  // drop
  // drop removes all documents in the collection.
  public async drop(): Promise<void> {
    await this.lf.clear();
    this.oplog.next(null);
  }
}
