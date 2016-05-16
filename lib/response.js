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

