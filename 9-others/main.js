import Rx from 'rxjs/Rx';

const r = Rx.Observable.range(1, 10);

//r.first().subscribe(console.log);
//r.last().subscribe(console.log);

//r.find(i => i % 3 === 0).subscribe(console.log);
//r.findIndex(i => i % 3 === 0).subscribe(console.log);

//r.min().subscribe(console.log);
//r.max().subscribe(console.log);

//const [evens, odds] = r.partition(i => i % 2 === 0);
//odds.subscribe(console.log);

  /*r
  .map(x => x + 1)
  .do(x => console.log('checking:', x))
  .map(x => x * x)
  .subscribe(console.log);*/

//Rx.Observable.interval(1000).timestamp().subscribe(console.log);
//r.every(x => x < 10).subscribe(console.log);
