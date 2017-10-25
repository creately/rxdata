// tslint:disable

import { Database } from '../';

export class MockDatabase extends Database {
    /**
     * Static Helpers
     */

    private static $spies: any = {};
    private static get $class(): any {
        return Database;
    }
    public static $get( field: string ): any {
        return this.$class[field];
    }
    public static $call( field: string, ...args: any[]): any {
        return this.$class[field].call( this, ...args );
    }
    public static $createGetterFor( field: string ): jasmine.Spy {
        this.$spies[field] = spyOnProperty( this.$class, field, 'get' );
        return this.$spies[field];
    }
    public static $createSetterFor( field: string ): jasmine.Spy {
        this.$spies[field] = spyOnProperty( this.$class, field, 'set' );
        return this.$spies[field];
    }
    public static $createSpyFor( field: string ): jasmine.Spy {
        this.$spies[field] = spyOn( this.$class, field );
        return this.$spies[field];
    }
    public static $getSpyFor( field: string ): jasmine.Spy {
        return this.$spies[field];
    }

    /**
     * Instance Helpers
     */

    private $spies: any = {};
    private get $instance(): any {
        return this;
    }
    private get $prototype(): any {
        return Database.prototype;
    }
    public $get( field: string ): any {
        return this.$instance[field];
    }
    public $call( field: string, ...args: any[]): any {
        return this.$prototype[field].call( this, ...args );
    }
    public $createGetterFor( field: string ): jasmine.Spy {
        this.$spies[field] = spyOnProperty( this.$instance, field, 'get' );
        return this.$spies[field];
    }
    public $createSetterFor( field: string ): jasmine.Spy {
        this.$spies[field] = spyOnProperty( this.$instance, field, 'set' );
        return this.$spies[field];
    }
    public $createSpyFor( field: string ): jasmine.Spy {
        this.$spies[field] = spyOn( this.$instance, field );
        return this.$spies[field];
    }
    public $getSpyFor( field: string ): jasmine.Spy {
        return this.$spies[field];
    }

    /**
     * collections
     */
    public $getCollections() {
        return this.$get( 'collections' );
    }
    public $createGetterForCollections() {
        return this.$createGetterFor( 'collections' );
    }
    public $getSpyForCollections() {
        return this.$getSpyFor( 'collections' );
    }

    /**
     * create
     */
    public static $createSpyForCreate() {
        return this.$createSpyFor( 'create' );
    }
    public static $getSpyForCreate() {
        return this.$getSpyFor( 'create' );
    }

    /**
     * name
     */
    public $createGetterForName() {
        return this.$createGetterFor( 'name' );
    }
    public $getSpyForName() {
        return this.$getSpyFor( 'name' );
    }

    /**
     * collection
     */
    public $createSpyForCollection() {
        return this.$createSpyFor( 'collection' );
    }
    public $getSpyForCollection() {
        return this.$getSpyFor( 'collection' );
    }

    /**
     * drop
     */
    public $createSpyForDrop() {
        return this.$createSpyFor( 'drop' );
    }
    public $getSpyForDrop() {
        return this.$getSpyFor( 'drop' );
    }

    /**
     * collectionsListKey
     */
    public $getCollectionsListKey() {
        return this.$get( 'collectionsListKey' );
    }
    public $createGetterForCollectionsListKey() {
        return this.$createGetterFor( 'collectionsListKey' );
    }
    public $getSpyForCollectionsListKey() {
        return this.$getSpyFor( 'collectionsListKey' );
    }

    /**
     * collectionsList
     */
    public $getCollectionsList() {
        return this.$get( 'collectionsList' );
    }
    public $createGetterForCollectionsList() {
        return this.$createGetterFor( 'collectionsList' );
    }
    public $getSpyForCollectionsList() {
        return this.$getSpyFor( 'collectionsList' );
    }

    /**
     * registerCollection
     */
    public registerCollection( ...args: any[]) {
        return this.$call( 'registerCollection', ...args );
    }
    public $createSpyForRegisterCollection() {
        return this.$createSpyFor( 'registerCollection' );
    }
    public $getSpyForRegisterCollection() {
        return this.$getSpyFor( 'registerCollection' );
    }

    /**
     * createCollection
     */
    public createCollection( ...args: any[]) {
        return this.$call( 'createCollection', ...args );
    }
    public $createSpyForCreateCollection() {
        return this.$createSpyFor( 'createCollection' );
    }
    public $getSpyForCreateCollection() {
        return this.$getSpyFor( 'createCollection' );
    }
}
