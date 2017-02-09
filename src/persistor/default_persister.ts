import localForage from 'localforage';
import { IPersistor } from './';

/**
 * DefaultPersistorFactory
 * ...
 */
export class DefaultPersistorFactory {
    /**
     * constructor
     * ...
     */
    constructor( private databaseName: string ) {
        // ...
    }

    /**
     * create
     * ...
     */
    public create( collectionName: string ): IPersistor {
        const name = this._createFullName( collectionName );
        const localforage = localForage.createInstance({ name });
        return new DefaultPersistor( localforage );
    }

    /**
     * _createFullName
     * ...
     */
     private _createFullName( collectionName: string ): string {
         return `${this.databaseName}:${collectionName}`;
     }
}

/**
 * DefaultPersistor
 * ...
 */
export class DefaultPersistor {
    constructor( private localforage: any ) {
        // ...
    }

    /**
     * load
     * ...
     */
    public load(): Promise<any[]> {
        const documents = [];
        return this.localforage
            .iterate( value  => {
                documents.push( value );
                return undefined;
            })
            .then(() => documents );
    }

    /**
     * store
     * ...
     */
    public store( docs: any[]): Promise<any> {
        const promises = docs.map( doc => this.localforage.setItem( doc.id, doc ));
        return Promise.all( promises );
    }

    /**
     * remove
     * ...
     */
    public remove( docs: any[]): Promise<any> {
        const promises = docs.map( doc => this.localforage.removeItem( doc.id ));
        return Promise.all( promises );
    }
}
