var _ = require('lodash');
var async = require('async');
var Promise = require('bluebird');
var mongoose = require('mongoose');
const fs = require('fs');

const QueueWorker = require('./queue-worker.js');

const Conf = require('../config/users.js');
const Client = require('instagram-private-api').V1;
const currentUser = Conf.user;
const device = new Client.Device( currentUser.username );
const storage = new Client.CookieFileStorage('./public/cookies/'+ currentUser.username +'.json');
const session = new Client.Session(device, storage);

const InstagramUser = require('../models/InstagramUser.js');

// Public Methods
exports.getInstagramUsers = () => {

  return InstagramUser.find({})
    .sort({'username': 1})
    .exec( function(err, users) {
      if ( !err ) {
        let data = { 
          amount: users.length,
          users: users
        };
        return Promise.resolve( data );
      } else {
        throw err;
      }
    });
};

// get Instagram User not updated yet
exports.checkInstagramUsers = () => {
  console.log('====CHECK INSTAGRAM USERS====');
  
  InstagramUser.find({ isPrivate: false, isUpdated: false })
    .sort({'username': 1})
    .exec( function(err, users) {
      if ( !err ) {
        checkNewUsers( users ) ;
      } else {
        throw err;
      }
    })
  ;
};


exports.instagrammer = ( username ) => {
  return Client.Account.searchForUser(session, username);
};

exports.saveInstagramUsers = ( usersData ) => {
  let users = [].concat( usersData || [] );

  return users.forEach(function( user ) {
    InstagramUser.findOne({ id: user.id }, function( err, u ) {
      if ( err ) throw err;

      // existing user found, stop registration
      if ( u ) {
        return;
      }

      var newUser = InstagramUser({
        id: user.id,
        name: user.params.fullName,
        username: user.params.username,
        picture: user.params.picture,
        isPrivate: user.params.isPrivate,
        isGoodCandidate: false,
        isUpdated: false,
        isLiked: false,
        isFollowed: false
      });

      // save the user
      return newUser.save(function(err) {
        if ( err ) throw err;
        console.log(`🤖  user ${user.params.username} created!`);
      });
    })
    .then(function() {
      console.log('-----------finished----------------');
      return Promise.resolve();
    });
  });
};

exports.getUsersAutolike = () => {
  return InstagramUser.find({ isPrivate: false, isGoodCandidate: true, isLiked: false, isFollowed: false })
    .sort({'username': 1})
    .exec( function( err, users ) {
      if ( err ) {
        Promise.reject( err );
      }
      Promise.resolve( users );
    })
  ;
};

exports.getUsersAutofollow = () => {
  return InstagramUser.find({ isPrivate: false, isGoodCandidate: true, isLiked: true, isFollowed: false})
    .sort({'username': 1})
    .exec( function( err, users ) {
      if ( err ) {
        Promise.reject( err );
      }
      Promise.resolve( users );
    })
  ;
};


exports.deleteAll = () => {
  return InstagramUser.remove({}, function(err) { 
    console.log('collection InstagramUser removed') ;
    Promise.resolve();
  });
};

// Private Methods

checkNewUsers = ( newUsers ) => {
  newUsers.forEach(function( user, index ) {
    setTimeout(function() {
      if ( index >= Conf.analyzeUsersLimit ) {
        return;
      }

      Client.Account.getById( session, user.id ).then(function( data ) {
        goodCandidate( data.params.id, data.params.followingCount, data.params.followerCount );
      });

    }, _.random(2000, 3000) * index);
  });
};

goodCandidate = ( userID, followingCount, followerCount ) => {
  let isGoodCandidate = false;

  console.log("following: ", followingCount, "follower: ", followerCount);

  if ( isGoodCandidate = ( followingCount / followerCount >= Conf.goodCandidateRatio ) ) {
    console.log('Good fella! 🍀');
  }

  InstagramUser.findOneAndUpdate(
    { 'id': userID },
    { $set:{ 
      'isGoodCandidate': goodCandidate, 
      'isUpdated': true,
      'followings': followingCount,
      'followers': followerCount
    } },
    { new: true }, function(err, doc) {
    if ( err ) {
      console.log("Something wrong when updating data! -- goodCandidate");
    }
  });
};
