/**
* schemas
**/
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var followerSchema =  new Schema ({
  mainUser : String,
  follower:[{  }]
});

module.exports = mongoose.model('Follower',followerSchema);
