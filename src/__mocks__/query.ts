import { spyOn } from '../__test_utils';
import { Query } from '../query';

export class MockQuery extends Query {
    spyOnValue(): jest.Mock<any> {
        return spyOn( this, 'value' );
    }

    spyOnUpdate(): jest.Mock<any> {
        return spyOn( this, 'update' );
    }

    spyOnFilterDocuments(): jest.Mock<any> {
        return spyOn( this, '_filterDocuments' );
    }

    spyOnCreateMingoQuery(): jest.Mock<any> {
        return spyOn( this, '_createMingoQuery' );
    }

    spyOnGetTotalObservers(): jest.Mock<any> {
        return spyOn( this, '_getTotalObservers' );
    }

    spyOnUpdateValueObservers(): jest.Mock<any> {
        return spyOn( this, '_updateValueObservers' );
    }

    spyOnCreateObservableWithSet(): jest.Mock<any> {
        return spyOn( this, '_createObservableWithSet' );
    }

    spyOnCreateObserverUnsubFn(): jest.Mock<any> {
        return spyOn( this, '_createObserverUnsubFn' );
    }
}
