// tslint:disable

import { Collection } from '../src/collection';

export class MockCollection extends Collection<any> {
    /**
     * Static Helpers
     */

    private static $spies: any = {};
    private static get $class(): any {
        return Collection;
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
        return Collection.prototype;
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
     * allDocs
     */
    public $getAllDocs() {
        return this.$get( 'allDocs' );
    }
    public $createGetterForAllDocs() {
        return this.$createGetterFor( 'allDocs' );
    }
    public $getSpyForAllDocs() {
        return this.$getSpyFor( 'allDocs' );
    }

    /**
     * storage
     */
    public $getStorage() {
        return this.$get( 'storage' );
    }
    public $createGetterForStorage() {
        return this.$createGetterFor( 'storage' );
    }
    public $getSpyForStorage() {
        return this.$getSpyFor( 'storage' );
    }

    /**
     * changes
     */
    public $getChanges() {
        return this.$get( 'changes' );
    }
    public $createGetterForChanges() {
        return this.$createGetterFor( 'changes' );
    }
    public $getSpyForChanges() {
        return this.$getSpyFor( 'changes' );
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
     * watch
     */
    public $createSpyForWatch() {
        return this.$createSpyFor( 'watch' );
    }
    public $getSpyForWatch() {
        return this.$getSpyFor( 'watch' );
    }

    /**
     * find
     */
    public $createSpyForFind() {
        return this.$createSpyFor( 'find' );
    }
    public $getSpyForFind() {
        return this.$getSpyFor( 'find' );
    }

    /**
     * findOne
     */
    public $createSpyForFindOne() {
        return this.$createSpyFor( 'findOne' );
    }
    public $getSpyForFindOne() {
        return this.$getSpyFor( 'findOne' );
    }

    /**
     * insert
     */
    public $createSpyForInsert() {
        return this.$createSpyFor( 'insert' );
    }
    public $getSpyForInsert() {
        return this.$getSpyFor( 'insert' );
    }

    /**
     * update
     */
    public $createSpyForUpdate() {
        return this.$createSpyFor( 'update' );
    }
    public $getSpyForUpdate() {
        return this.$getSpyFor( 'update' );
    }

    /**
     * remove
     */
    public $createSpyForRemove() {
        return this.$createSpyFor( 'remove' );
    }
    public $getSpyForRemove() {
        return this.$getSpyFor( 'remove' );
    }

    /**
     * filter
     */
    public filter( ...args: any[]) {
        return this.$call( 'filter', ...args );
    }
    public $createSpyForFilter() {
        return this.$createSpyFor( 'filter' );
    }
    public $getSpyForFilter() {
        return this.$getSpyFor( 'filter' );
    }

    /**
     * load
     */
    public load( ...args: any[]) {
        return this.$call( 'load', ...args );
    }
    public $createSpyForLoad() {
        return this.$createSpyFor( 'load' );
    }
    public $getSpyForLoad() {
        return this.$getSpyFor( 'load' );
    }

    /**
     * loadAll
     */
    public loadAll( ...args: any[]) {
        return this.$call( 'loadAll', ...args );
    }
    public $createSpyForLoadAll() {
        return this.$createSpyFor( 'loadAll' );
    }
    public $getSpyForLoadAll() {
        return this.$getSpyFor( 'loadAll' );
    }

    /**
     * loadWithId
     */
    public loadWithId( ...args: any[]) {
        return this.$call( 'loadWithId', ...args );
    }
    public $createSpyForLoadWithId() {
        return this.$createSpyFor( 'loadWithId' );
    }
    public $getSpyForLoadWithId() {
        return this.$getSpyFor( 'loadWithId' );
    }

    /**
     * loadWithFilter
     */
    public loadWithFilter( ...args: any[]) {
        return this.$call( 'loadWithFilter', ...args );
    }
    public $createSpyForLoadWithFilter() {
        return this.$createSpyFor( 'loadWithFilter' );
    }
    public $getSpyForLoadWithFilter() {
        return this.$getSpyFor( 'loadWithFilter' );
    }

    /**
     * createFilter
     */
    public createFilter( ...args: any[]) {
        return this.$call( 'createFilter', ...args );
    }
    public $createSpyForCreateFilter() {
        return this.$createSpyFor( 'createFilter' );
    }
    public $getSpyForCreateFilter() {
        return this.$getSpyFor( 'createFilter' );
    }

    /**
     * refresh
     */
    public refresh( ...args: any[]) {
        return this.$call( 'refresh', ...args );
    }
    public $createSpyForRefresh() {
        return this.$createSpyFor( 'refresh' );
    }
    public $getSpyForRefresh() {
        return this.$getSpyFor( 'refresh' );
    }
}
