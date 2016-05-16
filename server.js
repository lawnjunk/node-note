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
