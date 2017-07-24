import { Observable } from 'rxjs';
import { MockQuery } from '../../__mocks__/query.mock';
import { ExtendedQuery } from '../query';

describe('ExtendedQuery', () => {
  let parent: MockQuery;
  let child: MockQuery;
  let query: ExtendedQuery;

  beforeEach(() => {
    parent = new MockQuery();
    child = new MockQuery();
    query = new ExtendedQuery(parent, child, ['y']);
  });

  describe('value', () => {
    it('should combine result documents and return', done => {
      parent.value.mockReturnValue(Observable.of([{ id: 'i1', x: 10 }, { id: 'i2' }]));
      child.value.mockReturnValue(Observable.of([{ id: 'i2' }, { id: 'i1', x: 20 }]));
      query.value().subscribe(
        docs => {
          expect(docs).toEqual([{ id: 'i1', x: 20 }, { id: 'i2' }]);
          done();
        },
        err => done.fail(err)
      );
    });

    it('should call value function in parent query', done => {
      query.value().subscribe(
        () => {
          /* ¯\_(ツ)_/¯ */
        },
        err => done.fail(err),
        () => {
          expect(parent.value).toHaveBeenCalled();
          done();
        }
      );
    });

    it('should call value function in child query', done => {
      query.value().subscribe(
        () => {
          /* ¯\_(ツ)_/¯ */
        },
        err => done.fail(err),
        () => {
          expect(child.value).toHaveBeenCalled();
          done();
        }
      );
    });

    it('should combine result documents and return', done => {
      parent.value.mockReturnValue(
        Observable.of([{ id: 'i1', x: 10 }, { id: 'i2' }], [{ id: 'i1', x: 10 }, { id: 'i2' }])
      );
      child.value.mockReturnValue(
        Observable.of([{ id: 'i2' }, { id: 'i1', x: 20 }], [{ id: 'i2' }, { id: 'i1', x: 20 }])
      );
      const received = [];
      query.value().subscribe(
        docs => received.push(docs),
        err => done.fail(err),
        () => {
          expect(received).toEqual([[{ id: 'i1', x: 20 }, { id: 'i2' }]]);
          done();
        }
      );
    });
  });
});
