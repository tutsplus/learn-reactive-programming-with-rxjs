import Rx from 'rxjs/Rx';

/*
 *
 * OBSERVABLE
 *
 * - next data
 * - error
 * - complete
 *
 */

var obs1 = Rx.Observable.create(sub => {
  sub.next(1);
  sub.next(2);
  sub.next(3);
  sub.complete();
});

/*
 *
 * OBSERVER / SUBSCRIBER / SUBSCRIPTION
 *
 */

obs1.subscribe({
  next: console.log,
  error: console.error,
  complete: () => console.log('done!')
});

/*
 *
 * OPERATORS
 *
 */

var obs2 = obs1.map(x => x + 100)

obs2.subscribe(console.log);
