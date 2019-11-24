import {fakeAsync, flush, tick} from '@angular/core/testing';
import {from, timer} from 'rxjs';
import {marbles} from 'rxjs-marbles/jasmine';
import {take} from 'rxjs/operators';
import {bufferDelay} from './buffer-delay.operator';

fdescribe('bufferDelay tests', () => {
  it('should test with done callback', (done: DoneFn) => {
    let currValue: number | undefined;
    const arr = [1, 2, 3, 4];
    const source$ = from(arr);
    const result$ = source$.pipe(bufferDelay(100));
    const testTimer$ = timer(5, 100).pipe(take(arr.length));

    result$.subscribe((v) => {
      currValue = v;
    });
    testTimer$.subscribe({
      next: (v) => {
        expect(currValue).toBe(arr[v]);
      },
      error: () => {
      },
      complete: () => done()
    });
  });

  it('should work with fakeAsync', fakeAsync(() => {
    let currValue: number | undefined;
    const arr = [1, 2, 3, 4];
    const source$ = from(arr);
    const result$ = source$.pipe(bufferDelay(1000));
    result$.subscribe(v => {
      currValue = v;
    });

    expect(currValue).toBe(1);
    tick(1000);
    expect(currValue).toBe(2);
    tick(1000);
    expect(currValue).toBe(3);
    tick(1000);
    expect(currValue).toBe(4);
    tick(1000);
  }));

  it('should work with marbles', marbles((m) => {
    const source$ =   m.hot('1-2-3-4|');
    const result$ = source$.pipe(bufferDelay(5));
    const expected$ = m.hot('1----2----3----(4|)');

    m.expect(result$).toBeObservable(expected$);
  }));

  xit('should work with marbles - alternative', marbles((m) => {
    const source$ = m.cold('1-2-3-4|');
    const result$ = source$.pipe(bufferDelay(5));
    const expected$ = m.cold('1----2-|');

    m.expect(result$).toBeObservable(expected$);

  }));
});
