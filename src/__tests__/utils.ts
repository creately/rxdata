import { tap, take, toArray } from 'rxjs/operators';
import { Collection, DocumentChange, IDocument } from '../collection';

export function findN<T extends IDocument>(c: Collection<T>, n: number, ...args: any[]): Promise<T[][]> {
  return c
    .find(...args)
    .pipe(
      take(n),
      tap(v =>
        v.forEach((doc: any) => {
          if (doc) {
            delete doc.meta;
            delete doc.$loki;
          }
        })
      ),
      toArray()
    )
    .toPromise();
}

export function find1N<T extends IDocument>(c: Collection<T>, n: number, ...args: any[]): Promise<T[]> {
  return c
    .findOne(...args)
    .pipe(
      take(n),
      tap((doc: any) => {
        if (doc) {
          delete doc.meta;
          delete doc.$loki;
        }
      }),
      toArray()
    )
    .toPromise();
}

export function watchN<T extends IDocument>(c: Collection<T>, n: number, ...args: any[]): Promise<DocumentChange<T>[]> {
  return c
    .watch(...args)
    .pipe(
      take(n),
      tap((doc: any) => {
        if (doc) {
          delete doc.meta;
          delete doc.$loki;
        }
      }),
      toArray()
    )
    .toPromise();
}
