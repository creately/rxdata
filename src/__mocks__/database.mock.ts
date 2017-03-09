import { IDatabase, ICollection } from '../';
import { mockify } from './collection.mock';

export const createCollections = ( db: IDatabase, n: number ): ICollection[] => {
    const collections = [];
    for ( let i = 0; i < n; i++ ) {
        const collection = db.collection( `collection-${i}` );
        mockify( collection );
        collections.push( collection );
    }
    return collections;
};
