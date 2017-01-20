import Rx from 'rxjs/Rx';

const inputEl = document.querySelector('input');
const activeEl = document.querySelector('#active');
const doneEl = document.querySelector('#done');

const appState = new Rx.BehaviorSubject({ todos: [] });

const dispatcher = fn => (...args) => appState.next(fn(...args));

const createTodo = dispatcher(data => ({ type: 'CREATE_TODO', data }));
const toggleTodo = dispatcher(data => ({ type: 'TOGGLE_TODO', data }));

function reducer(state, action) {
  switch(action.type) {
    case 'CREATE_TODO':
      return Object.assign({},
        state,
        { todos: state.todos.concat([ { text: action.data, done: false } ]) });
    case 'TOGGLE_TODO':
      return Object.assign({},
        state,
        { todos: state.todos.map(todo => todo.text === action.data ?
          Object.assign({}, todo, { done: !todo.done }) : todo) });
    default:
      return state || {};
  }
}

const li = todo => `<li>${todo.text}</li>`;

function updateView(state) {
  activeEl.innerHTML = state.todos.filter(todo => !todo.done).map(li).join('');
  doneEl.innerHTML = state.todos.filter(todo => todo.done).map(li).join('');
}

appState.scan(reducer).subscribe(updateView);

Rx.Observable.fromEvent(inputEl, 'keyup')
  .filter(e => e.key === 'Enter')
  .map(e => e.target.value)
  .subscribe(text => {
    createTodo(text);
    inputEl.value = '';
  });

Rx.Observable.fromEvent(activeEl, 'click')
  .merge(Rx.Observable.fromEvent(doneEl, 'click'))
  .filter(e => e.target.matches('li'))
  .map(e => e.target.innerText.trim())
  .subscribe(toggleTodo);
