import Rx from 'rxjs/Rx';

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

const rocksEl   = document.querySelector('#rocks');
const shotsEl   = document.querySelector('#shots');
const blasterEl = document.querySelector('#blaster');
const hitsEl    = document.querySelector('#hits');
const missesEl  = document.querySelector('#misses');

const INTERVAL = 20;
let PAUSED = false;
const ROCK_DIM = 30;

const LETTER_P = 80;
const RIGHT_ARROW = 39;
const LEFT_ARROW = 37;
const ARROWS = [RIGHT_ARROW, LEFT_ARROW];
const SPACEBAR = 32;

const INITIAL_STATE = {
  rocks: [],
  shots: [],
  blasterPos: 447,
  hits: 0,
  misses: 0
};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const createRock = () => ({
  top: 0,
  left: rand(0, 870)
});

const pauser = new Rx.BehaviorSubject(PAUSED);
const timer = Rx.Observable.interval(INTERVAL);
const pausableTimer = pauser.switchMap(paused => paused ? Rx.Observable.never() : timer);

const keydowns = Rx.Observable.fromEvent(document, 'keydown');
const keyups   = Rx.Observable.fromEvent(document, 'keyup');

// PAUSE BEHAVIOUR
keydowns
  .filter(evt => evt.keyCode === LETTER_P)
  .subscribe(() => pauser.next(PAUSED = !PAUSED))

// BLASTER
const isArrow = evt => ARROWS.indexOf(evt.keyCode) > -1;

const arrowDowns = keydowns.filter(isArrow).map(evt =>
  evt.keyCode === RIGHT_ARROW ? 1 :
    evt.keyCode === LEFT_ARROW ? -1 : 0);
const arrowUps = keyups.filter(isArrow).mapTo(0);
const directions = Rx.Observable.merge(arrowDowns, arrowUps)
  .distinctUntilChanged()
  .startWith(0);

const isSpace = evt => evt.keyCode === SPACEBAR;
const spaceUps = keyups.filter(isSpace);

const shooting = keydowns
  .filter(isSpace)
  .throttle(() => spaceUps)
  .mergeMapTo(Rx.Observable.concat(
    toggleInterval(0, INTERVAL, INTERVAL * 5).map(i => i % 2 === 0).takeUntil(spaceUps),
    Rx.Observable.of(false)))
  .startWith(false);

pausableTimer
  .withLatestFrom(directions)
  .withLatestFrom(shooting, (a, b) => a.concat([b]))
  .scan(updateState, INITIAL_STATE)
  .subscribe(updateView);

const passed = (shot, rock) => rock.top + ROCK_DIM >= shot.top;
const within = (shot, rock) => rock.left < shot.left && shot.left < rock.left + ROCK_DIM;

const hit = (shot, rock) =>
  passed(shot, rock) &&
  within(shot, rock) &&
  !shot.hit &&
  !rock.hit;

function updateState(state, [time, dir, shooting]) {
  let { rocks, shots, misses, hits } = state;
  let blasterPos = Math.max(0, Math.min(state.blasterPos + (dir * 5), 895));

  // add rocks
  if (time % 50 === 0) rocks.push(createRock());

  // add shots
  if (shooting) shots.push({ top: 370, left: blasterPos });

  // move rocks
  rocks.forEach(rock => rock.top += 1);

  // move shots
  shots.forEach(shot => shot.top -= 1);

  // remove past rocks
  let rocksLen = rocks.length;
  rocks = rocks.filter(rock => rock.top < 370);
  misses += rocksLen - rocks.length;

  // remove past shots
  shots = shots.filter(shot => shot.top > 0);

  // remove collisions
  shots.forEach(shot => {
    rocks.forEach(rock => {
      if (hit(shot, rock)) {
        shot.hit = true;
        rock.hit = true;
        hits++;
      }
    });
  });

  shots = shots.filter(shot => !shot.hit);
  rocks = rocks.filter(rock => !rock.hit);

  return Object.assign({}, state, {
    rocks,
    shots,
    misses,
    hits,
    blasterPos
  });
}

function updateView(state) {
  rocksEl.innerHTML = state.rocks.map(rock => `<div
    class="rock"
    style="top: ${rock.top}px; left:${rock.left}px"></div>`).join('');

  shotsEl.innerHTML = state.shots.map(shot => `<div
    class="shot"
    style="top: ${shot.top}px; left:${shot.left}px"></div>`).join('');

  blasterEl.style.left = state.blasterPos;
  missesEl.innerText = state.misses;
  hitsEl.innerText = state.hits;
}
