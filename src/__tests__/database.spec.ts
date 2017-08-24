import { Database } from '../database';
import { Collection } from '../collection';

describe('Database', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function prepare() {
    const db = new Database('test-db');
    return { db };
  }

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

    it('should sync collection documents in different database instances', async () => {
      const { db: d1 } = prepare();
      const d2 = new Database(d1.name);
      const c1 = d1.collection('test');
      const c2 = d2.collection('test');
      await c1.insert({ id: 'd1' });
      const out = await c2.find().take(1).toPromise();
      expect(out).toEqual([{ id: 'd1' }]);
    });
  });

  describe('drop', () => {
    it('should return a promise which resolves to undefined', async () => {
      const { db } = prepare();
      const out = await db.drop();
      expect(out).toBe(undefined);
    });

    it('should remove all documents in all collections in the database', async () => {
      const { db } = prepare();
      const c1 = db.collection('test');
      await c1.insert([{ id: 'd1' }]);
      expect(await c1.find().take(1).toPromise()).toEqual([{ id: 'd1' }]);
      await db.drop();
      expect(await c1.find().take(1).toPromise()).toEqual([]);
    });
  });
});
