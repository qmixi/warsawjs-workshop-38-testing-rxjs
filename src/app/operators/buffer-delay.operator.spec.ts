import {fakeAsync} from '@angular/core/testing';
import {marbles} from 'rxjs-marbles/jasmine';

fdescribe('bufferDelay tests', () => {
  it('should test with done callback', (done: DoneFn) => {
    done();
  });

  it('should work with fakeAsync', fakeAsync(() => {
  }));

  it('should work with marbles', marbles((m) => {
  }));
});
