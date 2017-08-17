import { Observable } from 'rxjs';
import { IQueryOne, IQueryMany, IFilterOptions } from '../types';
import { filterDocuments } from './document';

// AbstractQuery
export abstract class AbstractQuery<T> {
  protected filtered: Observable<T[]>;

  constructor(protected options: IFilterOptions, protected values: Observable<T[]>) {
    this.filtered = values.map(docs => filterDocuments(this.options, docs)).distinctUntilChanged();
  }
}

// QueryMany
export class QueryMany<T> extends AbstractQuery<T> implements IQueryMany<T> {
  public value(): Observable<T[]> {
    return this.filtered.distinctUntilChanged();
  }
}

// QueryOne
export class QueryOne<T> extends AbstractQuery<T> implements IQueryOne<T> {
  public value(): Observable<T> {
    return this.filtered.map(docs => docs[0] || null).distinctUntilChanged();
  }
}
