**server.js**
``` js   
'use strict';

const http = require('http');
const Router = require('./lib/router.js');
const noteRoute = require('./routes/note-route.js');

const port = process.env.PORT || 3000;
const router = new Router();

noteRoute(router);

const server = http.createServer(router.route());
server.listen(port, function(){
  console.log('server up :::', port);
});
```   

**model/note.js**
``` hs   
const uuid = require('node-uuid');

const Note = module.exports = function(text){
  this.id = uuid.v1();
  this.text = text;
  this.timestamp = new Date();
  this.upVotes = 0;
};

Note.prototype.upVote = function(){
  this.upVotes++;
};

Note.prototype.downVote = function(){
  this.upVotes--;
};
```   

**lib/router.js**
``` js   
'use strict';

const parseUrl = require('./parse-url');
const parseBody =  require('./parse-body');

const Router = module.exports = function(){
  this.routes = {
    GET: {},
    PUT: {},
    POST: {},
    DELETE: {}
  };
};

Router.prototype.get = function(routeName, cb){
  this.routes.GET[routeName] = cb;
  return this;
};


Router.prototype.put = function(routeName, cb){
  this.routes.PUT[routeName] = cb;
  return this;
};

Router.prototype.post = function(routeName, cb){
  this.routes.POST[routeName] = cb;
  return this;
};

Router.prototype.delete = function(routeName, cb){
  this.routes.DELETE[routeName] = cb;
  return this;
};

Router.prototype.route = function(){
  var routes = this.routes;
  return function(req,res){
    Promise.all([
      parseBody(req),
      parseUrl(req)
    ]).then(function(){
      if (typeof routes[req.method][req.url.pathname] === 'function')
        return routes[req.method][req.url.pathname](req,res);
      console.log('HIT 404');
      console.log(`  NO ROUTE: ${req.method} ${req.url.pathname}`);
      res.writeHead(404);
      res.write('not found');
      res.end();
    }).catch(function(err){
      console.log('HIT 400');
      console.error(' ',err);
      res.writeHead(400);
      res.write('bad request');
      res.end();
    });
  };
};


```   

**lib/response.js**
``` js   
'use strict';
module.exports = function response(statusCode, data){
  return function(req, res){
    res.writeHead(statusCode, {
      'Content-Type': 'application/json'
    });
    res.write(JSON.stringify(data));
    res.end();
  };
};

```   

**lib/parse-url.js**
``` js   
const url = require('url');
const query = require('querystring');


module.exports = function (req){
  return new Promise(function(resolve){
    req.url = url.parse(req.url);
    req.url.query = query.parse(req.url.query);
    resolve();
  });
};
```   

**lib/parse-body.js**
``` js   
module.exports = function(req){
  return new Promise(function(resolve, reject){
    if (/(PUT|POST|DELETE)/.test(req.method)){
      req.body = '';
      req.on('data', function(data){
        req.body += data.toString();
      });
      req.on('end', function(){
        try {
          req.body = JSON.parse(req.body);
          resolve();
        } catch(err){
          reject(err);
        }
      });
      return;
    }
    resolve();
  });
};
```   

**routes/note-route.js**
``` js   
'use strict';

const response = require('../lib/response.js');
const Note = require('../model/note.js');

var notes = {};

module.exports = function(router){
  router.get('/note', function(req, res){
    console.log('HIT ROUTE: GET /note');
    var note = notes[req.url.query.id];
    if(note){
      return response(200, note)(req, res);
    }
    response(404, 'not found')(req,res);
  })
  .get('/note/all', function(req,res){
    response(200, Object.keys(notes))(req, res);
  })
  .post('/note', function(req, res){
    console.log('HIT ROUTE: POST /note');
    var note = new Note(req.body.text);
    notes[note.id] = note;
    response(200, note)(req, res);
  })
  .put('/note', function(req, res){
    console.log('HIT ROUTE: PUT /note');
    var note = notes[req.body.id];
    if(note){
      note.text = req.body.text;
      return response(200, note)(req, res);
    }
    response(404, 'not found')(req,res);
  })
  .delete('/note', function(req, res){
    console.log('HIT ROUTE: DELETE /note');
    var note = notes[req.body.id];
    if(note){
      delete notes[req.body.id];
      return response(200, 'success')(req, res);
    }
    response(404, 'not found')(req,res);
  });
};
```   

**test/note-route-test.js**
``` js   
'use strict';

const expect = require('chai').expect;
const request = require('superagent');

describe('testing route /note', function(){
  describe('testing method GET', function(){
    describe('with no data on server', function(){
      it('should return 404 not found', function(done){
        request.get('localhost:3000/note')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('"not found"');
          done();
        });
      });
    });

    describe('with data on the server', function(){
      before((done) => {
        request.post('localhost:3000/note')
        .send({text: 'test note'})
        .end((err, res) => {
          this.original = res.body;
          request.get('http://localhost:3000/note?id=' + res.body.id)
          .end((err, res) => {
            this.res = res;
            done();
          });
        });
      });

      describe('with query string', () => {
        it('should return status 200', (done) => {
          expect(this.res.status).to.equal(200);
          done();
        });

        it('should return a note object', (done) => {
          expect(this.res.body.text).to.equal('test note');
          expect(this.res.body.timestamp).to.equal(this.original.timestamp);
          expect(this.res.body.id).to.equal(this.original.id);
          expect(this.res.body.upVotes).to.equal(0);
          done();
        });
      });

      describe('with no query string', function(){
        before((done) => {
          request.get('http://localhost:3000/note')
          .end((err, res) => {
            this.res = res;
            done();
          });
        });

        it('should return status 200', (done) => {
          expect(this.res.status).to.equal(404);
          done();
        });

        it('should return "not found"', (done) => {
          expect(this.res.text).to.equal('"not found"');
          done();
        });
      })
    });
  });
});
```   

