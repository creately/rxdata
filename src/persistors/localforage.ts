import * as LocalForage from 'localforage';
import { IPersistor, IPersistorFactory } from '../';

/**
 * DefaultPersistorFactory
 * ...
 */
export class LocalForagePersistorFactory implements IPersistorFactory {
    /**
     * constructor
     * ...
     */
    constructor( protected databaseName: string ) {
        // ...
    }

    /**
     * create
     * ...
     */
    public create( collectionName: string ): IPersistor {
        const name = this._createFullName( collectionName );
        const localforage = this._createLocalForage( name );
        return new LocalForagePersistor( localforage );
    }

    /**
     * _createLocalForage
     * ...
     */
    protected _createLocalForage( name: string ): any {
        return LocalForage.createInstance({ name });
    }

    /**
     * _createFullName
     * ...
     */
     protected _createFullName( collectionName: string ): string {
         return `${this.databaseName}:${collectionName}`;
     }
}

/**
 * DefaultPersistor
 * ...
 */
export class LocalForagePersistor implements IPersistor {
    constructor( protected localforage: any ) {
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
