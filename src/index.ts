import { Observable } from 'rxjs';
import { FilterOptions } from './doc-utilities/filter-documents';

export { Database } from './database';
export { Collection } from './collection';
export { Query, SingleDocQuery } from './query';
export { ExtendedCollection, ExtendedQuery } from './extended';

/**
 * IDatabase
 * IDatabase contains a set of collections which stores documents.
 */
export interface IDatabase {
  collection(name): ICollection;
  drop(): Observable<any>;
}

/**
 * ICollection
 * ICollection contains a set of documents which can be manipulated
 * using collection methods. It uses ICollectionPersistors to store.
 */
export interface ICollection {
  find(filter: any, options?: FilterOptions): IQuery;
  findOne(filter: any, options?: FilterOptions): IQuery;
  insert(doc: any): Observable<any[]>;
  update(filter: any, changes: any): Observable<any[]>;
  remove(filter: any): Observable<any[]>;
  unsub(): Observable<any>;
}

/**
 * IQuery
 * IQuery wraps the result of a collection find query.
 */
export interface IQuery {
  value(): Observable<any>;
}

/**
 * IDatabasePersistor
 * IDatabasePersistor creates Persistors for collections to store data.
 */
export interface IDatabasePersistor {
  create(collectionName: string): ICollectionPersistor;
  drop(): Promise<any>;
}

/**
 * ICollectionPersistor
 * ICollectionPersistor stores data in a permanent storage location. With default
 * options, data may get stored in IndexedDB, WebSQL or LocalStorage.
 * Each collection has it's own ICollectionPersistor instance to store data.
 */
export interface ICollectionPersistor {
  load(): Promise<any[]>;
  store(docs: any[]): Promise<any>;
  remove(docs: any[]): Promise<any>;
  drop(): Promise<any>;
}
