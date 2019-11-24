import {BehaviorSubject, MonoTypeOperatorFunction, Observable, zip} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';

export const bufferDelay = <T>(time: number): MonoTypeOperatorFunction<T> => (source: Observable<T>): Observable<T> => {
  return new Observable<T>(observer => {
    const ready = new BehaviorSubject(true);
    const isReady$ = ready.asObservable().pipe(filter(v => v));

    zip(source, isReady$)
      .pipe(
        map(([s]) => s),
        tap(() => {
          setTimeout(() => {
            ready.next(true);
          }, time);
        })
      )
      .subscribe({
        next: (x) => {
          observer.next(x);
        },
        error: (err) => {
          observer.error(err);
        },
        complete: () => {
          observer.complete();
        }
      });
  });
};

