import { Collection } from '../';

export class MockCollection extends Collection<any> {
    public $getAllDocs() {
        return ( this as any ).allDocs;
    }
    public $createGetterForAllDocs() {
        return spyOnProperty( this as any, 'allDocs', 'get' );
    }
    public $getStorage() {
        return ( this as any ).storage;
    }
    public $createGetterForStorage() {
        return spyOnProperty( this as any, 'storage', 'get' );
    }
    public $getChanges() {
        return ( this as any ).changes;
    }
    public $createGetterForChanges() {
        return spyOnProperty( this as any, 'changes', 'get' );
    }
    private $spyForWatch: jasmine.Spy;
    public $createSpyForWatch() {
        if ( !this.$spyForWatch ) {
            this.$spyForWatch = spyOn( this as any, 'watch' );
        }
        return this.$spyForWatch;
    }
    private $spyForFind: jasmine.Spy;
    public $createSpyForFind() {
        if ( !this.$spyForFind ) {
            this.$spyForFind = spyOn( this as any, 'find' );
        }
        return this.$spyForFind;
    }
    private $spyForFindOne: jasmine.Spy;
    public $createSpyForFindOne() {
        if ( !this.$spyForFindOne ) {
            this.$spyForFindOne = spyOn( this as any, 'findOne' );
        }
        return this.$spyForFindOne;
    }
    private $spyForInsert: jasmine.Spy;
    public $createSpyForInsert() {
        if ( !this.$spyForInsert ) {
            this.$spyForInsert = spyOn( this as any, 'insert' );
        }
        return this.$spyForInsert;
    }
    private $spyForUpdate: jasmine.Spy;
    public $createSpyForUpdate() {
        if ( !this.$spyForUpdate ) {
            this.$spyForUpdate = spyOn( this as any, 'update' );
        }
        return this.$spyForUpdate;
    }
    private $spyForRemove: jasmine.Spy;
    public $createSpyForRemove() {
        if ( !this.$spyForRemove ) {
            this.$spyForRemove = spyOn( this as any, 'remove' );
        }
        return this.$spyForRemove;
    }
    public filter( ...args: any[] ) {
        return super.filter.call( this, ...args );
    }
    private $spyForFilter: jasmine.Spy;
    public $createSpyForFilter() {
        if ( !this.$spyForFilter ) {
            this.$spyForFilter = spyOn( this as any, 'filter' );
        }
        return this.$spyForFilter;
    }
    public load( ...args: any[] ) {
        return super.load.call( this, ...args );
    }
    private $spyForLoad: jasmine.Spy;
    public $createSpyForLoad() {
        if ( !this.$spyForLoad ) {
            this.$spyForLoad = spyOn( this as any, 'load' );
        }
        return this.$spyForLoad;
    }
    public loadAll( ...args: any[] ) {
        return super.loadAll.call( this, ...args );
    }
    private $spyForLoadAll: jasmine.Spy;
    public $createSpyForLoadAll() {
        if ( !this.$spyForLoadAll ) {
            this.$spyForLoadAll = spyOn( this as any, 'loadAll' );
        }
        return this.$spyForLoadAll;
    }
    public loadWithId( ...args: any[] ) {
        return super.loadWithId.call( this, ...args );
    }
    private $spyForLoadWithId: jasmine.Spy;
    public $createSpyForLoadWithId() {
        if ( !this.$spyForLoadWithId ) {
            this.$spyForLoadWithId = spyOn( this as any, 'loadWithId' );
        }
        return this.$spyForLoadWithId;
    }
    public loadWithFilter( ...args: any[] ) {
        return super.loadWithFilter.call( this, ...args );
    }
    private $spyForLoadWithFilter: jasmine.Spy;
    public $createSpyForLoadWithFilter() {
        if ( !this.$spyForLoadWithFilter ) {
            this.$spyForLoadWithFilter = spyOn( this as any, 'loadWithFilter' );
        }
        return this.$spyForLoadWithFilter;
    }
    public createFilter( ...args: any[] ) {
        return super.createFilter.call( this, ...args );
    }
    private $spyForCreateFilter: jasmine.Spy;
    public $createSpyForCreateFilter() {
        if ( !this.$spyForCreateFilter ) {
            this.$spyForCreateFilter = spyOn( this as any, 'createFilter' );
        }
        return this.$spyForCreateFilter;
    }
    public refresh( ...args: any[] ) {
        return super.refresh.call( this, ...args );
    }
    private $spyForRefresh: jasmine.Spy;
    public $createSpyForRefresh() {
        if ( !this.$spyForRefresh ) {
            this.$spyForRefresh = spyOn( this as any, 'refresh' );
        }
        return this.$spyForRefresh;
    }
    public $createGetterForName() {
        return spyOnProperty( this as any, 'name', 'get' );
    }
}
