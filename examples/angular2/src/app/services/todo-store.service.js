import { Inject, Injectable } from '@angular/core';
import { Database } from 'rxdata';

import { TodoModel } from '../models/todo.model';

@Injectable()
export class TodoStoreService {
  todos = null;

  constructor(@Inject(Database) db) {
    this.todos = db.collection('todos');
  }

  _getTodos(query = {}) {
    return this.todos
      .find(query)
      .value()
      .map(docs => docs.map(doc => this._toModel(doc)));
  }

  _toModel(todo) {
    let ret = new TodoModel(todo.title);
    ret.completed = todo.completed;
    ret.id = todo.id;
    return ret;
  }

  get(state) {
    const query = {};
    if(state && state.completed) {
      query.completed = state.completed;
    }
    return this._getTodos(query);
  }

  allCompleted() {
    return this._getTodos().map(todos => {
      return todos.reduce((result, todo) => {
        return result && todo.completed;
      }, true);
    });
  }

  setAllTo(completed) {
    debugger;
    return this.todos.update({}, { $set: { completed } });
  }

  removeCompleted() {
    return this.todos.remove({ completed: true });
  }

  getRemaining() {
    return this._getTodos({ completed: false }).map(docs => {
      return docs.length;
    });
  }

  getCompleted() {
    return this._getTodos({ completed: true }).map(docs => {
      return docs.length;
    });
  }

  toggleCompletion(id) {
    // TODO use this when ready
    // return this.todos.update(
    //   { id: doc.id },
    //   { $set: { completed: '!$completed' } },
    // );
    this.todos.find({ id }).value().take(1).subscribe(docs => {
      const doc = docs[0];
      return this.todos.update(
        { id: doc.id },
        { $set: { completed: !doc.completed } },
      );
    });
  }

  remove(id) {
    return this.todos.remove({ id });
  }

  add(title) {
    const todo = new TodoModel(title);
    return this.todos.insert(todo);
  }
}
