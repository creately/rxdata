import mingo from 'mingo';
import * as LocalForage from 'localforage';
import * as isequal from 'lodash.isequal';
import { Observable, Subject } from 'rxjs';
import { modify } from '@creately/mungo';
import { Channel } from '@creately/lschannel';

// Selector
// Selector is a mongo like selector used to filter documents.
export type Selector = any;

// Modifier
// Modifier is a mongo like modifier used to modify documents.
export type Modifier = any;

// FindOptions
// FindOptions can be used to customized how documents are filtered.
// Fields are optional. They are used in this order: query, sort, skip, limit.
export type FindOptions = {
  sort?: { [key: string]: 1 | -1 };
  skip?: number;
  limit?: number;
};

// DocumentChange
// DocumentChange describes a change which has occurred in the collection.
export type DocumentChange<T> = {
  type: 'insert' | 'update' | 'remove';
  docs: T[];
};

// Collection
// Collection ...?
export class Collection<T> {
  // allDocs
  // allDocs emits all documents in the collection when they get modified.
  private allDocs: Subject<T[]>;

  // storage
  // storage stores documents in a suitable storage backend.
  private storage: LocalForage;

  // channel
  // channel sends/receives messages between browser tabs.
  private changes: Channel<DocumentChange<T>>;

  // constructor
  constructor(public name: string) {
    this.allDocs = new Subject();
    this.storage = LocalForage.createInstance({ name });
    this.changes = Channel.create(`rxdata.${name}.channel`);
    this.changes.subscribe(() => this.refresh());
  }

  // watch
  // watch watches for modified documents in the collection and emits
  // when they change. Accepts an optional selector to only watch changes
  // made to documents which match the selector.
  public watch(selector?: Selector): Observable<DocumentChange<T>> {
    if (!selector) {
      return this.changes;
    }
    const mq = new mingo.Query(selector);
    return this.changes.flatMap(change => {
      const docs = change.docs.filter(doc => mq.test(doc));
      if (!docs.length) {
        return Observable.of();
      }
      return Observable.of(Object.assign({}, change, { docs }));
    });
  }

  // find
  // find returns an observable of documents which matches the given
  // selector and filter options (both are optional). The observable
  // re-emits whenever the result value changes.
  public find(selector: Selector = {}, options: FindOptions = {}): Observable<T[]> {
    if (Object.keys(selector).length === 0 && Object.keys(options).length === 0) {
      return this.allDocs;
    }
    return Observable.fromPromise(this.load(selector))
      .concat(this.allDocs)
      .map(docs => this.filter(docs, selector, options))
      .distinctUntilChanged(isequal);
  }

  // find
  // find returns an observable of a document which matches the given
  // selector and filter options (both are optional). The observable
  // re-emits whenever the result value changes.
  public findOne(selector: Selector = {}, options: FindOptions = {}): Observable<T> {
    options.limit = 1;
    return Observable.fromPromise(this.load(selector))
      .concat(this.allDocs)
      .map(docs => this.filter(docs, selector, options)[0] || null)
      .distinctUntilChanged(isequal);
  }

  // insert
  // insert inserts a new document into the collection. If a document
  // with the id already exists in the collection, it will be replaced.
  public async insert(docOrDocs: T | T[]): Promise<void> {
    const docs = Array.isArray(docOrDocs) ? docOrDocs : [docOrDocs];
    await Promise.all(docs.map(doc => this.storage.setItem((doc as any).id, doc)));
    this.changes.next({ type: 'insert', docs: docs });
  }

  // update
  // update modifies existing documents in the collection which passes
  // the given selector.
  public async update(selector: Selector, modifier: Modifier): Promise<void> {
    const docs = await this.load(selector);
    docs.forEach(doc => modify(doc, modifier));
    await Promise.all(docs.map(doc => this.storage.setItem((doc as any).id, doc)));
    this.changes.next({ type: 'update', docs: docs });
  }

  // remove
  // remove removes existing documents in the collection which passes
  // the given selector.
  public async remove(selector: Selector): Promise<void> {
    const docs = await this.load(selector);
    await Promise.all(docs.map(doc => this.storage.removeItem((doc as any).id)));
    this.changes.next({ type: 'remove', docs: docs });
  }

  // filter
  // filter returns an array of documents which match the selector and
  // filter options. The selector, options and all option fields are optional.
  private filter(docs: T[], selector: Selector, options: FindOptions): T[] {
    let cursor = mingo.find(docs, selector);
    if (options.sort) {
      cursor = cursor.sort(options.sort);
    }
    if (options.skip) {
      cursor = cursor.skip(options.skip);
    }
    if (options.limit) {
      cursor = cursor.limit(options.limit);
    }
    return cursor.all();
  }

  // load
  // load fetches a set of documents which belongs to a collection.
  // If a filter is given, only return documents passing the filter.
  // Returns a promise which resolves to an array of documents.
  private async load(selector?: Selector): Promise<any[]> {
    const docs: any[] = [];
    let filter: Function;
    if (selector) {
      const mq = new mingo.Query(selector);
      filter = (doc: any) => mq.test(doc);
    }
    await this.storage.iterate((doc: any) => {
      if (!filter || filter(doc)) {
        docs.push(doc);
      }
      // If a non-undefined value is returned,
      // the localforage iterator will stop.
      return undefined;
    });
    return docs;
  }

  // refresh
  // refresh loads all documents from localForage storage and emits it
  // to all listening queries. Called when the collection gets changed.
  private async refresh() {
    const documents = await this.load();
    this.allDocs.next(documents);
  }
}
