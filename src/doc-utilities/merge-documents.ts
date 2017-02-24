/**
 * mergeDocuments
 * mergeDocuments merges a given set of documents in given order.
 */
export const mergeDocuments = ( ...docs: any[]): any => {
    const merged = Object.assign({}, ...docs );
    return merged;
};


/**
 * mergeDocumentArrays
 * mergeDocumentArrays merges multiple sets of documents by their
 * id field.
 */
export const mergeDocumentArrays = ( ...sets: any[][]): any[] => {
    const groups = {};
    sets.forEach( set => {
        set.forEach( doc => {
            groups[ doc.id ] = ( groups[ doc.id ] || []).concat( doc );
        });
    });
    return Object.keys( groups )
        .filter( id => groups[id].length === sets.length )
        .map( id => mergeDocuments( ...groups[id]));
};
