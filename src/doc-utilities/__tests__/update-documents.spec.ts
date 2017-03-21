import { updateDocuments, updateDocument } from '../update-documents';

describe( 'updateDocument', () => {
    describe( '$set', () => {
        it( 'should add the field if it was missing', () => {
            const doc = { id: 'i1', x: 10, y: 20 };
            updateDocument( doc, { $set: { z: 30 } });
            expect( doc ).toEqual({ id: 'i1', x: 10, y: 20, z: 30 });
        });

        it( 'should replace the field with the new value', () => {
            const doc = { id: 'i1', x: 10, y: 20, z: 35 };
            updateDocument( doc, { $set: { z: 30 } });
            expect( doc ).toEqual({ id: 'i1', x: 10, y: 20, z: 30 });
        });
    });

    describe( '$push', () => {
        it( 'should create a new array if the field is not set', () => {
            const doc = { id: 'i1', x: 10, y: 20 };
            updateDocument( doc, { $push: { z: 30 } });
            expect( doc ).toEqual({ id: 'i1', x: 10, y: 20, z: [ 30 ] });
        });

        it( 'should push the element to the end of the field', () => {
            const doc = { id: 'i1', x: 10, y: 20, z: [ 30 ] };
            updateDocument( doc, { $push: { z: 35 } });
            expect( doc ).toEqual({ id: 'i1', x: 10, y: 20, z: [ 30, 35 ] });
        });
    });

    describe( '$pull', () => {
        it( 'should not change the document if the field is missing', () => {
            const doc = { id: 'i1', x: 10, y: 20 };
            updateDocument( doc, { $pull: { z: 30 } });
            expect( doc ).toEqual({ id: 'i1', x: 10, y: 20 });
        });

        it( 'should not change the document if the field is not an array', () => {
            const doc = { id: 'i1', x: 10, y: 20, z: 35 };
            updateDocument( doc, { $pull: { z: 30 } });
            expect( doc ).toEqual({ id: 'i1', x: 10, y: 20, z: 35 });
        });

        it( 'should remove matching elements when an exact value is given', () => {
            const doc = { id: 'i1', x: 10, y: 20, z: [ 30, 35 ] };
            updateDocument( doc, { $pull: { z: 30 } });
            expect( doc ).toEqual({ id: 'i1', x: 10, y: 20, z: [ 35 ] });
        });

        it( 'should remove matching elements when $elemMatch is used', () => {
            const doc = { id: 'i1', x: 10, y: 20, z: [{ a: 30, b: 20 }, { a: 30, b: 15 }, { a: 35, b: 25 }] };
            updateDocument( doc, { $pull: { z: { $elemMatch: { a: 30 } } } });
            expect( doc ).toEqual({ id: 'i1', x: 10, y: 20, z: [{ a: 35, b: 25 }] });
        });
    });
});

describe( 'updateDocuments', () => {
    let docs: any[];
    let changes: any;

    beforeEach(() => {
        docs = [
            { id: 'i1', x: 10, y: 20 },
            { id: 'i2', x: 10, y: 25 },
            { id: 'i3', x: 15, y: 20 },
        ];
        changes = { $set: { z: 30 } };
    });

    it( 'should update multiple documents', () => {
        updateDocuments( docs, changes );
        expect( docs ).toEqual([
            { id: 'i1', x: 10, y: 20, z: 30 },
            { id: 'i2', x: 10, y: 25, z: 30 },
            { id: 'i3', x: 15, y: 20, z: 30 },
        ]);
    });
});
