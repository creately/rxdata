import { Database } from '../database';
import { Collection } from '../collection';
import { catchError } from 'rxjs/operators';
import { empty, Subscription } from 'rxjs';

interface IBenchmark<T> {
  prepare: () => Promise<T>;
  execute: (data: T) => Promise<any>;
}

async function bench<T>(desc: string, params: IBenchmark<T>) {
  it(desc, async done => {
    const data = await params.prepare();
    const startTime = Date.now();
    await params.execute(data);
    const benchTime = Date.now() - startTime;
    console.log(`${desc}: ${benchTime}ms`);
    done();
  });
}

describe('Benchmarks', () => {
  let database: Database;
  let subscriptions: Subscription[] = [];

  async function prepare() {
    database = new Database('test-db');
    const name = `col-${Math.random()}`;
    const col = new Collection<any>(name);
    return { name, col };
  }

  afterEach(() => {
    try {
      subscriptions.forEach(s => s.unsubscribe());
      subscriptions = [];
      database.close();
    } catch (err) {
      // ...
    }
  });

  beforeEach(() => {
    // set the timeout interval to 10 seconds
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10 * 1000;
  });

  describe('inserting documents', () => {
    [[100, 0, 0], [100, 1, 10], [100, 10, 1]].forEach(([x, y, z]) => {
      bench(`insert ${x} docs with ${y}x${z} queries`, {
        async prepare() {
          const { col } = await prepare();

          // prepare documents
          const docs = [];
          for (let i = 0; i < x; ++i) {
            docs[i] = { id: 'd' + i, a: i, b: i % 10 };
          }

          // prepare listeners
          for (let i = 0; i < y; ++i) {
            const sel = { b: i };
            for (let j = 0; j < z; ++j) {
              const sub = col
                .find(sel)
                .pipe(catchError(() => empty()))
                .subscribe();
              subscriptions.push(sub);
            }
          }

          return { col, docs };
        },
        async execute(data: any) {
          const { col, docs } = data;
          await col.insert(docs);
        },
      });
    });
  });

  describe('updating documents', () => {
    [[100, 0, 0], [100, 1, 10], [100, 10, 1]].forEach(([x, y, z]) => {
      bench(`update ${x} docs with ${y}x${z} queries`, {
        async prepare() {
          const { col } = await prepare();

          // prepare documents
          const docs = [];
          for (let i = 0; i < x; ++i) {
            docs[i] = { id: 'd' + i, a: i, b: i % 10 };
          }
          await col.insert(docs);

          // prepare listeners
          for (let i = 0; i < y; ++i) {
            const sel = { b: i };
            for (let j = 0; j < z; ++j) {
              const sub = col
                .find(sel)
                .pipe(catchError(() => empty()))
                .subscribe();
              subscriptions.push(sub);
            }
          }

          return { col };
        },
        async execute(data: any) {
          const { col } = data;
          await col.update({}, { foo: 'bar' });
        },
      });
    });
  });

  describe('removing documents', () => {
    [[100, 0, 0], [100, 1, 10], [100, 10, 1]].forEach(([x, y, z]) => {
      bench(`remove ${x} docs with ${y}x${z} queries`, {
        async prepare() {
          const { col } = await prepare();

          // prepare documents
          const docs = [];
          for (let i = 0; i < x; ++i) {
            docs[i] = { id: 'd' + i, a: i, b: i % 10 };
          }
          await col.insert(docs);

          // prepare listeners
          for (let i = 0; i < y; ++i) {
            const sel = { b: i };
            for (let j = 0; j < z; ++j) {
              const sub = col
                .find(sel)
                .pipe(catchError(() => empty()))
                .subscribe();
              subscriptions.push(sub);
            }
          }

          return { col };
        },
        async execute(data: any) {
          const { col } = data;
          await col.remove({});
        },
      });
    });
  });
});
