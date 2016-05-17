'use strict';

const fs = require('fs');
const path = require('path');
const debug = require('debug')('storage')

const Storage = module.exports = function(dataDir){
  this.dataDir = dataDir;
};

Storage.prototype.itemPath = function(type, id){
  debug('hit item path');
  return `${this.dataDir}/${type}/${id}`;
}

Storage.prototype.itemDir = function(type){
  debug('hit itmeDir');
  return `${this.dataDir}/${type}`;
}

Storage.prototype.itemDirExists = function(type, id){
  debug('hit this.itemDirExists');
  return new Promise((reslove, reject) => {
    fs.stat(this.itemDir(type, id), (err) => {
      if (err) return reject(err)
        reslove();
    });
  });
}

Storage.prototype.mkItemDir = function(type, id) {
  debug('hit this.mkItemDir');
  return new Promise((reslove, reject) => {
    fs.mkdir(this.itemDir(type, id), (err) => {
      if (err) return reject(err);
      reslove();
    });
  });
}

Storage.prototype.fetchItem = function(type, id){
  debug('hit fetchItem');
  return new Promise((reslove, reject) => {
    fs.readFile(this.itemPath(type,id), (err, data) => {
      if (err) return reject(err);
      try {
        const item = JSON.parse(data.toString());
        reslove(item);
      } catch (err){
        reject(err);
      }
    });
  });
};

Storage.prototype.setItem = function(type, item){
  debug('hit setItem');
  return new Promise((reslove, reject) => {
    this.itemDirExists(type, item.id).then(() => {
      fs.writeFile(this.itemPath(type, item.id), JSON.stringify(item), function(err) {
        if (err) return reject(err);
        return reslove();
      });
    }).catch(() => {
      this.mkItemDir(type, item.id).then(() => {
        this.setItem(type, item).then(function(){
          reslove();
        }).catch(function(err){
          reject(err);
        });;
      }).catch((err) => {
         return reject(err);
      });
    });
  });
};

Storage.prototype.fetchIds = function(type){
  debug('hit this.itemDir');
  return new Promise((reslove, reject) => {
    fs.readdir(this.itemDir(type), (err, files) => {
      if (err) return reject(files);
      reslove(files);
    });
  });
};
