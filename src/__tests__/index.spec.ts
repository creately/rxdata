import { add } from '../';

describe('add', () => {
  it('should add 1 and 2', () => {
    expect(add(1, 2)).toBe(1 + 2);
  });
  it('should add 1 and 3', () => {
    expect(add(1, 3)).toBe(1 + 3);
  });
  it('should add 1 and 4', () => {
    expect(add(1, 4)).toBe(1 + 4);
  });
});
