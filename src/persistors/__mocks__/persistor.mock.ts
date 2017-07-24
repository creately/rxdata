import { IDatabasePersistor, ICollectionPersistor } from '../../index';

/**
 * MockDatabasePersistor
 * ...
 */
export class MockDatabasePersistor implements IDatabasePersistor {
  public create: any = jest.fn(() => new MockCollectionPersistor());
  public drop: any = jest.fn(() => Promise.resolve(null));
}

/**
 * MockCollectionPersistor
 * ...
 */
export class MockCollectionPersistor implements ICollectionPersistor {
  public load: any = jest.fn(() => Promise.resolve([]));
  public store: any = jest.fn(() => Promise.resolve(null));
  public remove: any = jest.fn(() => Promise.resolve(null));
  public drop: any = jest.fn(() => Promise.resolve(null));
}
