'use strict';

const expect = require('chai').expect;
const del = require('del');
const Storage = require('../lib/storage.js');
const dataDir = process.env.DATA_DIR || `${__dirname}/../data`;
const storage = new Storage(dataDir);
const item = { id: 123456, content: 'test item', timestamp: new Date() };

describe('testing module storage', function(){
  after((done) => {
    del([`${dataDir}/note/*`, `${dataDir}/note`]).then(() => {
      done();
    }).catch((err) => {
      console.error(err);
      done();
    });;
  });

  describe('testing method itemPath',function(){
    it(`should return ${dataDir}/note/123`,function(){
      expect(storage.itemPath('note', 123)).to.equal(`${dataDir}/note/123`);
    });
  });

  describe('testing method setItem', function(done){
    it('should succede', (done) => {
      storage.setItem('note', item).then(() => {
        this.success = true;
        expect(this.success).to.equal(true);
        done();
      }).catch((err) => {
        expect(this.success).to.equal(true);
        console.log('lul');
        this.success = false;
        done();
      });
    });
  });

  describe('testing method fetchItem', function(){
    before((done) => {
      storage.fetchItem('note', item.id).then((result) => {
        this.result = result;
        done()
      }).catch((err) => {
        this.result = result;
        done();
      });
    });

    it('should return item with id 123456', () => {
      expect(this.result.id).to.equal(123456);
    });
  });

  describe('testing method fetchIds', function(){
    before((done) => {
      storage.fetchIds('note').then((ids) => {
        this.result = ids;
        done();
      }).catch((err) => {
        this.result = ids;
        done();
      });
    });

    it('should return an array with the string "123456"', () => {
      expect(this.result[0]).to.equal('123456');
    });
  });
});
