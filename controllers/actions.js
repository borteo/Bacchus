var _ = require('lodash');
var async = require('async')
var Promise = require('bluebird');
var mongoose = require('mongoose');
const fs = require('fs');

const likeController = require('./like');
const locationController = require('./location');
const relationshipsController = require('./relationships');
const instagramUserController = require('./instagram-user');
const Conf = require('../config/users.js');

// Views
exports.getActionsView = ( req, res ) => {
  res.render('actions', {
    title: 'Actions'
  });
};

exports.getUnfollowView = ( req, res ) => {
  res.render('unfollow', {
    title: 'Unfollow'
  });
};

/** ------ Methods ------**/
  
exports.currentUser = ( req, res, next ) => {
  res.send( Conf.user ); 
};

exports.instagramUsers = ( req, res, next ) => {
  instagramUserController
    .getInstagramUsers()
    .then(function( data ) {
      res.send( data );
    })
  ;
};

exports.saveConnections = ( req, res, next ) => {
  relationshipsController
    .cleanDB()
    .then(function() {
      return relationshipsController.getFollowings();
    })
    .then(function( followings ) {
      return [ followings, relationshipsController.getFollowers() ];
    })
    .spread(function(followings, followers) {
      relationshipsController.saveFollowers( followers );
      relationshipsController.saveFollowings( followings );
    })
    .then(function(filename) {
      console.log('merda',filename );
      res.send( "OKAY" );
    })
    .catch(function(err) { console.log(err); })
  ;
};

exports.connections = ( req, res, next ) => {
  relationshipsController
    .getConnections()
    .then(function( data ) {
      res.send( data );
    })
  ;
};


exports.unfollow = ( req, res, next ) => {
  relationshipsController.unfollow( req.body.jerks );
  req.flash('success', { msg: 'Jerks eliminated' });
  res.send('OKAY');
};


exports.location = ( req, res, next ) => {
  let location = req.params.location;

  if ( !location || location.length === 0 ) {
    res.statusMessage = "No locantion sent";
    res.status(400).end();
  }

  locationController.handleLocation( location, function() {
    res.send( "OKAY" );
  } );
};


exports.checkUsers = ( req, res, next ) => {
  instagramUserController.checkInstagramUsers();
  res.send( "OKAY" );
};


exports.instagrammer = ( req, res, next ) => {
  let username = req.params.username;
  let id;

  instagramUserController
    .instagrammer( username )
    .then(function( user ) {
      let count = user.params.followerCount;
      id = user.params.id    
  
      return relationshipsController.getFollowers( id );
    }).then(function( followers ) {
  
      console.log('followers', followers.length, followers[0]);

      return instagramUserController.saveInstagramUsers( followers );
    }).then(function() {
      res.send( "OKAY" );
    });
};

exports.autofollow = ( req, res, next ) => {
  instagramUserController
    .getUsersAutofollow()
    .then(function( users ) {
      relationshipsController.follow( users );
      res.send( "OKAY" );
    })
  ;
};

exports.autolike = ( req, res, next ) => {
  instagramUserController
    .getUsersAutolike()
    .then(function( users ) {
      likeController.likeUsersMedia( users );
      res.send( "OKAY" );
    })
  ;
};

exports.likeFeed = ( req, res, next ) => {
  likeController
    .likeMyFeed()
    .then(function( media ) {
      res.send( media );  
    })
  ;
};
