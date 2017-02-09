describe( 'Database', () => {
    describe( 'collection', () => {
        it( 'should return collection if one exists with given name' );
        it( 'should create a new collection if one does not exist with given name' );
        it( 'should always return the same collection instance for a given name' );
    });

    describe( '_createNewCollection', () => {
        it( 'should create a new persistor with given name' );
        it( 'should create and return a Collection instance' );
    });

    describe( '_createNewPersistor', () => {
        it( 'should create and return an IPersistor instance' );
    });
});
