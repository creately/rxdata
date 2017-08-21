import * as LocalForage from 'localforage';
import { IDatabasePersistor, ICollectionPersistor } from './types';
import { DatabasePersistor, CollectionPersistor } from './localforage';

// crateWithDocs
// crateWithDocs creates a collection persistor for given database persistor
const crateWithDocs = async (databasePersistor: IDatabasePersistor, name: string): Promise<ICollectionPersistor> => {
  const persistor = await databasePersistor.create(name);
  const docs = [{ id: `${name}-1`, v: 1 }, { id: `${name}-2`, v: 2 }];
  await persistor.insert(docs);
  const stored = await persistor.find();
  expect(stored).toEqual(docs);
  return persistor;
};

describe('persistors/localforage', () => {
  beforeEach(() => {
    LocalForage.clear();
  });

  describe('DatabasePersistor', () => {
    let persistor: IDatabasePersistor;

    beforeEach(async () => {
      persistor = new DatabasePersistor('test-db');
    });

    describe('create', () => {
      it('should create a new collection persistor', () => {
        const collectionPersistor = persistor.create('test-col');
        expect(collectionPersistor).toBeTruthy();
      });
    });

    describe('drop', () => {
      it('should not do anything if there are no collections', async () => {
        await persistor.drop();
      });

      it('should delete all created persistors', async () => {
        const collectionPersistor1 = await crateWithDocs(persistor, 'test-col-1');
        const collectionPersistor2 = await crateWithDocs(persistor, 'test-col-2');
        await persistor.drop();
        expect(await collectionPersistor1.find()).toEqual([]);
        expect(await collectionPersistor2.find()).toEqual([]);
      });
    });
  });

  describe('CollectionPersistor', () => {
    let persistor: ICollectionPersistor;

    beforeEach(() => {
      persistor = new CollectionPersistor('test-col');
    });

    describe('find', () => {
      let testDocs: any[];

      beforeEach(async () => {
        testDocs = [{ id: `doc-1`, v: 1 }, { id: `doc-2`, v: 2 }, { id: `doc-3`, v: 3 }];
        await persistor.insert(testDocs);
      });

      it('should load all documents from the persistor', async () => {
        const docs = await persistor.find();
        expect(docs).toEqual(testDocs);
      });
    });

    describe('store', () => {
      it('should insert all docs into the persistor', async () => {
        const docs = [{ id: `doc-1`, v: 1 }, { id: `doc-2`, v: 2 }, { id: `doc-3`, v: 3 }];
        await persistor.insert(docs);
        const stored = await persistor.find();
        expect(stored).toEqual(docs);
      });
    });

    describe('remove', () => {
      let testDocs: any[];

      beforeEach(async () => {
        testDocs = [{ id: `doc-1`, v: 1 }, { id: `doc-2`, v: 2 }, { id: `doc-3`, v: 3 }];
        await persistor.insert(testDocs);
      });

      it('should remove all docs in the persistor', async () => {
        await persistor.remove(['doc-1', 'doc-2']);
        const remaining = await persistor.find();
        expect(remaining).toEqual([{ id: `doc-3`, v: 3 }]);
      });
    });

    describe('drop', () => {
      let testDocs: any[];

      beforeEach(async () => {
        testDocs = [{ id: `doc-1`, v: 1 }, { id: `doc-2`, v: 2 }, { id: `doc-3`, v: 3 }];
        await persistor.insert(testDocs);
      });

      it('should clear the persistor', async () => {
        await persistor.drop();
        const remaining = await persistor.find();
        expect(remaining).toEqual([]);
      });
    });
  });
});
