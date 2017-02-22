import { Observable } from 'rxjs';
import { FilterOptions } from './collection';
export { Database } from './database';
export { Collection } from './collection';
export { Query } from './query';

/**
 * IDatabase
 * ...
 */
export interface IDatabase {
    collection( name ): ICollection;
}

/**
 * ICollection
 * ...
 */
export interface ICollection {
    find( filter: any, options: FilterOptions ): IQuery;
    insert( doc: any ): Observable<any>;
    update( filter: any, changes: any ): Observable<any[]>;
    remove( filter: any ): Observable<any[]>;
}

/**
 * IQuery
 * ...
 */
export interface IQuery {
    value(): Observable<any[]>;
}

/**
 * Persistor
 * ...
 */
export interface IPersistorFactory {
    create( collectionName: string ): IPersistor;
}

/**
 * Persistor
 * ...
 */
export interface IPersistor {
    load(): Promise<any[]>;
    store( docs: any[]): Promise<any>;
    remove( docs: any[]): Promise<any>;
}
