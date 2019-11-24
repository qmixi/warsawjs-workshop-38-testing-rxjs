import {BehaviorSubject, identity, MonoTypeOperatorFunction, Observable, Operator, Subscriber, TeardownLogic, zip} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
import {notNull} from './not-null.operator';

export const bufferDelay = <T>(time: number): MonoTypeOperatorFunction<T> => (source: Observable<T>): Observable<T> => {
  return source.lift(
    new BufferDelayOperator<T>(time)
  );
};

class BufferDelayOperator<T> implements Operator<T, T> {
  constructor(private time: number) {
  }

  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    return source.subscribe(new BufferDelaySubscriber(subscriber, this.time));
  }
}

class BufferDelaySubscriber<T> extends Subscriber<T> {
  private ready = new BehaviorSubject(true);
  private isReady$ = this.ready.asObservable().pipe(filter(identity));
  private source = new BehaviorSubject(null);
  private source$ = this.source.asObservable().pipe(notNull);

  constructor(destination: Subscriber<T>, private time: number) {
    super(destination);

    zip(this.source$, this.isReady$)
      .pipe(
        map(([s]) => s),
        tap(() => {
          setTimeout(() => {
            this.ready.next(true);
          }, this.time);
        })
      )
      .subscribe(this.destination);
  }

  protected _next(value: T): void {
    this.source.next(value);
  }
}
