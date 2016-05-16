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
          console.error('err', res.body);
          this.note = res.body;
          console.log(this.note);
          done();
        });
      });

      it('should return status 200', function(done){
        console.log('');
        done();
      });
    });
  });
});
