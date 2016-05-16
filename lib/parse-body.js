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
