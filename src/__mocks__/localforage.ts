export default class LocalForage {
    public static createInstance( name: string ): LocalForage {
        return new LocalForage( name );
    }

    constructor( public name: string ) {
        // ...
    }
}
