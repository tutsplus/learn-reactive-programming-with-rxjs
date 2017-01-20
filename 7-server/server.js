const Rx = require('rxjs/Rx');
const http = require('http');
const match = require('path-match')();

Rx.Observable.prototype.method = function (method) {
  return this.filter(o => o.req.method === method);
};

Rx.Observable.prototype.route = function (route) {
  return this.filter(({ req, res }) => {
    var params = match(route)(req.url);
    if (params) req.params = params;
    return params;
  });
};

function server(port) {
  const requests = Rx.Observable.create(sub => {
    http.createServer(function (req, res) {
      sub.next({ req, res });
    }).listen(port);
  }).share();

  const unansweredReqs = requests.filter(({ res }) => !res.finished);

  return {
    get:  route => unansweredReqs.method('GET').route(route),
    post: route => unansweredReqs.method('POST').route(route)
  };
}

const app = server(2346);

app.get('/posts/:id').subscribe(({ req, res }) => {
  res.write(JSON.stringify(req.params));
  res.end();
});

app.post('/posts').subscribe(({ req, res }) => {
  res.write('post req.');
  res.end();
});

app.get('*').subscribe(({ req, res }) => {
  res.write('catchall');
  res.end();
});
