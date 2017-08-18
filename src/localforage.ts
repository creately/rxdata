import * as LocalForage from 'localforage';
import { Subject, Observable } from 'rxjs';
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
    const name = `${this.databaseName}:${collectionName}`;
    this.metadata.setItem(name, { id: name });
    return new CollectionPersistor(name);
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
  // oplog emits events when changes occur in the collection. This is the
  // combined observable of localChanges and remoteChanges observables.
  public oplog: Observable<any>;

  // localChanges
  // localChanges emits events when changes occur in current browser window.
  private localChanges: Subject<any>;

  // remoteChanges
  // remoteChanges emits events when changes occur in other browser windows.
  private remoteChanges: Observable<any>;

  // constructor
  // constructor creates a collection persistor with given name.
  constructor(public name: string) {
    this.lf = LocalForage.createInstance({ name });
    this.localChanges = new Subject();
    this.remoteChanges =  Observable.fromEvent(window, 'storage')
      .filter((e: any) => e.key === this.changeKey)
      .map((e: any) => JSON.parse(e.newValue));
    this.oplog = Observable.merge(
      this.localChanges,
      this.remoteChanges,
    );
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
    this.triggerChange({});
  }

  // remove
  // remove removes documents in the collection with given ids.
  public async remove(ids: string[]): Promise<void> {
    await Promise.all(ids.map(id => this.lf.removeItem(id)));
    this.triggerChange({});
  }

  // drop
  // drop removes all documents in the collection.
  public async drop(): Promise<void> {
    await this.lf.clear();
    this.triggerChange({});
  }

  // changeKey
  // changeKey is the key used to send
  private get changeKey(): string {
    return `rxdata-change-${this.name}`;
  }

  // triggerChange
  // triggerChange emits the change event to other open browser windows.
  private triggerChange(data: any) {
    const event = { id: this.newChangeId(), time: Date.now(), data };
    const val = JSON.stringify(event);
    localStorage.setItem(this.changeKey, val);
    this.localChanges.next(event);
  }

  // newChangeId
  // newChangeId creates a random id string to use as change id.
  private newChangeId(): string {
    let id = '';
    while (id.length < 16) {
      const r = Math.random().toString(36).slice(2);
      id += r.slice(0, 16 - id.length);
    }
    return id;
  }
}
