import { spyOn } from '../__test_utils';
import { Collection } from '../collection';

export class MockCollection extends Collection {
    spyOnFind(): jest.Mock<any> {
        return spyOn( this, 'find' );
    }

    spyOnInsert(): jest.Mock<any> {
        return spyOn( this, 'insert' );
    }

    spyOnUpdate(): jest.Mock<any> {
        return spyOn( this, 'update' );
    }

    spyOnRemove(): jest.Mock<any> {
        return spyOn( this, 'remove' );
    }

    spyOnQueries(): jest.Mock<any> {
        return spyOn( this, '_queries' );
    }

    spyOnFilterDocuments(): jest.Mock<any> {
        return spyOn( this, '_filterDocuments' );
    }

    spyOnCreateMingoQuery(): jest.Mock<any> {
        return spyOn( this, '_createMingoQuery' );
    }

    spyOnInitCollection(): jest.Mock<any> {
        return spyOn( this, '_initCollection' );
    }

    spyOnRemoveDocument(): jest.Mock<any> {
        return spyOn( this, '_removeDocument' );
    }

    spyOnUpdateDocument(): jest.Mock<any> {
        return spyOn( this, '_updateDocument' );
    }

    spyOnInsertQuery(): jest.Mock<any> {
        return spyOn( this, '_insertQuery' );
    }

    spyOnRemoveQuery(): jest.Mock<any> {
        return spyOn( this, '_removeQuery' );
    }

    spyOnUpdateQuery(): jest.Mock<any> {
        return spyOn( this, '_updateQuery' );
    }
}
