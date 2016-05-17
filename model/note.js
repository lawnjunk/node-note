const uuid = require('node-uuid');

const Note = module.exports = function(text){
  this.id = uuid.v1();
  this.text = text;
  this.timestamp = new Date();
  this.upVotes = 0;
};

Note.prototype.upVote = function(){
  this.upVotes++;
};

Note.prototype.downVote = function(){
  this.upVotes--;
};
