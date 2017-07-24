import { IDatabasePersistor, ICollectionPersistor } from '../../index';

const crateWithDocs = async (databasePersistor: IDatabasePersistor, name: string): Promise<ICollectionPersistor> => {
  const persistor = await databasePersistor.create(name);
  const docs = [{ id: `${name}-1`, v: 1 }, { id: `${name}-2`, v: 2 }];
  await persistor.store(docs);
  const stored = await persistor.load();
  expect(stored).toEqual(docs);
  return persistor;
};

/**
 * testDatabasePersistor tests an IDatabasePersistor class
 * @param persistorClass The IDatabasePersistor class to test
 */
export const testDatabasePersistor = persistorFactory => {
  let databasePersistor: IDatabasePersistor;

  beforeEach(async () => {
    databasePersistor = persistorFactory();
  });

  describe('create', () => {
    it('should create a new collection persistor', () => {
      const collectionPersistor = databasePersistor.create('test-col');
      expect(collectionPersistor).toBeTruthy();
    });
  });

  describe('drop', () => {
    it('should not do anything if there are no collections', async () => {
      await databasePersistor.drop();
    });

    it('should delete all created persistors', async () => {
      const collectionPersistor1 = await crateWithDocs(databasePersistor, 'test-col-1');
      const collectionPersistor2 = await crateWithDocs(databasePersistor, 'test-col-2');
      await databasePersistor.drop();
      expect(await collectionPersistor1.load()).toEqual([]);
      expect(await collectionPersistor2.load()).toEqual([]);
    });
  });
};

/**
 * testCollectionPersistor tests an ICollectionPersistor class
 * @param persistorClass The ICollectionPersistor class to test
 */
export const testCollectionPersistor = persistorFactory => {
  let persistor: ICollectionPersistor;

  beforeEach(() => {
    persistor = persistorFactory();
  });

  describe('load', () => {
    let testDocs: any[];

    beforeEach(async () => {
      testDocs = [{ id: `doc-1`, v: 1 }, { id: `doc-2`, v: 2 }, { id: `doc-3`, v: 3 }];
      await persistor.store(testDocs);
    });

    it('should load all documents from the persistor', async () => {
      const docs = await persistor.load();
      expect(docs).toEqual(testDocs);
    });
  });

  describe('store', () => {
    it('should insert all docs into the persistor', async () => {
      const docs = [{ id: `doc-1`, v: 1 }, { id: `doc-2`, v: 2 }, { id: `doc-3`, v: 3 }];
      await persistor.store(docs);
      const stored = await persistor.load();
      expect(stored).toEqual(docs);
    });
  });

  describe('remove', () => {
    let testDocs: any[];

    beforeEach(async () => {
      testDocs = [{ id: `doc-1`, v: 1 }, { id: `doc-2`, v: 2 }, { id: `doc-3`, v: 3 }];
      await persistor.store(testDocs);
    });

    it('should remove all docs in the persistor', async () => {
      await persistor.remove([{ id: `doc-1`, v: 1 }, { id: `doc-2`, v: 2 }]);
      const remaining = await persistor.load();
      expect(remaining).toEqual([{ id: `doc-3`, v: 3 }]);
    });
  });

  describe('drop', () => {
    let testDocs: any[];

    beforeEach(async () => {
      testDocs = [{ id: `doc-1`, v: 1 }, { id: `doc-2`, v: 2 }, { id: `doc-3`, v: 3 }];
      await persistor.store(testDocs);
    });

    it('should clear the persistor', async () => {
      await persistor.drop();
      const remaining = await persistor.load();
      expect(remaining).toEqual([]);
    });
  });
};
