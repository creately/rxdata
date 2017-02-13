import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TodoStoreService } from '../../services/todo-store.service';
import template from './todo-list.template.html';

@Component({
  selector: 'todo-list',
  template: template
})
export class TodoListComponent {
  constructor(todoStore: TodoStoreService, route: ActivatedRoute) {
    this._todoStore = todoStore;
    this._route = route;
    this._currentStatus = '';
  }

  ngOnInit() {
    this._route.params
      .map(params => params.status)
      .subscribe((status) => {
        this._currentStatus = status;
      });
  }

  remove(id) {
    this._todoStore.remove(id);
  }

  update(id) {
    this._todoStore.toggleCompletion(id);
  }

  getTodos() {
    if (this._currentStatus == 'completed') {
      return this._todoStore.getCompleted();
    }
    else if (this._currentStatus == 'active') {
      return this._todoStore.getRemaining();
    }
    return this._todoStore.get();
  }

  allCompleted() {
    return this._todoStore.allCompleted();
  }

  setAllTo(toggleAll) {
    this._todoStore.setAllTo(toggleAll.checked);
  }
}
