/**
* schemas
**/
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var relationship =  new Schema ({
  links:[{  }],
  nodes:[{  }]
});

module.exports = mongoose.model('Relationship',relationship);
