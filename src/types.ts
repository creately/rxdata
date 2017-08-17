import { Observable } from 'rxjs';

// DocumentSelector
// DocumentSelector is a mongo like selector used to filter documents.
export type DocumentSelector = any;

// DocumentChanges
// DocumentChanges is a mongo like modifier used to modify documents.
export type DocumentModifier = any;

// IFilterOptions
// IFilterOptions can be used to customized how documents are filtered.
// Fields are optional. They are used in this order: query, sort, skip, limit.
export interface IFilterOptions {
  selector?: DocumentSelector;
  sort?: { [key: string]: 1 | -1 };
  skip?: number;
  limit?: number;
}

// IQueryOne
// IQueryOne wraps the result of a collection findOne query.
export interface IQueryOne<T> {
  value(): Observable<T>;
}

// IQueryMany
// IQueryMany wraps the result of a collection find query.
export interface IQueryMany<T> {
  value(): Observable<T[]>;
}

// ICollectionPersistor
// ICollectionPersistor stores data in a permanent storage location. With
// default options, data may get stored in IndexedDB, WebSQL or LocalStorage.
// Each collection has it's own ICollectionPersistor instance to store data.
export interface ICollectionPersistor {
  oplog: Observable<null>;
  find(): Promise<any[]>;
  insert(docs: any[]): Promise<void>;
  remove(ids: string[]): Promise<void>;
  drop(): Promise<void>;
}

// IDatabasePersistor
// IDatabasePersistor creates Persistors for collections to store data.
export interface IDatabasePersistor {
  create(collectionName: string): ICollectionPersistor;
  drop(): Promise<void>;
}

// IDatabase
// IDatabase contains a set of collections which stores documents.
export interface IDatabase {
  collection<T>(name: string): ICollection<T>;
  drop(): Observable<void>;
}

// ICollection
// ICollection contains a set of documents which can be manipulated
// using collection methods. It uses ICollectionPersistors to store.
export interface ICollection<T> {
  find(selector: DocumentSelector, options?: IFilterOptions): IQueryMany<T>;
  findOne(selector: DocumentSelector, options?: IFilterOptions): IQueryOne<T>;
  insert(doc: T | T[]): Observable<void>;
  update(selector: DocumentSelector, changes: DocumentModifier): Observable<void>;
  remove(selector: DocumentSelector): Observable<void>;
  unsub(): void;
}
