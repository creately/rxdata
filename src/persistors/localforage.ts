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
     * _collections
     * ...
     */
  protected _collections: Set<string>;
  protected _loadCollectionsPromise: Promise<Set<string>>;

  /**
     * constructor
     * ...
     */
  constructor(protected databaseName: string) {
    this._metadata = this._createLocalForageForMetadata();
    this._collections = new Set<string>();
  }

  /**
     * create
     * ...
     */
  public create(collectionName: string): ICollectionPersistor {
    // FIXME: collection registering is run async!!
    this._registerCollection(collectionName);
    const localforage = this._createLocalForageForCollection(collectionName);
    return new LocalForageCollectionPersistor(localforage);
  }

  /**
     * drop
     * ...
     */
  public drop(): Promise<any> {
    return this._metadata
      .getItem('collections')
      .then(collections => {
        if (!collections || !collections.length) {
          return;
        }
        return Promise.all(
          collections.map(collectionName => {
            const localforage = this._createLocalForageForCollection(collectionName);
            this._collections.clear();
            return localforage.clear();
          })
        );
      })
      .then(() => this._metadata.setItem('collections', []));
  }

  /**
     * _loadInitialCollections
     * ...
     */
  protected _loadInitialCollections(): Promise<Set<string>> {
    if (!this._loadCollectionsPromise) {
      this._loadCollectionsPromise = this._metadata.getItem('collections').then(collections => {
        if (collections) {
          collections.forEach(name => this._collections.add(name));
        }
      });
    }
    return this._loadCollectionsPromise;
  }

  /**
     * _registerCollection
     * ...
     */
  protected _registerCollection(name: string): Promise<any> {
    return this._loadInitialCollections().then(() => {
      if (this._collections.has(name)) {
        return;
      }
      this._collections.add(name);
      const collections = Array.from(this._collections);
      this._metadata.setItem('collections', collections);
    });
  }

  /**
     * _createLocalForageForCollection
     * ...
     */
  protected _createLocalForageForCollection(collectionName: string): any {
    const name = this._createCollectionName(collectionName);
    return this._createLocalForage(name);
  }

  /**
     * _createLocalForageForMetadata
     * ...
     */
  protected _createLocalForageForMetadata(): any {
    const name = this._createMetadataCollectionName('metadata');
    return this._createLocalForage(name);
  }

  /**
     * _createLocalForage
     * ...
     */
  protected _createLocalForage(name: string): any {
    return LocalForage.createInstance({ name });
  }

  /**
     * _createCollectionName
     * ...
     */
  protected _createCollectionName(collectionName: string): string {
    return `${this.databaseName}:${collectionName}`;
  }

  /**
     * _createMetadataCollectionName
     * ...
     */
  protected _createMetadataCollectionName(collectionName: string): string {
    return `${this.databaseName}.${collectionName}`;
  }
}

/**
 * LocalForageCollectionPersistor
 * ...
 */
export class LocalForageCollectionPersistor implements ICollectionPersistor {
  constructor(protected localforage: any) {
    // ...
  }

  /**
     * load
     * ...
     */
  public load(): Promise<any[]> {
    const documents = [];
    return this.localforage
      .iterate(value => {
        // If a non-undefined value is returned, the iterator will stop
        documents.push(value);
        return undefined;
      })
      .then(() => documents);
  }

  /**
     * store
     * ...
     */
  public store(docs: any[]): Promise<any> {
    return Promise.all(docs.map(doc => this.localforage.setItem(doc.id, doc)));
  }

  /**
     * remove
     * ...
     */
  public remove(docs: any[]): Promise<any> {
    return Promise.all(docs.map(doc => this.localforage.removeItem(doc.id)));
  }

  /**
     * drop
     * ...
     */
  public drop(): Promise<any> {
    return this.localforage.clear();
  }
}
