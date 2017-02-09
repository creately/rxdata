describe( 'Query', () => {
    describe( 'value', () => {
        it( 'should return an Observable' );
    });

    describe( 'update', () => {
        it( 'should filter documents' );
        it( 'should update all value observers with new results' );
    });

    describe( '_filterDocuments', () => {
        it( 'should create a new Mingo query with the filter' );
        it( 'should filter documents with the query and get all matches' );
    });

    describe( '_createMingoQuery', () => {
        it( 'should create a new Mingo.Query with the filter' );
    });

    describe( '_getTotalObservers', () => {
        it( 'should return the number of active observers' );
    });

    describe( '_updateValueObservers', () => {
        it( 'should call next on all value observers with new data' );
    });

    describe( '_createObservableWithSet', () => {
        it( 'should return an Observable' );

        describe( 'return value', () => {
            it( 'should add the observer to the set' );
            it( 'should call the unsubscribe function when unsubscribed' );
        });
    });

    describe( '_createObserverUnsubFn', () => {
        it( 'should return a function' );

        describe( 'return value', () => {
            it( 'should delete the observer from the set' );
            it( 'should expire the query if total observers becomes zero' );
        });
    });
});
