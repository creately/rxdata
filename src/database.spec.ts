import { Observable } from 'rxjs';
import { Database } from './database';
import { Collection } from './collection';
import { DatabasePersistor } from './localforage';

describe('Database', () => {
  describe('constructor', () => {
    it('should create a new instance with given options', () => {
      const persistor = new DatabasePersistor('test-db');
      const database = new Database({ persistor });
      expect((database as any).options.persistor).toBe(persistor);
    });
  });

  describe('collection', () => {
    let persistor: DatabasePersistor;
    let database: Database;

    beforeEach(() => {
      persistor = new DatabasePersistor('test-db');
      database = new Database({ persistor: persistor });
    });

    it('should create a new collection if one does not exist with given name', () => {
      const collection = database.collection('col');
      expect(collection instanceof Collection).toBeTruthy();
    });

    it('should return collection if one exists with given collection name', () => {
      const collection = database.collection('col');
      expect(database.collection('col')).toBe(collection);
    });

    it('should always return the same collection instance for a given name', () => {
      const collection = database.collection('col');
      for (let i = 0; i < 5; i++) {
        expect(database.collection('col')).toBe(collection);
      }
    });

    it('should create a new persister with the collection name', () => {
      persistor.create = jest.fn(persistor.create.bind(persistor));
      database.collection('col');
      expect(persistor.create).toHaveBeenCalledWith('col');
    });
  });

  describe('drop', () => {
    let persistor: DatabasePersistor;
    let database: Database;

    beforeEach(() => {
      persistor = new DatabasePersistor('test-db');
      database = new Database({ persistor });
    });

    it('should call drop method on database persistor', done => {
      persistor.drop = jest.fn(persistor.drop.bind(persistor));
      database.drop().subscribe({
        error: err => done.fail(err),
        complete: () => {
          expect(persistor.drop).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should call unsub method on all collections', done => {
      const collections = [database.collection('col-1'), database.collection('col-2')];
      collections.forEach(col => {
        col.unsub = jest.fn().mockReturnValue(Observable.of());
      });
      database.drop().subscribe({
        error: err => done.fail(err),
        complete: () => {
          collections.forEach(col => {
            expect(col.unsub).toHaveBeenCalled();
          });
          done();
        },
      });
    });
  });
});
