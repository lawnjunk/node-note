const url = require('url');
const query = require('querystring');


module.exports = function (req){
  return new Promise(function(resolve){
    req.url = url.parse(req.url);
    req.url.query = query.parse(req.url.query);
    resolve();
  });
};
