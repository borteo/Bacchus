const _ = require('lodash');
const Promise = require('bluebird');

const Conf = require('../config/users.js');
const Client = require('instagram-private-api').V1;
const currentUser = Conf.user;
const device = new Client.Device( currentUser.username );
const storage = new Client.CookieFileStorage('./public/cookies/'+ currentUser.username +'.json');
const session = new Client.Session(device, storage);

const FollowerUser = require('../models/FollowerUser.js');
const FollowingUser = require('../models/FollowingUser.js');
const InstagramUser = require('../models/InstagramUser.js');

const QueueWorker = require('./queue-worker.js');


exports.getFollowings = ( userID ) => {
  let id     = userID || currentUser.id;
  const feed = new Client.Feed.AccountFollowing( session, id );

  return feed.allSafe();
};

exports.getFollowers = ( userID ) => {
  let id     = userID || currentUser.id;
  const feed = new Client.Feed.AccountFollowers( session, id );

  return feed.allSafe();
};

exports.cleanDB = () => {
  FollowerUser.remove({}, function(err) { 
    console.log('FollowerUser removed') ;
  });
  FollowingUser.remove({}, function(err) { 
    console.log('FollowingUser removed');
  });
  
  return Promise.resolve();
};

exports.getConnections = () => {
  let data = {
    followers: [],
    followings: []
  };

  // FOLLOWER
  var p1 = FollowerUser.find({})
    .sort({'username': 1})
    .exec( function(err, users) {
      if ( err ) throw err;
      data.followers = users;
    })
  ;

  // FOLLOWING
  var p2 = FollowingUser.find({})
    .sort({'username': 1})
    .exec( function(err, users) {
      if ( err ) throw err;
      data.followings = users;
    })
  ;

  return Promise
    .all([p1, p2])
    .then(function() {
      return Promise.resolve( data );
    })
  ;
};

/* Example of `params` 
{
  fullName: 'Mitch Davis',
  hasAnonymousProfilePicture: false,
  id: 239714269
  id: 239714269,
  isBusiness: false,
  isPrivate: true,
  picture: 'http://scontent-fra3-1.cdninstagram.com/t51.2885-19/s150x150/14504813_818487238254488_1330305213004775424_a.jpg',
  profilePicId: '1386607204866824393_239714269',
  username: 'toocolddavis'
}
*/

exports.saveFollowers = ( users ) => {
  users.forEach(function( user, index ) {
    saveUser( user.params, FollowerUser );
  });
};

exports.saveFollowings = ( users ) => {
  users.forEach(function( user, index ) {
    saveUser( user.params, FollowingUser );
  });
};

exports.unfollow = ( jerksData ) => {
  // accept single or array
  let jerks = [].concat( jerksData || [] );

  jerks.forEach(function( jerk, index ) {
    if ( index >= Conf.unfollowLimit ) {
      return;
    }
    QueueWorker.addJerksToQueue( jerk, index );  
  });
};

exports.follow = ( us ) => {
  let users = [].concat( us );

  users.forEach(function( user, index ) {

    setTimeout(function() {
      console.log('following', user.username);

      Client.Relationship.create( session, user.id )
        .then(function(relationship) {
          console.log('user followed: ', user.username, relationship.params);
          saveUser( user, FollowingUser, true );
      });    
    }, _.random(2000, 4000) * index);

  });
};


// ------ Private -------

let saveUser = ( user, model, isFollowed ) => {

  return model.find({ 'id': user.id }, function(err, u) {
    if ( err ) throw err;
    if ( u.length ) {
      console.log(`User ${user.username} already exists`);
      if ( isFollowed ) {
        updateInstagramUser( user );
      }
      return Promise.resolve();
    }

    var newUser = model({
      id: user.id,
      name: user.fullName,
      username: user.username,
      picture: user.picture,
      isPrivate: user.isPrivate,
    });

    // save user!
    newUser.save(function(err) {
      if ( err ) throw err;
      console.log(`User ${user.username} created!`);
    });

    // Update Instagram user as well, thus it'll show isFollowed = true
    
    if ( isFollowed ) {
      updateInstagramUser( user );
    }

    Promise.resolve();
  });
  
};


let updateInstagramUser = ( user ) => {
  InstagramUser.findOneAndUpdate(
    { 'id': user.id },
    { $set:{ 'isFollowed': true } },
    { new: true }, function(err, doc) {
    if ( err ) {
      console.log('Something wrong when updating data! -- addLikesToQueue');
    }
  });
};
