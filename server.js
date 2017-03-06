'use strict';

require('dotenv').config({silent: true});

const express 		= require('express'),
	helmet 			= require('helmet'),
	path 			= require('path'),
	bodyParser 		= require('body-parser'),
	app 			= express(),
	routes 			= require('./config/routes.js'),
	index 			= require(path.resolve('./modules/backend/controllers/index')),
	config			= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
	server 			= require('http').createServer(app),
	io 				= require('socket.io')(server);



	app.use(helmet());
	app.use(bodyParser.urlencoded({
	    extended: true
	}));

	app.use(bodyParser.json());

	app.use(express.static(__dirname + '/public'));

	/*require database file*/
	require('./database/db.js');


	/*require socket.js file*/
	require('./modules/socket/socket.js')(io);


	app.use('/', routes.user);
	app.use('/admin', routes.admin);


// if(process.env.NODE_ENV === 'production'){
// 	app.use((err, req, res, next) => {

// 		if(err){
// 			res.status(err.status || 500).json({
// 				errors: {
// 					source: err,
// 					message: 'Some error occurred, see log for more info!!',
// 					success: false
// 				}	
// 			});
// 			logger.log('error', err);		
// 		}
// 		next();
// 	});	
// } else if(process.env.NODE_ENV === 'test'){
// 	app.use((err, req, res, next) => {
// 		if(err){
// 			res.status(500).send(err);
// 		}
// 		next();
// 	});
// }  else {
// 	app.use((err, req, res, next) => {
// 		if(err){
// 			res.status(err.status || 500).json({
// 				errors: {
// 					source: err,
// 					code: err.code,
// 					message: err.message || 'Some error occurred, see log for more info!!',
// 					success: false
// 				}	
// 			});
// 			logger.log('error', err);		
// 		}
// 		next();
// 	});	
// }






server.listen(config.server.PORT , function(){	
	index.adminAccount();	
  console.log('listening on', server.address().port);
});

