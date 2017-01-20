import Rx from 'rxjs/Rx';

const main = document.querySelector('#main');

const write = msg => {
  let h3 = document.createElement('h3');
  h3.innerText = msg;
  main.appendChild(h3);
};

const keyboardShortcuts = {
  'ga' : () => write('go to all messages'),
  'gi' : () => write('go to inbox'),
  'h'  : () => write('open help'),
  'asd': () => write('other shortcut')
};

const shortcutKeys = Object.keys(keyboardShortcuts);

const letters = Rx.Observable.fromEvent(document, 'keyup')
  .pluck('key')
  .filter(char => char.match(/^[a-zA-Z]$/));

// letters ---a---s---d----f---->
// buffer  -------------X------->
// auditT  -------------i------->

letters.buffer(letters.auditTime(250))
  .map(l => l.join(''))
  .filter(str => shortcutKeys.indexOf(str) > -1)
  .map(key => keyboardShortcuts[key])
  .subscribe(fn => fn());
