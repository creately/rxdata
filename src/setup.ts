import { Database, DatabaseOptions } from './database/database';
import { DatabasePersistor } from './persistors/localforage';

export function create(options?: DatabaseOptions) {
  return new Database(
    options || {
      persistor: new DatabasePersistor('rxdata'),
    }
  );
}
