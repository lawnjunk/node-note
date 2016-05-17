'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const server = require('../server');

describe('testing route /note', function(){
  before((done) => {
    if (!server.isRunning){
      server.listen(3000, function(){
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    server.close(function(){
      done();
    });
  });

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
