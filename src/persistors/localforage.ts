import * as LocalForage from 'localforage';
import { IDatabasePersistor, ICollectionPersistor } from '../';

/**
 * LocalForageDatabasePersistor
 * ...
 */
export class LocalForageDatabasePersistor implements IDatabasePersistor {
    /**
     * _registry
     * ...
     */
    protected _metadata: any;

    /**
     * constructor
     * ...
     */
    constructor( protected databaseName: string ) {
        this._metadata = this._createLocalForageForMetadata();
    }

    /**
     * create
     * ...
     */
    public create( collectionName: string ): ICollectionPersistor {
        // FIXME: collection registering is run async!!
        this._registerCollection( collectionName );
        const localforage = this._createLocalForageForCollection( collectionName );
        return new LocalForageCollectionPersistor( localforage );
    }

    /**
     * drop
     * ...
     */
    public drop(): Promise<any> {
        return this._metadata.getItem( 'collections' )
            .then( collections => {
                if ( !collections || !collections.length ) {
                    return;
                }
                return Promise.all( collections.map( collectionName => {
                    const localforage = this._createLocalForageForCollection( collectionName );
                    return localforage.clear();
                }));
            })
            .then(() => this._metadata.setItem( 'collections', []));

    }

    /**
     * _registerCollection
     * ...
     */
    protected _registerCollection( name: string ): Promise<any> {
        return this._metadata.getItem( 'collections' )
            .then( collections => {
                if ( !Array.isArray( collections )) {
                    return this._metadata.setItem( 'collections', [ name ]);
                }
                const set = new Set<string>( collections.concat( name ));
                return this._metadata.setItem( 'collections', Array.from( set ));
            });
    }

    /**
     * _createLocalForageForCollection
     * ...
     */
    protected _createLocalForageForCollection( collectionName: string ): any {
        const name = this._createCollectionName( collectionName );
        return this._createLocalForage( name );
    }

    /**
     * _createLocalForageForMetadata
     * ...
     */
    protected _createLocalForageForMetadata(): any {
        const name = this._createMetadataCollectionName( 'metadata' );
        return this._createLocalForage( name );
    }

    /**
     * _createLocalForage
     * ...
     */
    protected _createLocalForage( name: string ): any {
        return LocalForage.createInstance({ name });
    }

    /**
     * _createCollectionName
     * ...
     */
     protected _createCollectionName( collectionName: string ): string {
         return `${this.databaseName}:${collectionName}`;
     }

    /**
     * _createMetadataCollectionName
     * ...
     */
     protected _createMetadataCollectionName( collectionName: string ): string {
         return `${this.databaseName}.${collectionName}`;
     }
}

/**
 * LocalForageCollectionPersistor
 * ...
 */
export class LocalForageCollectionPersistor implements ICollectionPersistor {
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
                // If a non-undefined value is returned, the iterator will stop
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
        return Promise.all( docs.map( doc => this.localforage.setItem( doc.id, doc )));
    }

    /**
     * remove
     * ...
     */
    public remove( docs: any[]): Promise<any> {
        return Promise.all( docs.map( doc => this.localforage.removeItem( doc.id )));
    }

    /**
     * drop
     * ...
     */
    public drop(): Promise<any> {
        return this.localforage.clear();
    }
}
