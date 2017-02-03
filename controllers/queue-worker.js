var _ = require('lodash');
const kue = require('kue');
const queue = kue.createQueue();
// REMOVE ME; This is just to monitor on localhost
kue.app.listen(8080);  

const Conf = require('../config/users.js');
const Client = require('instagram-private-api').V1;
const currentUser = Conf.user;
const device = new Client.Device( currentUser.username );
const storage = new Client.CookieFileStorage('./public/cookies/'+ currentUser.username +'.json');
const session = new Client.Session(device, storage);

const InstagramUser = require('../models/InstagramUser.js');
const FollowingUser = require('../models/FollowingUser.js');

let counter = 0;

// general job complete
queue.on('job complete', function( id, result ) {
  kue.Job.get(id, function(err, job) {
    if (err) return;
    job.remove(function(err){
      if (err) throw err;
      console.log('removed completed job #%d', job.id);
    });
  });
});


queue.process('unfollow', function( job, done ) {
  const jerk = job.data;
  Client.Relationship
    .destroy( session, jerk.id )
    .then(function() {
      console.log('💩  user: ', counter++, jerk.id, jerk.username);
      FollowingUser.remove({ id : jerk.id }, function (err) {
        if ( err ) { console.log('error', err); throw err;}
        done();
      });
    });
});

queue.process('follow', function( job, done ) {
  const user = job.data;
   Client.Relationship.create( session, user.id )
      .then(function(relationship) {
        console.log('user followed: ', user.username, relationship.params);
        done();
    })
  ; 
});

queue.process('like', function( job, done ) {
  const media = job.data;
  Client
    .Like
    .create( session, media.id )
    .then(function( liked ) {
      console.log('👍  media: ', media.id);
      done();
    })
  ;
});


queue.process('save_user_from_location', function( job, done ) {
  const data = job.data;

  console.log('save_user_from_location', data);

  InstagramUser.findOne({ id: data.id }, function(err, user) {
    if ( err ) throw err;

    //existing user found, stop registration
    if ( user ) {
      return done();
    }
    
    var newUser = InstagramUser({
      id: data.id,
      name: data.fullName,
      username: data.username,
      picture: data.picture,
      isPrivate: user.params.isPrivate,
      isGoodCandidate: false,
      isUpdated: false,
      isLiked: false,
      isFollowed: false
    });

    // save the user
    newUser.save(function(err) {
      if ( err ) throw err;
      console.log(`🤖  user ${data.username} created!`);    
    });
  });

  done();
  
});


// Public

exports.addLikesToQueue = ( media, idx, userID ) => {
  let now = new Date();
  now.setSeconds(now.getSeconds() + _.random(10, 30) * idx);

  queue
    .create('like', { id: media.id })
    .delay( now )
    .save(function(err) {
      console.log('error', err);

      // update model
      if ( !err && userID ) {
        InstagramUser.findOneAndUpdate(
          { 'id': userID },
          { $set:{ 'isLiked': true } },
          { new: true }, function(err, doc) {
          if ( err ) {
            console.log("Something wrong when updating data! -- addLikesToQueue");
          }
        });
      }

    });
};


exports.addFollowToQueue = ( user, idx, userID ) => {
  let now = new Date();
  now.setSeconds(now.getSeconds() + _.random(10, 30) * idx);

  queue
    .create('follow', { id: user.id, username: user.username })
    .delay( now )
    .save(function(err) {
      console.log('error', err);

      if ( !err && userID ) {
        InstagramUser.findOneAndUpdate(
          { 'id': user.id },
          { $set:{ 'isFollowed': true } },
          { new: true }, function(err, doc) {
          if ( err ) {
            console.log('Something wrong when updating data! -- addFollowToQueue');
          }
        });
      }
    })
  ;
};


exports.addUsersToQueue = ( user, idx ) => {
  let now = new Date();
  now.setSeconds(now.getSeconds() + _.random(3, 7) * idx);

  /* EXAMPLE:
  username: 'giuseppecocacolaa',
  picture: 'http://scontent-mxp1-1.cdninstagram.com/t51.2885-19/s150x150/13098982_869802403163703_243598190_a.jpg',
  fullName: 'Giuseppe Cola',
  id: 1615125053,
  isPrivate: false,
  hasAnonymousProfilePicture: false,
  isBusiness: false,
  profilePicId: '1240367389019789414_1615125053'
  */

  queue
    .create( 'save_user_from_location', 
      _.pick(user, ['id', 'name', 'username', 'picture', 'fullName']) )
    .delay( now )
    .save(function(err) {
      console.log('error', err);
    });
};


exports.addJerksToQueue = ( jerk, idx ) => {
  let now = new Date();
  now.setSeconds(now.getSeconds() + _.random(5, 10) * idx);

  queue
    .create( 'unfollow', _.pick(jerk, ['id', 'username']) )
    .delay( now )
    .save(function(err) {
      console.log('error', err);
    });
};
