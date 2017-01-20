import Rx from 'rxjs/Rx';

var log = val => console.log(val);


// of
//Rx.Observable.of('React', 'Angular 2', 'Meteor', 'Backbone :(').subscribe(log);

// from
//Rx.Observable.from(['poe', 'shelley', 'bronte', 'eliot']).subscribe(log);

// fromEvent
//Rx.Observable.fromEvent(document, 'click').subscribe(log);

// interval
//Rx.Observable.interval(500).subscribe(log);

// timer
//Rx.Observable.timer(0, 1000).subscribe(log);

// range
//Rx.Observable.range(42, 10).subscribe(log);

function fetch(url, callback) {
  callback(null, 'data');
}

// bindCallback
// bindNodeCallback

const rxFetch = Rx.Observable.bindNodeCallback(fetch);
//rxFetch('url').subscribe(log);

const o1 = Rx.Observable.interval(1000).map(x => 'a' + x);
const o2 = Rx.Observable.interval(2000).map(x => 'b' + x);
const o3 = Rx.Observable.interval(3000).map(x => 'c' + x);

// merge
//Rx.Observable.merge(o1, o2, o3).subscribe(log);

// concat
//Rx.Observable.concat(o1, o2).subscribe(log);

// zip
//Rx.Observable.zip(o1, o2, o3).subscribe(log);

// combineLatest
//Rx.Observable.combineLatest(o1, o2).subscribe(log);

// Rx.Observable.never
// Rx.Observable.empty
// Rx.Observable.throw

// create

const toggleInterval = (initial = 0, period1 = 0, period2 = 0) =>
  Rx.Observable.create(sub => {
    let count = 0;

    function fn1 () {
      sub.next(count++);
      setTimeout(fn2, period1);
    }

    function fn2 () {
      sub.next(count++);
      setTimeout(fn1, period2);
    }

    setTimeout(fn1, initial);
  });

toggleInterval(0, 200, 2000).subscribe(log);
