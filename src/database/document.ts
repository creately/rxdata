import * as Mingo from 'mingo';
import * as clone from 'clone';
import { IFilterOptions, DocumentModifier, DocumentFilter, DocumentSelector } from '../types';

// createFilterFn
// createFilterFn creates a function which can be used to filter
// an array of documents. Converts mongodb like query objects to functions.
export function createFilterFn(selector: DocumentSelector): DocumentFilter {
  const mq = new Mingo.Query(selector);
  return (doc: any) => mq.test(doc);
}

// filterDocuments
// filterDocuments returns a subset of documents using given filter options.
// The filter parameter is similar to the one used in Mongo database queries.
export function filterDocuments(options: IFilterOptions, docs: any[]): any[] {
  const selector = options.selector || {};
  let cursor = Mingo.find(docs, selector);
  if (options.sort) {
    cursor = cursor.sort(options.sort);
  }
  if (options.skip) {
    cursor = cursor.skip(options.skip);
  }
  if (options.limit) {
    cursor = cursor.limit(options.limit);
  }
  return cursor.all();
}

// updateOperators
// updateOperators are js implementations of mongo update operators.
export const updateOperators: { [key: string]: (doc: any, op: any) => void } = {
  $set(doc: any, op: any) {
    Object.assign(doc, op);
  },

  $push(doc: any, op: any) {
    Object.keys(op).forEach(key => {
      const val = op[key];
      if (!doc[key] || !Array.isArray(doc[key])) {
        doc[key] = [val];
      } else {
        doc[key].push(val);
      }
    });
  },

  $pull(doc: any, op: any) {
    Object.keys(op).forEach(key => {
      const val = op[key];
      const docVal = doc[key];
      if (!docVal || !Array.isArray(docVal)) {
        return;
      }
      if (val && val.$elemMatch) {
        const selector = val.$elemMatch;
        const matches = filterDocuments({ selector }, docVal);
        doc[key] = docVal.filter(elem => matches.indexOf(elem) === -1);
      } else {
        doc[key] = docVal.filter(elem => elem !== val);
      }
    });
  },
};

// updateDocument
// updateDocument
export function updateDocument(doc: any, modifier: DocumentModifier): any {
  const docClone = clone(doc);
  Object.keys(modifier).forEach(key => {
    const fn = updateOperators[key];
    if (fn) {
      fn(docClone, modifier[key]);
    }
  });
  return docClone;
}
