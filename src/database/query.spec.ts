describe('database/query', () => {
  describe('QueryMany', () => {
    describe('value', () => {
      it('should emit an array of documents which pass the filter function');
      it('should not emit data if the final result array did not change');
      it('should emit an empty array if there are no matching documents');
    });
  });

  describe('QueryOne', () => {
    describe('value', () => {
      it('should emit an array of documents which pass the filter function');
      it('should not emit data if the final result array did not change');
      it('should emit null if there are no matching documents');
    });
  });
});
