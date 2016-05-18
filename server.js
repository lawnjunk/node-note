'use strict';

const http = require('http');
const port = process.env.PORT || 3000;

const Router = require('./lib/router.js');
const noteRoute = require('./routes/note-route.js');

const Storage = require('./lib/storage.js');
const dataDir = process.env.DATA_DIR || `${__dirname}/data`;
const storage = new Storage(dataDir);

const router = new Router();

noteRoute(router, storage);

const server = module.exports = http.createServer(router.route());

server.listen(port, function(){
  server.isRunning = true;
  console.log('server up :::', port);
});
