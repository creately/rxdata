import { Observable } from 'rxjs';
import * as LocalForage from 'localforage';
import { Collection } from './collection';
import { QueryMany, QueryOne } from './query';
import { CollectionPersistor } from '../persistors/localforage';

describe('Collection', () => {
  async function createCollection(docs: any[] = []) {
    const persistor = new CollectionPersistor('test-col');
    const collection = new Collection('test-col', persistor);
    await collection.remove({}).toPromise();
    await collection.insert(docs).toPromise();
    return { persistor, collection };
  }

  beforeEach(() => {
    LocalForage.clear();
  });

  describe('find', () => {
    it('should return a QueryMany instance', async () => {
      const { collection } = await createCollection();
      expect(collection.find({ foo: 'bar' }) instanceof QueryMany).toBeTruthy();
    });

    it('should work with find options', async () => {
      const { collection } = await createCollection([{ id: 'i1', x: 10 }, { id: 'i2', x: 20 }, { id: 'i3', x: 30 }]);
      const docs = await collection.find({}, { sort: { x: 1 }, skip: 1, limit: 1 }).value().take(1).toPromise();
      expect(docs).toEqual([{ id: 'i2', x: 20 }]);
    });
  });

  describe('findOne', () => {
    it('should return a QueryOne instance', async () => {
      const { collection } = await createCollection();
      expect(collection.findOne({ foo: 'bar' }) instanceof QueryOne).toBeTruthy();
    });

    it('should work with find options', async () => {
      const { collection } = await createCollection([{ id: 'i1', x: 10 }, { id: 'i2', x: 20 }, { id: 'i3', x: 30 }]);
      const doc = await collection.findOne({}, { sort: { x: 1 }, skip: 1 }).value().take(1).toPromise();
      expect(doc).toEqual({ id: 'i2', x: 20 });
    });
  });

  describe('insert', () => {
    it('should return an Observable', async () => {
      const { collection } = await createCollection();
      expect(collection.insert({ id: 'i1' }) instanceof Observable).toBeTruthy();
    });

    it('should insert a new document in collection', async () => {
      const { collection } = await createCollection();
      await collection.insert({ id: 'i4', x: 40 }).toPromise();
      const doc = await collection.findOne({ id: 'i4' }).value().take(1).toPromise();
      expect(doc).toEqual({ id: 'i4', x: 40 });
    });

    it('should insert new documents in collection', async () => {
      const { collection } = await createCollection();
      await collection.insert([{ id: 'i4', x: 40 }, { id: 'i5', x: 50 }]).toPromise();
      const doc4 = await collection.findOne({ id: 'i4' }).value().take(1).toPromise();
      const doc5 = await collection.findOne({ id: 'i5' }).value().take(1).toPromise();
      expect(doc4).toEqual({ id: 'i4', x: 40 });
      expect(doc5).toEqual({ id: 'i5', x: 50 });
    });

    it('should not store getters in the document object', async () => {
      class TestDoc {
        public id = 'i4';
        private x = 40;
        get y() {
          return this.x * 2;
        }
      }
      const { collection } = await createCollection();
      await collection.insert(new TestDoc()).toPromise();
      const doc = await collection.findOne({ id: 'i4' }).value().take(1).toPromise();
      expect(doc).toEqual({ id: 'i4', x: 40 });
    });

    it('should replace if a document already exists with id', async () => {
      const { collection } = await createCollection();
      await collection.insert({ id: 'i4', x: 40 }).toPromise();
      await collection.insert({ id: 'i4', y: 40 }).toPromise();
      const doc = await collection.findOne({ id: 'i4' }).value().take(1).toPromise();
      expect(doc).toEqual({ id: 'i4', y: 40 });
    });
  });

  describe('update', () => {
    it('should return an Observable', async () => {
      const { collection } = await createCollection();
      expect(collection.update({}, {}) instanceof Observable).toBeTruthy();
    });

    it('should update matching documents in collection', async () => {
      const { collection } = await createCollection([{ id: 'i1', x: 10 }, { id: 'i2', x: 20 }, { id: 'i3', x: 30 }]);
      await collection.update({ x: { $gt: 10 } }, { $set: { x: -1 } }).toPromise();
      const docs = await collection.find({}).value().take(1).toPromise();
      expect(docs).toEqual([{ id: 'i1', x: 10 }, { id: 'i2', x: -1 }, { id: 'i3', x: -1 }]);
    });
  });

  describe('remove', () => {
    it('should return an Observable', async () => {
      const { collection } = await createCollection([{ id: 'i1', x: 10 }, { id: 'i2', x: 20 }, { id: 'i3', x: 30 }]);
      expect(collection.remove({}) instanceof Observable).toBeTruthy();
    });

    it('should remove matching documents in collection', async () => {
      const { collection } = await createCollection([{ id: 'i1', x: 10 }, { id: 'i2', x: 20 }, { id: 'i3', x: 30 }]);
      await collection.remove({ x: { $lt: 30 } }).toPromise();
      const docs = await collection.find({}).value().take(1).toPromise();
      expect(docs).toEqual([{ id: 'i3', x: 30 }]);
    });
  });

  describe('unsub', () => {
    it('should close all active queries', async done => {
      const { collection } = await createCollection();
      collection.find({}).value().subscribe({
        complete: () => done(),
      });
      collection.unsub();
    });
  });
});
