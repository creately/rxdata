import * as uuid from 'node-uuid';

export class TodoModel {
  id;
  title;
  completed;

  setTitle(title) {
    this.title = title.trim();
  }

  constructor(title) {
    this.id = uuid.v4();
    this.completed = false;
    this.title = title.trim();
  }
}
