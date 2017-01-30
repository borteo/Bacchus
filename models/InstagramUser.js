
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  id: {type: String, required: true, unique: true },
  name: String,
  username: { type: String, unique: true },
  fullname: String,
  picture: String,
  isPrivate: Boolean,
  isGoodCandidate: Boolean,
  isUpdated: Boolean,
  isLiked: Boolean,
  isFollowed: Boolean,
  followings: Number,
  followers: Number
});

userSchema.pre('save', function save(next) {
	console.log('Saved 😀 : ', this);
	if ( !this.username ) {
		return;
	}
	next();
});

// the schema is useless so far
// we need to create a model using it
var InstagramUser = mongoose.model('InstagramUser', userSchema);

// make this available to our users in our Node applications
module.exports = InstagramUser;
