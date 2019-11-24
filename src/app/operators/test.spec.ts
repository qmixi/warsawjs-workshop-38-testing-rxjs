import { fakeAsync, tick } from "@angular/core/testing";
import { marbles } from "rxjs-marbles";
import { from, asyncScheduler, timer, interval, onErrorResumeNext } from "rxjs";
import { map, tap, take } from "rxjs/operators";
import createSpy = jasmine.createSpy;

fdescribe("bufferDelay tests", () => {
  it("should test with done callback map(v => v*v)", (done: DoneFn) => {
    const source$ = from([1, 2, 3, 4, 5], asyncScheduler);
    const result$ = source$.pipe(map(v => v * v));
    const spy = createSpy("mySpy");
    const expectedValues = [1, 4, 9, 16, 25];

    result$.subscribe({
      next: spy,
      complete: () => {
        expect(spy).toHaveBeenCalledTimes(5);
        expectedValues.forEach(v => {
          expect(spy).toHaveBeenCalledWith(v);
        });
        done();
      }
    });
    done();
  });

  it("should work with fakeAsync", fakeAsync(() => {
    // take - 5 pięrwszych emisji
    // GIVEN (ARRANGE)
    const source$ = interval(1000).pipe(take(5));

    // WHEN (ACT)
    const result$ = source$.pipe(map(v => v * v));
    const expectedValues = [0, 1, 4, 9, 16];

    const spy = createSpy("mySpy");
    result$.subscribe(spy);

    // THEN (ASSERT)
    expect(spy).toHaveBeenCalledTimes(0);

    for (let i = 0; i < 5; i++) {
      tick(1000);
      expect(spy).toHaveBeenCalledTimes(i + 1);
      expect(spy).toHaveBeenCalledWith(expectedValues[i]);
    }
  }));

  it(
    "should work with marbles",
    marbles(m => {
      const s = "-1-2-3-4-5|";
      const e = "-x-y-z-w-q|";

      const source$ = m.cold(s);
      const result$ = source$.pipe(map(x => x * x));
      const expected$ = m.cold(e, { x: 1, y: 4, z: 9, w: 16, q: 25 });

      m.expect(result$).toBeObservable(expected$);
    })
  );

  it(
    "should work with marbles",
    marbles(m => {
      const s1 = "-1--2--#--4--5";
      const s2 = "--3--4--5";
      const e = "-x--y--z--w--q";

      const source1$ = m.cold(s1);
      const source2$ = m.cold(s2);
      const source$ = onErrorResumeNext(source1$, source2$);
      const result$ = source$.pipe(map(x => +x * +x));
      const expected$ = m.cold(e, { x: 1, y: 4, z: 9, w: 16, q: 25 });

      m.expect(result$).toBeObservable(expected$);
    })
  );
});
