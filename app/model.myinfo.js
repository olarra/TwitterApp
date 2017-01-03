/**
* schemas
**/
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var myInfoSchema =  new Schema ({
  name:   String,
  photo: String,
  location : String,
  followers : String,
  friends : String
});

module.exports = mongoose.model('MyInfo',myInfoSchema);
