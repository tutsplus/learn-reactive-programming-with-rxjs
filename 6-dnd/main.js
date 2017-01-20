import Rx from 'rxjs/Rx';

const box = document.querySelector('#main');

const mouseDown = Rx.Observable.fromEvent(box, 'mousedown');
const mouseUp = Rx.Observable.fromEvent(box, 'mouseup');
const mouseMove = Rx.Observable.fromEvent(document, 'mousemove');

// 1) mouseDown, cursor offset from box
// 2) mouseMove, cursor offset from original offset
// 3) mouseUp: done!

const mouseDrag = mouseDown.mergeMap(evt => {
  let offsetX = evt.clientX - box.offsetLeft;
  let offsetY = evt.clientY - box.offsetTop;

  return mouseMove.map(evt => ({
    left: evt.clientX - offsetX,
    top:  evt.clientY - offsetY
  })).takeUntil(mouseUp);
});

mouseDrag.subscribe(({ top, left }) => {
  box.style.top = top;
  box.style.left = left;
});
