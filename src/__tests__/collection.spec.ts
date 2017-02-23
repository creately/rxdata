describe( 'Collection', () => {
    describe( 'find', () => {
        it( 'should return an Observable' );
        it( 'should create a query with the filter' );
        it( 'should insert the query into active queries set' );
        it( 'should update the query with current documents' );
        it( 'should remove the query from active queries set on unsub' );
    });

    describe( 'insert', () => {
        it( 'should return an Observable' );
        it( 'should initialize the collection' );
        it( 'should remove if a document already exists with id' );
        it( 'should insert the document in memory' );
        it( 'should insert the document in persistor' );
        it( 'should update active queries with new documents' );
        it( 'should return inserted document' );
    });

    describe( 'update', () => {
        it( 'should return an Observable' );
        it( 'should initialize the collection' );
        it( 'should update matching documents in memory' );
        it( 'should update matching documents in persistor' );
        it( 'should update active queries with new documents' );
        it( 'should return updated documents' );
    });

    describe( 'remove', () => {
        it( 'should return an Observable' );
        it( 'should initialize the collection' );
        it( 'should remove matching documents in memory' );
        it( 'should remove matching documents in persistor' );
        it( 'should update active queries with new documents' );
        it( 'should return removed documents' );
    });
});
