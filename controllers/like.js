var _ = require('lodash');
var async = require('async')
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


// Public Methods

exports.likeMyFeed = () => {
  let myFeed = new Client.Feed.Timeline( session );
  return getMyFeed( myFeed, Conf.limitLikePages )
    .then(function( results ) {
      let media = _.flatten( results );
      for ( let i = 0; i < media.length; i++) {
        QueueWorker.addLikesToQueue( media[ i ], i );
      }
      return Promise.resolve( media );
    })
  ;
};

exports.likeUsersMedia = ( users ) => {
  let counter = 0;

  users.forEach(function( user, index ) {
    console.log('======LIKE======');
    console.log(user);

    var feed = new Client.Feed.UserMedia(session, user.id);

    feed
      .get()
      .then(function( results ) {
        let randomInt = uniqueRandomInts(results.length - 1, Conf.likePerUser);
        randomInt.map(function( idx ) {
          // passing the user.id will update the model with `isLiked = true`
          console.log(counter, ') liking: ', user.username, user.picture);
          QueueWorker.addLikesToQueue( results[ idx ], counter++, user.id );  
        });

        // then follow 
        console.log(counter, ') following: ', user.username);
        QueueWorker.addFollowToQueue( user, counter++, user.id );
      })
    ;
  });

};


// Private Methods

function getMyFeed( feed, limit ) {
  return Promise.map( _.range(0, limit), function() {
    return feed.get();
  });
}

uniqueRandomInts = (upperLimit, amount) => {
  let possibleNumbers = _.range(upperLimit + 1);
  let shuffled = _.shuffle(possibleNumbers);
  return shuffled.slice(0, amount);
};