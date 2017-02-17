'use strict';

require('dotenv').config({silent: true});

const express 		= require('express'),
	path 			=require('path'),
	http 			= require('http'),
	bodyParser 		= require('body-parser'),
	mongoose 		= require('mongoose'),
	app 			= express(),
	index 			= require(path.resolve('./controllers/backend/index')),
	config			= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
	server 			= require('http').createServer(app);


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
var router = express.Router();



require('./database/db.js');
var routes = require('./config/routes.js');

// app.use('/', routes.router);
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

