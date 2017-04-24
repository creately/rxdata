import { updateDocument } from '../update-documents';

describe( 'updateDocument', () => {
    describe( '$set', () => {
        it( 'should add the field if it was missing', () => {
            const original = { id: 'i1', x: 10, y: 20 };
            const updated = updateDocument( original, { $set: { z: 30 } });
            expect( updated ).toEqual({ id: 'i1', x: 10, y: 20, z: 30 });
        });

        it( 'should replace the field with the new value', () => {
            const original = { id: 'i1', x: 10, y: 20, z: 35 };
            const updated = updateDocument( original, { $set: { z: 30 } });
            expect( updated ).toEqual({ id: 'i1', x: 10, y: 20, z: 30 });
        });
    });

    describe( '$push', () => {
        it( 'should create a new array if the field is not set', () => {
            const original = { id: 'i1', x: 10, y: 20 };
            const updated = updateDocument( original, { $push: { z: 30 } });
            expect( updated ).toEqual({ id: 'i1', x: 10, y: 20, z: [ 30 ] });
        });

        it( 'should push the element to the end of the field', () => {
            const original = { id: 'i1', x: 10, y: 20, z: [ 30 ] };
            const updated = updateDocument( original, { $push: { z: 35 } });
            expect( updated ).toEqual({ id: 'i1', x: 10, y: 20, z: [ 30, 35 ] });
        });
    });

    describe( '$pull', () => {
        it( 'should not change the document if the field is missing', () => {
            const original = { id: 'i1', x: 10, y: 20 };
            const updated = updateDocument( original, { $pull: { z: 30 } });
            expect( updated ).toEqual({ id: 'i1', x: 10, y: 20 });
        });

        it( 'should not change the document if the field is not an array', () => {
            const original = { id: 'i1', x: 10, y: 20, z: 35 };
            const updated = updateDocument( original, { $pull: { z: 30 } });
            expect( updated ).toEqual({ id: 'i1', x: 10, y: 20, z: 35 });
        });

        it( 'should remove matching elements when an exact value is given', () => {
            const original = { id: 'i1', x: 10, y: 20, z: [ 30, 35 ] };
            const updated = updateDocument( original, { $pull: { z: 30 } });
            expect( updated ).toEqual({ id: 'i1', x: 10, y: 20, z: [ 35 ] });
        });

        it( 'should remove matching elements when $elemMatch is used', () => {
            const original = { id: 'i1', x: 10, y: 20, z: [{ a: 30, b: 20 }, { a: 30, b: 15 }, { a: 35, b: 25 }] };
            const updated = updateDocument( original, { $pull: { z: { $elemMatch: { a: 30 } } } });
            expect( updated ).toEqual({ id: 'i1', x: 10, y: 20, z: [{ a: 35, b: 25 }] });
        });
    });
});
