import {fakeAsync, tick} from '@angular/core/testing';
import {asyncScheduler, from} from 'rxjs';
import {Context, marbles} from 'rxjs-marbles';
import {delay} from 'rxjs/operators';
import {notNull} from './not-null.operator';
import createSpy = jasmine.createSpy;

const multiply = (a, b) => a * b;

describe('multiply function', () => {
  it('should calculate properly', () => {
    const input = {a: 3, b: 4};
    const expected = 12;

    const result = multiply(input.a, input.b);

    expect(result).toEqual(expected);
  });
});


describe('notNull operator', () => {
  it('should filter null values', () => {
    const source = from([1, null, 2]);
    const result = source.pipe(notNull);
    const spy = createSpy();

    result.subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(1);
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('should filter null values - async', () => {
    const source = from([1, null, 2], asyncScheduler);
    const result = source.pipe(notNull);
    const spy = createSpy();

    result.subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(1);
    expect(spy).toHaveBeenCalledWith(2);

    // fails
  });

  it('should filter null values - async', (done: DoneFn) => {
    const source = from([1, null, 2], asyncScheduler);
    const result = source.pipe(notNull);
    const spy = createSpy();

    result.subscribe({
      next: spy,
      complete: () => {
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith(1);
        expect(spy).toHaveBeenCalledWith(2);
        done();
      }
    });
  });

  it('should filter null values - async long', (done: DoneFn) => {
    const source = from([1, null, 2], asyncScheduler).pipe(delay(3000));
    const result = source.pipe(notNull);
    const spy = createSpy();

    result.subscribe({
      next: spy,
      complete: () => {
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith(1);
        expect(spy).toHaveBeenCalledWith(2);
        done();
      }
    });
  });

  it('should filter null values - fake async', fakeAsync((n) => {
    const source = from([1, null, 2], asyncScheduler).pipe(delay(4000));
    const result = source.pipe(notNull);
    const spy = createSpy();

    result.subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(0);
    tick(3999);
    expect(spy).toHaveBeenCalledTimes(0);
    tick(1)
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(1);
    expect(spy).toHaveBeenCalledWith(2);
  }));

  it('should filter null values - marbles', marbles((m: Context) => {
    const source = m.cold('--x--y--z|', {x: '1', y: null, z: '2'});
    const result = source.pipe(notNull);
    const expected = m.cold('--1-----2|', );

    m.expect(result).toBeObservable(expected);
  }));
});

