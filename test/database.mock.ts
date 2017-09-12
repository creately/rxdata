import { Database } from '../';

export class MockDatabase extends Database {
    public $getCollections() {
        return ( this as any ).collections;
    }
    public $createGetterForCollections() {
        return spyOnProperty( this as any, 'collections', 'get' );
    }
    private $spyForCollection: jasmine.Spy;
    public $createSpyForCollection() {
        if ( !this.$spyForCollection ) {
            this.$spyForCollection = spyOn( this as any, 'collection' );
        }
        return this.$spyForCollection;
    }
    private $spyForDrop: jasmine.Spy;
    public $createSpyForDrop() {
        if ( !this.$spyForDrop ) {
            this.$spyForDrop = spyOn( this as any, 'drop' );
        }
        return this.$spyForDrop;
    }
    public $getCollectionsListKey() {
        return ( this as any ).collectionsListKey;
    }
    public $createGetterForCollectionsListKey() {
        return spyOnProperty( this as any, 'collectionsListKey', 'get' );
    }
    public $getCollectionsList() {
        return ( this as any ).collectionsList;
    }
    public $createGetterForCollectionsList() {
        return spyOnProperty( this as any, 'collectionsList', 'get' );
    }
    public $createSetterForCollectionsList() {
        return spyOnProperty( this as any, 'collectionsList', 'set' );
    }
    public registerCollection( ...args: any[] ) {
        return super.registerCollection.call( this, ...args );
    }
    private $spyForRegisterCollection: jasmine.Spy;
    public $createSpyForRegisterCollection() {
        if ( !this.$spyForRegisterCollection ) {
            this.$spyForRegisterCollection = spyOn( this as any, 'registerCollection' );
        }
        return this.$spyForRegisterCollection;
    }
    public createCollection( ...args: any[] ) {
        return super.createCollection.call( this, ...args );
    }
    private $spyForCreateCollection: jasmine.Spy;
    public $createSpyForCreateCollection() {
        if ( !this.$spyForCreateCollection ) {
            this.$spyForCreateCollection = spyOn( this as any, 'createCollection' );
        }
        return this.$spyForCreateCollection;
    }
    public $createGetterForName() {
        return spyOnProperty( this as any, 'name', 'get' );
    }
}
