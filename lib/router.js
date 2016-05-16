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


