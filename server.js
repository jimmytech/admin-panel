'use strict';


require('dotenv').config({silent: true});

const express 		= require('express'),
	helmet 			= require('helmet'),
	path 			= require('path'),
	bodyParser 		= require('body-parser'),
	app 			= express(),
	server 			= require('http').createServer(app),	
	io 				= require('socket.io')(server),
	routes 			= require('./config/routes'),
	admin 			= require(path.resolve('./modules/backend/controllers/index')),
	config			= require(path.resolve(`./config/env/${process.env.NODE_ENV}`));
;

	/*helmet used to secure headers*/

	app.use(helmet());
	app.use(bodyParser.urlencoded({
	    extended: true
	}));

	/*bodyParser used to extract incoming request*/
	app.use(bodyParser.json());

	/*set static*/
	app.use(express.static(__dirname + '/public'));

	/*require database file to connect mongoDB*/
	require('./config/libs/mongoose');

	/*require socket.js file*/
	require('./modules/socket/socket.js')(io);

	app.use('/', routes.router);
	app.use('/admin', routes.router);

server.listen(config.server.PORT || 3000, function(){

	admin.checkAdminAccount();	
	console.log('listening on', server.address().port);

});

