import { Collection } from '../collection';
import { Observable } from 'rxjs';

describe('Collection', () => {
  async function prepare() {
    const name = `col-${Math.random()}`;
    const col = new Collection<any>(name);
    return { name, col };
  }

  const TEST_DOCS = [
    { id: 'd111', x: 1, y: 1, z: 1 },
    { id: 'd112', x: 1, y: 1, z: 2 },
    { id: 'd113', x: 1, y: 1, z: 3 },
    { id: 'd121', x: 1, y: 2, z: 1 },
    { id: 'd122', x: 1, y: 2, z: 2 },
    { id: 'd123', x: 1, y: 2, z: 3 },
  ];

  describe('watch', () => {
    it('should return an observable', async () => {
      const { col } = await prepare();
      expect(col.watch()).toEqual(jasmine.any(Observable));
    });

    it('should not emit any documents immediately', async () => {
      const { col } = await prepare();
      const watchPromise = col
        .watch()
        .take(1)
        .toPromise();
      const sleepPromise = new Promise(f => setTimeout(() => f('awake'), 100));
      const out = await Promise.race([watchPromise, sleepPromise]);
      expect(out).toBe('awake');
    });

    it('should not emit any documents immediately (with selector)', async () => {
      const { col } = await prepare();
      const watchPromise = col
        .watch({ z: 3 })
        .take(1)
        .toPromise();
      const sleepPromise = new Promise(f => setTimeout(() => f('awake'), 100));
      const out = await Promise.race([watchPromise, sleepPromise]);
      expect(out).toBe('awake');
    });

    describe('on change', () => {
      it('should emit modified documents if a selector is not given', async () => {
        const { col } = await prepare();
        const promise = col
          .watch()
          .take(1)
          .toPromise();
        await col.insert(TEST_DOCS);
        const out = await promise;
        expect(out).toEqual({ type: 'insert', docs: TEST_DOCS });
      });

      it('should emit modified documents if they match the selector', async () => {
        const { col } = await prepare();
        const promise = col
          .watch({ z: 3 })
          .take(1)
          .toPromise();
        await col.insert(TEST_DOCS);
        const out = await promise;
        expect(out).toEqual({ type: 'insert', docs: TEST_DOCS.filter(doc => doc.z === 3) });
      });

      it('should not emit modified documents if they do not match the selector', async () => {
        const { col } = await prepare();
        const watchPromise = col
          .watch({ z: 5 })
          .take(1)
          .toPromise();
        const sleepPromise = new Promise(f => setTimeout(() => f('awake'), 100));
        await col.insert(TEST_DOCS);
        const out = await Promise.race([watchPromise, sleepPromise]);
        expect(out).toBe('awake');
      });
    });
  });

  describe('find', () => {
    it('should return an observable', async () => {
      const { col } = await prepare();
      expect(col.find()).toEqual(jasmine.any(Observable));
    });

    it('should emit all documents if a selector is not given', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const out = await col
        .find()
        .take(1)
        .toPromise();
      expect(out).toEqual(TEST_DOCS);
    });

    it('should emit an empty array if no documents match selector', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const out = await col
        .find({ x: -1 })
        .take(1)
        .toPromise();
      expect(out).toEqual([]);
    });

    it('should emit an empty array if no documents match selector (with id)', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const out = await col
        .find({ id: 'd000' })
        .take(1)
        .toPromise();
      expect(out).toEqual([]);
    });

    it('should emit all matching document immediately', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const out = await col
        .find({ z: 3 })
        .take(1)
        .toPromise();
      expect(out).toEqual(TEST_DOCS.filter(doc => doc.z === 3));
    });

    it('should emit all matching document immediately (with id)', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const out = await col
        .find({ id: 'd111' })
        .take(1)
        .toPromise();
      expect(out).toEqual(TEST_DOCS.filter(doc => doc.id === 'd111'));
    });

    it('should sort matching documents if sort option is set', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const out = await col
        .find({ y: 2 }, { sort: { z: -1 } })
        .take(1)
        .toPromise();
      expect(out).toEqual(TEST_DOCS.filter(doc => doc.y === 2).reverse());
    });

    it('should skip given number of matching documents if skip option is set', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const out = await col
        .find({ y: 2 }, { sort: { z: -1 }, skip: 1 })
        .take(1)
        .toPromise();
      expect(out).toEqual(
        TEST_DOCS.filter(doc => doc.y === 2)
          .reverse()
          .slice(1)
      );
    });

    it('should limit result to given number of matching documents if limit option is set', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const out = await col
        .find({ y: 2 }, { limit: 2 })
        .take(1)
        .toPromise();
      expect(out).toEqual(TEST_DOCS.filter(doc => doc.y === 2).slice(0, 2));
    });

    it('should not re-emit the same result if documents in the result did not change', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const promise = col
        .find({ z: 3 })
        .take(2)
        .toArray()
        .toPromise();
      await col.update({ z: 2 }, { $set: { a: 1 } });
      await col.update({ z: 3 }, { $set: { a: 2 } });
      const out = await promise;
      expect(out).toEqual([
        [{ id: 'd113', x: 1, y: 1, z: 3 }, { id: 'd123', x: 1, y: 2, z: 3 }],
        [{ id: 'd113', x: 1, y: 1, z: 3, a: 2 }, { id: 'd123', x: 1, y: 2, z: 3, a: 2 }],
      ]);
    });

    it('should not call the load method until user subscribes to the observable', async () => {
      const { col } = await prepare();
      spyOn(col as any, 'load').and.returnValue(Promise.resolve([]));
      const observable = col.find({});
      expect((col as any).load).not.toHaveBeenCalled();
      await observable.take(1).toPromise();
      expect((col as any).load).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an observable', async () => {
      const { col } = await prepare();
      expect(col.findOne()).toEqual(jasmine.any(Observable));
    });

    it('should emit a document if a selector is not given', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const out = await col
        .findOne()
        .take(1)
        .toPromise();
      expect(TEST_DOCS.findIndex(doc => doc.id === out.id)).not.toBe(-1);
    });

    it('should emit null if no documents match the selector', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const out = await col
        .findOne({ x: -1 })
        .take(1)
        .toPromise();
      expect(out).toBe(null);
    });

    it('should a matching document immediately', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const out = await col
        .findOne({ z: 3 })
        .take(1)
        .toPromise();
      const matches = TEST_DOCS.filter(doc => doc.z === 3);
      expect(matches.findIndex(doc => doc.id === out.id)).not.toBe(-1);
    });

    it('should sort and get the matching document if sort option is set', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const out = await col
        .findOne({ y: 2 }, { sort: { z: -1 } })
        .take(1)
        .toPromise();
      expect(out).toEqual(TEST_DOCS.filter(doc => doc.y === 2).reverse()[0]);
    });

    it('should skip given number of matching documents if skip option is set', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const out = await col
        .findOne({ y: 2 }, { sort: { z: -1 }, skip: 1 })
        .take(1)
        .toPromise();
      expect(out).toEqual(TEST_DOCS.filter(doc => doc.y === 2).reverse()[1]);
    });

    it('should not re-emit the same result if documents in the result did not change', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const promise = col
        .findOne({ z: 3 })
        .take(2)
        .toArray()
        .toPromise();
      await col.update({ z: 2 }, { $set: { a: 1 } });
      await col.update({ z: 3 }, { $set: { a: 2 } });
      const out = await promise;
      expect(out).toEqual([{ id: 'd113', x: 1, y: 1, z: 3 }, { id: 'd113', x: 1, y: 1, z: 3, a: 2 }]);
    });

    it('should not call the load method until user subscribes to the observable', async () => {
      const { col } = await prepare();
      spyOn(col as any, 'load').and.returnValue(Promise.resolve([]));
      const observable = col.findOne({});
      expect((col as any).load).not.toHaveBeenCalled();
      await observable.take(1).toPromise();
      expect((col as any).load).toHaveBeenCalled();
    });
  });

  describe('insert', () => {
    it('should return a promise which resolves to undefined', async () => {
      const { col } = await prepare();
      const out = await col.insert({ id: 'd1' });
      expect(out).toBe(undefined);
    });

    it('should return inserted documents with new queries', async () => {
      const { col } = await prepare();
      await Promise.all(TEST_DOCS.map(doc => col.insert(doc)));
      const out = await col
        .find({})
        .take(1)
        .toPromise();
      expect(out).toEqual(TEST_DOCS);
    });

    it('should return inserted documents with new queries (insert array)', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const out = await col
        .find({})
        .take(1)
        .toPromise();
      expect(out).toEqual(TEST_DOCS);
    });

    it('should emit the inserted document as a change (local)', async () => {
      const { col } = await prepare();
      const promise = col
        .watch()
        .take(1)
        .toPromise();
      await col.insert(TEST_DOCS);
      const out = await promise;
      expect(out).toEqual({ type: 'insert', docs: TEST_DOCS });
    });

    it('should emit the inserted document as a change (remote)');
  });

  describe('update', () => {
    it('should return a promise which resolves to undefined', async () => {
      const { col } = await prepare();
      const out = await col.update({}, { $set: { a: 1 } });
      expect(out).toBe(undefined);
    });

    it('should return updated document with new queries', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      await col.update({ z: 3 }, { $set: { a: 1 } });
      const out = await col
        .find({})
        .take(1)
        .toPromise();
      expect(out).toEqual([
        { id: 'd111', x: 1, y: 1, z: 1 },
        { id: 'd112', x: 1, y: 1, z: 2 },
        { id: 'd113', x: 1, y: 1, z: 3, a: 1 },
        { id: 'd121', x: 1, y: 2, z: 1 },
        { id: 'd122', x: 1, y: 2, z: 2 },
        { id: 'd123', x: 1, y: 2, z: 3, a: 1 },
      ]);
    });

    it('should return updated document with new queries (nested)', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      await col.update({ z: 3 }, { $set: { 'a.b': 1 } });
      const out = await col
        .find({})
        .take(1)
        .toPromise();
      expect(out).toEqual([
        { id: 'd111', x: 1, y: 1, z: 1 },
        { id: 'd112', x: 1, y: 1, z: 2 },
        { id: 'd113', x: 1, y: 1, z: 3, a: { b: 1 } },
        { id: 'd121', x: 1, y: 2, z: 1 },
        { id: 'd122', x: 1, y: 2, z: 2 },
        { id: 'd123', x: 1, y: 2, z: 3, a: { b: 1 } },
      ]);
    });

    it('should emit the updated document as a change (local)', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const promise = col
        .watch()
        .take(1)
        .toPromise();
      await col.update({ z: 3 }, { $set: { a: 1 } });
      const out = await promise;
      expect(out).toEqual({
        type: 'update',
        docs: [{ id: 'd113', x: 1, y: 1, z: 3, a: 1 }, { id: 'd123', x: 1, y: 2, z: 3, a: 1 }],
      });
    });

    it('should emit the updated document as a change (remote)');
  });

  describe('remove', () => {
    it('should return a promise which resolves to undefined', async () => {
      const { col } = await prepare();
      const out = await col.remove({});
      expect(out).toBe(undefined);
    });

    it('should not return removed documents with new queries', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      await col.remove({ z: 3 });
      const out = await col
        .find({})
        .take(1)
        .toPromise();
      expect(out).toEqual([
        { id: 'd111', x: 1, y: 1, z: 1 },
        { id: 'd112', x: 1, y: 1, z: 2 },
        { id: 'd121', x: 1, y: 2, z: 1 },
        { id: 'd122', x: 1, y: 2, z: 2 },
      ]);
    });

    it('should emit the removed document as a change (local)', async () => {
      const { col } = await prepare();
      await col.insert(TEST_DOCS);
      const promise = col
        .watch()
        .take(1)
        .toPromise();
      await col.remove({ z: 3 });
      const out = await promise;
      expect(out).toEqual({
        type: 'remove',
        docs: [{ id: 'd113', x: 1, y: 1, z: 3 }, { id: 'd123', x: 1, y: 2, z: 3 }],
      });
    });

    it('should emit the removed document as a change (remote)');
  });
});
