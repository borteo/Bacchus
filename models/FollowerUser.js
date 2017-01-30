
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var followerSchema = new Schema({
  id:  String,
  name: String,
  username: { type: String, required: true, unique: true },
  fullname: String,
  picture: String,
	isPrivate: Boolean
});

// the schema is useless so far
// we need to create a model using it
var Follower = mongoose.model('FollowerUser', followerSchema);

// make this available to our users in our Node applications
module.exports = Follower;
