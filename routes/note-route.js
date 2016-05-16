'use strict';

const response = require('../lib/response.js');
const Note = require('../model/note.js');

var notes = {};

module.exports = function(router){
  router.get('/note', function(req, res){
    console.log('HIT ROUTE: GET /note');
    var note = notes[req.url.query.id];
    if(note){
      return response(200, note)(req, res);
    }
    response(404, 'not found')(req,res);
  })
  .get('/note/all', function(req,res){
    response(200, Object.keys(notes))(req, res);
  })
  .post('/note', function(req, res){
    console.log('HIT ROUTE: POST /note');
    var note = new Note(req.body.text);
    notes[note.id] = note;
    response(200, note)(req, res);
  })
  .put('/note', function(req, res){
    console.log('HIT ROUTE: PUT /note');
    var note = notes[req.body.id];
    if(note){
      note.text = req.body.text;
      return response(200, note)(req, res);
    }
    response(404, 'not found')(req,res);
  })
  .delete('/note', function(req, res){
    console.log('HIT ROUTE: DELETE /note');
    var note = notes[req.body.id];
    if(note){
      delete notes[req.body.id];
      return response(200, 'success')(req, res);
    }
    response(404, 'not found')(req,res);
  });
};
