# RxData

RxData is a schemaless reactive document database for web browsers.
It is inspired by rxdb but uses localForage instead of pouchdb.

## Getting Started

Install rxjs and rxdata modules and add them to the package.json file.

```shell
npm install --save rxjs rxdata
```

Create a new database. Also create some collections to group similar data.

```js
import { Database } from 'rxdata'

const db = new Database()
const todos = db.collection('todos')
```

Use collection methods to query, insert, modify or remove documents.

```js
// query todos
const completed = todos.find({ completed: true }).value()
completed.subscribe(data => console.log('completed:', data))

// insert todo
await todos.insert({
  id: 'todo-1',
  title: 'write database module',
})

// update todo
await todos.update(
  { id: 'todo-1' },
  { $set: { completed: true }},
)

// remove todo
await todos.remove({ id: 'todo-1' })
```
