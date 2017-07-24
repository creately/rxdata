import { filterDocuments } from './filter-documents';

/**
 * cloneObject
 * cloneObject creates a copy of the object and removes class information.
 */
const cloneObject = (doc: any): any => {
  const str = JSON.stringify(doc);
  return JSON.parse(str);
};

/**
 * apply$set
 * apply$set performs the $set operation on given document
 *
 * @note this will modify the input document object
 * @todo also apply changes in nested fields
 */
const apply$set = (doc: any, $set: any) => {
  const clean$Set = cloneObject($set);
  Object.assign(doc, clean$Set);
};

/**
 * apply$push
 * apply$push performs the $push operation on given document
 *
 * @note this will modify the input document object
 * @todo also apply changes in nested fields
 */
const apply$push = (doc: any, $push: any) => {
  const clean$Push = cloneObject($push);
  Object.keys(clean$Push).forEach(key => {
    const val = clean$Push[key];
    if (!doc[key] || !Array.isArray(doc[key])) {
      doc[key] = [val];
    } else {
      doc[key] = doc[key].concat([val]);
    }
  });
};

/**
 * apply$pull
 * apply$pull performs the $pull operation on given document
 *
 * @note this will modify the input document object
 * @todo also apply changes in nested fields
 */
const apply$pull = (doc: any, $pull: any) => {
  const clean$Pull = cloneObject($pull);
  Object.keys(clean$Pull).forEach(key => {
    const val = clean$Pull[key];
    const docVal = doc[key];
    if (!docVal || !Array.isArray(docVal)) {
      return;
    }
    if (val && val.$elemMatch) {
      const filter = val.$elemMatch;
      const matches = filterDocuments(filter, docVal);
      doc[key] = docVal.filter(elem => matches.indexOf(elem) === -1);
    } else {
      doc[key] = docVal.filter(elem => elem !== val);
    }
  });
};

/**
 * updateDocument
 * updateDocument updates a document with given set of changes
 */
export const updateDocument = (_doc: any, changes: any): any => {
  const doc = cloneObject(_doc);
  if (changes.$set) {
    apply$set(doc, changes.$set);
  }
  if (changes.$push) {
    apply$push(doc, changes.$push);
  }
  if (changes.$pull) {
    apply$pull(doc, changes.$pull);
  }
  return doc;
};
