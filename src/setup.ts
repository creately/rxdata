import { IDatabaseOptions } from './types';
import { Database } from './database';
import { DatabasePersistor } from './localforage';

export function createDatabase(options?: IDatabaseOptions) {
  return new Database(
    options || {
      persistor: new DatabasePersistor('rxdata'),
    }
  );
}
