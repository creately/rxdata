# 2017-02-13 - v1.2.2

 - Change TypeScript build target to ES5

# 2017-02-13 - v1.2.1

 - Change RxJS to a peerDependency to avoid duplicates
 - Add support for RxJS v5.0.0-beta.0 and above

# 2017-02-13 - v1.2.0

 - API change collection.update to use $set field

```diff
-collection.update({ type: 'a' }, { foo: 'bar' })
+collection.update({ type: 'a' }, { $set: { foo: 'bar' }})
```

 - Fix unnecessary collection init calls
 - Fix import statements (use 'import * as')
 - Add support for RxJS v5.0.0 and above

# 2017-02-09 - v1.1.1

 - Fix missing update call for active queries on data change

# 2017-02-09 - v1.1.0

 - Add missing "main" and "typings" fields to package.json.
 - Add exports for IPersistor and IPersistorFactory interfaces.

# 2017-02-09 - v1.0.2

 - Refactor core classes so it'll be easier to test.

# 2017-02-08 - v1.0.1

 - Initial Release!