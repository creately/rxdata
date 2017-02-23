/**
 * DocumentMerger
 * ...
 */
export class DocumentMerger {
    /**
     * mergeDocumentArrays
     * ...
     */
    public mergeDocumentArrays( ...sets: any[][]): any[] {
        const groups = {};
        sets.forEach( set => {
            set.forEach( doc => {
                groups[ doc.id ] = ( groups[ doc.id ] || []).concat( doc );
            });
        });
        return Object.keys( groups )
            .filter( id => groups[id].length === sets.length )
            .map( id => this.mergeDocuments( ...groups[id]));
    }

    /**
     * mergeDocuments
     * ...
     */
    public mergeDocuments( ...docs: any[]): any {
        return Object.assign({}, ...docs );
    }
}
