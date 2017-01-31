const _ = require('lodash');
const Promise = require('bluebird');
const mongoose = require('mongoose');


const Conf = require('../config/users.js');
const Client = require('instagram-private-api').V1;
const currentUser = Conf.user;
const device = new Client.Device( currentUser.username );
const storage = new Client.CookieFileStorage('./public/cookies/'+ currentUser.username +'.json');
const session = new Client.Session(device, storage);


exports.login = () => {
	return Client.Session.create( device, storage, currentUser.username, currentUser.password );
}