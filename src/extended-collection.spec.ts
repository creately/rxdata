describe( 'ExtendedCollection', () => {
    describe( 'find', () => {
        it( 'should return an Observable' );
        it( 'should call the find method on parent without options' );
        it( 'should call the find method on child with options' );
        it( 'should create an extended query with parent/child queries' );
    });

    describe( 'findOne', () => {
        it( 'should return an Observable' );
        it( 'should call the find method on parent without options' );
        it( 'should call the find method on child with options' );
        it( 'should always set options.limit field to 1' );
    });

    describe( 'insert', () => {
        it( 'should return an Observable' );
        it( 'should insert the parent sub document in parent collection' );
        it( 'should insert the child sub document in child collection' );
        it( 'should return merged inserted document' );
    });

    describe( 'update', () => {
        it( 'should return an Observable' );
        it( 'should update the parent sub changes in parent collection' );
        it( 'should update the child sub changes in child collection' );
        it( 'should return merged updated documents' );
    });

    describe( 'remove', () => {
        it( 'should return an Observable' );
        it( 'should remove matching documents in parent collection' );
        it( 'should remove matching documents in child collection' );
        it( 'should return merged removed documents' );
    });
});
