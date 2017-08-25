# RxData

RxData is a schemaless reactive document database for web browsers. It is inspired by rxdb but uses localForage instead of pouchdb to store data.

## Getting Started

Install @creately/rxdata module from npm.

```shell
npm install @creately/rxdata
```

Create a new database. Also create some collections to group similar data.

```js
import { Database } from 'rxdata'

const db = new Database('test-db')
const vehicles = db.collection('vehicles')

```

Query documents in a collection and subscribe to changes in result data.

```js
vehicles
  .find({ tires: { $gte: 4 } })
  .subscribe(data => console.log('data:', data))
```

Use collection methods to query, insert, modify or remove documents.

```js
await vehicles.insert({
  id: 'todo-1',
  title: 'write database module',
})

await vehicles.update(
  { id: 'todo-1' },
  { $set: { completed: true }},
)

await vehicles.remove(
  { id: 'todo-1' },
)
```