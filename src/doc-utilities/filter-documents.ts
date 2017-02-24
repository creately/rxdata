import * as Mingo from 'mingo';

/**
 * FilterOptions
 * FilterOptions can be used to customized how documents are filtered.
 * All fields are optional and they are always used in this order:
 *  1. sort
 *  2. skip
 *  3. limit
 */
export type FilterOptions = {
    sort?: any,
    limit?: number,
    skip?: number,
};

/**
 * filterDocuments
 * filterDocuments returns a subset of documents using given filter options.
 * The filter parameter is similar to the one used in Mongo database queries.
 */
export const filterDocuments = ( filter: any, docs: any[], options: FilterOptions = {}): any[] => {
    let cursor = Mingo.find( docs, filter );
    if ( options.sort ) {
        cursor = cursor.sort( options.sort );
    }
    if ( options.skip ) {
        cursor = cursor.skip( options.skip );
    }
    if ( options.limit ) {
        cursor = cursor.limit( options.limit );
    }
    return cursor.all();
};
