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

    describe( '_filterDocuments', () => {
        it( 'should create a new Mingo query with the filter' );
        it( 'should filter documents with the query and get all matches' );
    });

    describe( '_createMingoQuery', () => {
        it( 'should create a new Mingo.Query with the filter' );
    });

    describe( '_initCollection', () => {
        it( 'should load saved data from the persistor' );
    });

    describe( '_removeDocument', () => {
        it( 'should remove a document by its id in current documents' );
    });

    describe( '_updateDocument', () => {
        it( 'should apply changes to a document object' );
        it( 'should apply changes with nested fields to a document object' );
    });

    describe( '_insertQuery', () => {
        it( 'should insert the query into active queries set' );
    });

    describe( '_removeQuery', () => {
        it( 'should remove the query from active queries set' );
    });

    describe( '_updateQueries', () => {
        it( 'should update active queries query with current documents' );
    });

    describe( '_updateQuery', () => {
        it( 'should update the query with current documents' );
    });
});
