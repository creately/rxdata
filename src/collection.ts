import { Observable, BehaviorSubject } from 'rxjs';
import {
  ICollection,
  IFilterOptions,
  IQueryMany,
  IQueryOne,
  DocumentSelector,
  ICollectionPersistor,
  DocumentModifier,
} from './types';
import { QueryMany, QueryOne } from './query';
import { createFilterFn, updateDocument } from './document';

export class Collection<T> implements ICollection<T> {
  // values
  // values is an observable which emits all documents in the
  // collection when any of them change. This is a BehaviorSubject
  // therefore it'll always emit the latest value when subscribed.
  private values: BehaviorSubject<T[]>;

  // constructor
  // constructor creates a new Collection instance and subscribes to changes
  // in the persistor.
  constructor(public name: string, private persistor: ICollectionPersistor) {
    this.values = new BehaviorSubject<T[]>([]);
    this.refresh();
    this.persistor.oplog.subscribe(() => this.refresh());
  }

  // find
  // find creates a query which will emit all matching documents.
  public find(selector: DocumentSelector, options: IFilterOptions = {}): IQueryMany<T> {
    options.selector = options.selector || selector;
    return new QueryMany(options, this.values);
  }

  // findOne
  // findOne creates a query which will emit the first matching document.
  public findOne(selector: DocumentSelector, options: IFilterOptions = {}): IQueryOne<T> {
    options.selector = options.selector || selector;
    return new QueryOne(options, this.values);
  }

  // insert
  // insert adds a new document to the collection. If a document already
  // exists in the collection with the same 'id', it'll be replaced.
  public insert(docOrDocs: T | T[]): Observable<void> {
    const docs = Array.isArray(docOrDocs) ? docOrDocs : [docOrDocs];
    const promise = this.persistor.insert(docs);
    return Observable.fromPromise(this.nullify(promise));
  }

  // update
  // update updates all matching documents in the collection.
  public update(selector: DocumentSelector, modifier: DocumentModifier): Observable<void> {
    const docs = this.values.value.filter(createFilterFn(selector)).map(doc => updateDocument(doc, modifier));
    const promise = this.persistor.insert(docs);
    return Observable.fromPromise(this.nullify(promise));
  }

  // remove
  // remove removes all matching documents from the collection.
  public remove(selector: DocumentSelector): Observable<void> {
    const ids = this.values.value.filter(createFilterFn(selector)).map((doc: any) => doc.id);
    const promise = this.persistor.remove(ids);
    return Observable.fromPromise(this.nullify(promise));
  }

  // unsub
  // unsub closes all query subscriptions with a complete.
  public unsub(): void {
    const values = this.values.value;
    this.values.complete();
    this.values = new BehaviorSubject<T[]>(values);
  }

  private async refresh() {
    const values = await this.persistor.find();
    this.values.next(values);
  }

  // nullify
  // nullify extends a promise chain and returns undefined
  private nullify(promise: Promise<any>): Promise<void> {
    return promise.then(() => undefined);
  }
}
