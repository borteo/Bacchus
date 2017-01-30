const _ = require('lodash');
const Promise = require('bluebird');

const Conf = require('../config/users.js');
const Client = require('instagram-private-api').V1;
const currentUser = Conf.user;
const device = new Client.Device( currentUser.username );
const storage = new Client.CookieFileStorage('./public/cookies/'+ currentUser.username +'.json');
const session = new Client.Session(device, storage);

const QueueWorker = require('./queue-worker.js');


exports.handleLocation = ( location, callback ) => {
  let medias = [];

  getLocations( location )
    .then(function( locations ) {
      return getMediaFromLocations( locations )
    })
    .then(function( media ) {
      medias = _.flatten( media );
      saveUsersFromMedia( medias )
    })
    .then(function() {
      callback();
    })
  ;
}

// return a promise
getLocations = ( location ) => {
  return Client.Location.search( session, location );
}


// return a promise
getMediaFromLocations = ( locations ) => {
  let promises = [];
  
  locations = locations.slice( 0, Conf.limitLocation );
  
  locations.forEach(function( location, index ) {  
    console.info('location: ', location.params.id, location.params.address );
    promises.push( Client.Location.getRankedMedia( session, location.params.id ) );
  });

  return Promise.all( promises );
}


function saveUsersFromMedia( medias ) {
  medias.forEach(function( media, index ) {
    QueueWorker.addUsersToQueue(media.account.params, index );
  });
}
