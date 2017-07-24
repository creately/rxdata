import { createCompareFn } from '../compare-documents';

describe('createCompareFn', () => {
  it('should return a function', () => {
    expect(typeof createCompareFn()).toBe('function');
  });

  describe('compareDocs: default', () => {
    let compareDocs: Function;
    let initialDoc: any;

    beforeEach(() => {
      initialDoc = { x: 100 };
      compareDocs = createCompareFn();
      compareDocs({}, initialDoc);
    });

    const cases: any[] = [
      {
        desc: 'the same object without any changes',
        value: () => initialDoc,
        expected: true,
      },
      {
        desc: 'a different object with same fields',
        value: () => ({ x: 100 }),
        expected: true,
      },
      {
        desc: 'a different object with different fields',
        value: () => ({ x: 20 }),
        expected: false,
      },
      {
        desc: 'the same object with modified fields',
        value: () => initialDoc,
        before: () => (initialDoc.y = 200),
        expected: false,
      },
    ];

    cases.forEach(({ value, desc, before, expected }) => {
      it(`should return ${expected} when a given ${desc}`, () => {
        if (before) {
          before();
        }
        expect(compareDocs(initialDoc, value())).toBe(expected);
      });
    });
  });

  describe('compareDocs: custom', () => {
    let compareDocs: Function;
    let initialDoc: any;

    beforeEach(() => {
      initialDoc = { x: 10, y: 100 };
      compareDocs = createCompareFn(doc => doc.x);
      compareDocs({ x: 0, y: 0 }, initialDoc);
    });

    const cases: any[] = [
      {
        desc: 'the same object without any changes',
        value: () => initialDoc,
        expected: true,
      },
      {
        desc: 'a different object with same compared field',
        value: () => ({ x: 10, y: 100 }),
        expected: true,
      },
      {
        desc: 'a different object with different not-compared field',
        value: () => ({ x: 10, y: 200 }),
        expected: true,
      },
      {
        desc: 'a different object with different compared field',
        value: () => ({ x: 20, y: 100 }),
        expected: false,
      },
      {
        desc: 'the same object with modified not-compared fields',
        value: () => initialDoc,
        before: () => (initialDoc.y = 200),
        expected: true,
      },
      {
        desc: 'the same object with modified compared fields',
        value: () => initialDoc,
        before: () => (initialDoc.x = 20),
        expected: false,
      },
    ];

    cases.forEach(({ value, desc, before, expected }) => {
      it(`should return ${expected} when a given ${desc}`, () => {
        if (before) {
          before();
        }
        expect(compareDocs(initialDoc, value())).toBe(expected);
      });
    });
  });
});
