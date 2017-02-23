import { ICollection } from '../';

/**
 * MockCollection
 * ...
 */
export class MockCollection implements ICollection {
    public find: any = jest.fn();
    public findOne: any = jest.fn();
    public insert: any = jest.fn();
    public update: any = jest.fn();
    public remove: any = jest.fn();
}
