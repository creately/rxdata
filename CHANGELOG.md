# 2017-04-24 - v3.2.0

 - Add bulk document insert support [#29](https://github.com/Cinergix/rxdata/pull/29)
 - Fix issue where document update not being detected by making updates immutable [#29](https://github.com/Cinergix/rxdata/pull/29)

```ts
collection.insert([
    { id: 'i1', name: 'n1' },
    { id: 'i2', name: 'n2' },
    { id: 'i3', name: 'n3' },
])
```

# 2017-04-20 - v3.1.0

 - Add `unsub` method to close all subscriptions in a collection [#28](https://github.com/Cinergix/rxdata/pull/28)
 - Edit database `drop` method to close all subscriptions in all  collection [#28](https://github.com/Cinergix/rxdata/pull/28)

```ts
collection.unsub().subscribe({
    complete: () => console.log('closed all query subscriptions'),
})
```

# 2017-04-07 - v3.0.2

 - Add a static `create` method on Database class [#26](https://github.com/Cinergix/rxdata/pull/26)

```ts
Database.configure( options )
const db = Database.create()
```

# 2017-03-30 - v3.0.1

 - Fix compare function used with `distinctUntilChanged` operator [#24](https://github.com/Cinergix/rxdata/pull/24)

# 2017-03-27 - v3.0.0

 - Remove `IPersistorFactory` public interface [#21](https://github.com/Cinergix/rxdata/pull/21)
 - Remove `IPersistor` public interface [#21](https://github.com/Cinergix/rxdata/pull/21)
 - Add `ICollectionPersistor` public interface [#21](https://github.com/Cinergix/rxdata/pull/21)
 - Add `IDatabasePersistor` public interface [#21](https://github.com/Cinergix/rxdata/pull/21)
 - Fix `drop` method to remove all collections [#21](https://github.com/Cinergix/rxdata/pull/21)

# 2017-03-24 - v2.1.2

 - Fix query emits to avoid duplicates [#21](https://github.com/Cinergix/rxdata/pull/21)

# 2017-03-22 - v2.1.1

 - Fix find method on ExtendedQuery [#20](https://github.com/Cinergix/rxdata/pull/20)
 - Fix $push operation to return new array [#22](https://github.com/Cinergix/rxdata/pull/22)

# 2017-02-24 - v2.1.0

 - Add drop method to database [#18](https://github.com/Cinergix/rxdata/pull/18)

# 2017-02-24 - v2.0.0

 - Add findOne method to the collection [#15](https://github.com/Cinergix/rxdata/pull/15)
 - Add ExtendedCollection and ExtendedQuery classes [#16](https://github.com/Cinergix/rxdata/pull/16)
 - Fix typescript mapping for code coverage with ts-jest and the --no-cache flag

# 2017-02-22 - v1.5.1

 - Fix ICollection find method optional options parameter

# 2017-02-22 - v1.5.0

 - Add $pull update operator for collections [#13](https://github.com/Cinergix/rxdata/pull/13)

```ts
// before: { id: 'i1', arr: [10, 20, 30] }
// after: { id: 'i1', arr: [10, 30] }
collection.update(
    { id: 'i1' },
    { $pull: { arr: 20 } },
)
```

# 2017-02-21 - v1.4.0

 - Add $push update operator for collections [#10](https://github.com/Cinergix/rxdata/pull/10)

```ts
// before: { id: 'i1', arr: [10] }
// after: { id: 'i1', arr: [10, 20] }
collection.update(
    { id: 'i1' },
    { $push: { arr: 10 } },
)
```

# 2017-02-21 - v1.3.1

 - Fix unexpected class information issue [#8](https://github.com/Cinergix/rxdata/pull/8)

# 2017-02-21 - v1.3.0

 - Add sort/limit/skip options when querying data [#4](https://github.com/Cinergix/rxdata/pull/4)

```ts
collection.find({}, {
    sort: { created: -1 },
    limit: 10,
    skip: 10,
})
```

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
