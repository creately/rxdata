describe( 'Collection', () => {
    describe( 'constructor', () => {
        it( 'should call the _init method' );
    });

    describe( 'find', () => {
        it( 'should return an Observable' );
        it( 'should create a query with the filter' );
    });

    describe( 'findOne', () => {
        it( 'should return an Observable' );
        it( 'should call the find method with given arguments' );
        it( 'should always set options.limit field to 1' );
    });

    describe( 'insert', () => {
        it( 'should return an Observable' );
        it( 'should remove if a document already exists with id' );
        it( 'should insert the document in memory' );
        it( 'should insert the document in persistor' );
        it( 'should update active queries with new documents' );
        it( 'should return inserted document' );
    });

    describe( 'update', () => {
        it( 'should return an Observable' );
        it( 'should update matching documents in memory' );
        it( 'should update matching documents in persistor' );
        it( 'should update active queries with new documents' );
        it( 'should return updated documents' );
    });

    describe( 'remove', () => {
        it( 'should return an Observable' );
        it( 'should remove matching documents in memory' );
        it( 'should remove matching documents in persistor' );
        it( 'should update active queries with new documents' );
        it( 'should return removed documents' );
    });
});
