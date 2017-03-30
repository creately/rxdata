/**
 * createCompareFn compares 2 documents made to use with RxJS
 * distinctUntilChanged helper. Works even when the documents
 * are changed in-place.
 *
 * @param serialize The serializer used to freeze the value
 */
export const createCompareFn = ( serialize = JSON.stringify ) => {
    let prev = undefined;
    return ( _prev, _next ) => {
        if ( !prev ) {
            prev = serialize( _prev );
        }
        const next = serialize( _next );
        if ( next === prev ) {
            return true;
        }
        prev = next;
        return false;
    };
};
