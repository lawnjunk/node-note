'use strict';

const response = require('../lib/response.js');
const Note = require('../model/note.js');
const debug = require('debug')('note-route')

var notes = {};


module.exports = function(router, storage){
  router.get('/note', function(req, res){
    debug('HIT ROUTE: GET /note');
    var note = notes[req.url.query.id];
    storage.fetchItem('note', req.url.query.id).then((note)=>{
      response(200, note)(req, res);
    }).catch((err) => {
      console.error(err);
      response(404, 'not found')(req,res);
    });;
  })
  .get('/note/all', function(req,res){
    response(200, Object.keys(notes))(req, res);
  })
  .post('/note', function(req, res){
    debug('HIT ROUTE: POST /note');
    storage.setItem('note', new Note(req.body.text)).then((note) => {
      response(200, note)(req, res);
    }).catch((err) => {
      response(500, 'internal server error')(req,res);
    });
  })
  .put('/note', function(req, res){
    debug('HIT ROUTE: PUT /note');
    var note = notes[req.body.id];
    if(note){
      note.text = req.body.text;
      return response(200, note)(req, res);
    }
    response(404, 'not found')(req,res);
  })
  .delete('/note', function(req, res){
    debug('HIT ROUTE: DELETE /note');
    var note = notes[req.body.id];
    if(note){
      delete notes[req.body.id];
      return response(200, 'success')(req, res);
    }
    response(404, 'not found')(req,res);
  });
};
