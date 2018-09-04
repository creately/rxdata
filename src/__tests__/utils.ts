import { take, toArray } from 'rxjs/operators';
import { Collection, DocumentChange } from '../collection';

export function findN<T>(c: Collection<T>, n: number, ...args: any[]): Promise<T[][]> {
  return c
    .find(...args)
    .pipe(
      take(n),
      toArray()
    )
    .toPromise();
}

export function find1N<T>(c: Collection<T>, n: number, ...args: any[]): Promise<T[]> {
  return c
    .findOne(...args)
    .pipe(
      take(n),
      toArray()
    )
    .toPromise();
}

export function watchN<T>(c: Collection<T>, n: number, ...args: any[]): Promise<DocumentChange<T>[]> {
  return c
    .watch(...args)
    .pipe(
      take(n),
      toArray()
    )
    .toPromise();
}
