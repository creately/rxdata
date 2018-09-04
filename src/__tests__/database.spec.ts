import { Database } from '../database';
import { Collection } from '../collection';
import { findN } from './utils';

describe('Database', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function prepare() {
    const db = new Database('test-db');
    return { db };
  }

  describe('create', () => {
    it('should create a new Database instance', () => {
      const out = Database.create();
      expect(out).toEqual(jasmine.any(Database));
      expect(out.name).toBe('default');
    });
  });

  describe('collection', () => {
    it('should return a Collection instance', () => {
      const { db } = prepare();
      const c1 = db.collection('test');
      expect(c1).toEqual(jasmine.any(Collection));
    });

    it('should return the same collection instance for the same name', () => {
      const { db } = prepare();
      const c1 = db.collection('test');
      const c2 = db.collection('test');
      expect(c1).toBe(c2);
    });

    it('should sync collection documents in different database instances', async done => {
      const { db: d1 } = prepare();
      const d2 = new Database(d1.name);
      const c1 = d1.collection('test');
      const c2 = d2.collection('test');
      await c1.insert({ id: 'd1' });
      const out = await findN(c2, 1);
      expect(out).toEqual([[{ id: 'd1' }]]);
      done();
    });
  });

  describe('drop', () => {
    it('should return a promise which resolves to undefined', async done => {
      const { db } = prepare();
      const out = await db.drop();
      expect(out).toBe(undefined);
      done();
    });

    it('should remove all documents in all collections in the database', async done => {
      const { db } = prepare();
      const c1 = db.collection('test');
      await c1.insert([{ id: 'd1' }]);
      expect(await findN(c1, 1)).toEqual([[{ id: 'd1' }]]);
      await db.drop();
      expect(await findN(c1, 1)).toEqual([[]]);
      done();
    });
  });
});
