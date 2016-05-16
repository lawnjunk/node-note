const uuid = require('node-uuid');

const Note = module.exports = function(text, category){
  this.id = uuid.v1();
  this.category = category;
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
