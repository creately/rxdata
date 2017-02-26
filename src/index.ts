import { Observable } from 'rxjs';
import { FilterOptions } from './doc-utilities/filter-documents';

export { Database } from './database';
export { Collection } from './collection';
export { Query } from './query';
export { ExtendedCollection, ExtendedQuery } from './extended';

/**
 * IDatabase
 * IDatabase contains a set of collections which stores documents.
 */
export interface IDatabase {
    collection( name ): ICollection;
}

/**
 * ICollection
 * ICollection contains a set of documents which can be manipulated
 * using collection methods. It uses a IPersistor to store data.
 */
export interface ICollection {
    find( filter: any, options?: FilterOptions ): IQuery;
    findOne( filter: any, options?: FilterOptions ): IQuery;
    insert( doc: any ): Observable<any>;
    update( filter: any, changes: any ): Observable<any[]>;
    remove( filter: any ): Observable<any[]>;
}

/**
 * IQuery
 * IQuery wraps the result of a collection find query.
 */
export interface IQuery {
    value(): Observable<any>;
}

/**
 * IPersistorFactory
 * IPersistorFactory creates a Persistors for collections to store data.
 */
export interface IPersistorFactory {
    create( collectionName: string ): IPersistor;
}

/**
 * IPersistor
 * IPersistor stores data in a permanent storage location. With default
 * options, data may get stored in IndexedDB, WebSQL or LocalStorage.
 * Each collection has it's own IPersistor instance to store data.
 */
export interface IPersistor {
    load(): Promise<any[]>;
    store( docs: any[]): Promise<any>;
    remove( docs: any[]): Promise<any>;
}
