'use strict';
/*
* This package is used to define the environment variables
* in '.env' file - @ https://www.npmjs.com/package/dotenv
*/
require('dotenv').config({silent: true});
/*
* All the required node packages
*/
const express 	= require('express'),
	app 		= express(),
	http 		= require('http').Server(app),
	bodyParser 	= require('body-parser'),
	morgan 		= require('morgan'),
	mongoose 	= require('mongoose'),
	path 		= require('path'),
	helmet 		= require('helmet'),
	compress 	= require('compression'),
	routes 		= require(path.resolve('./config/routes')),
	configs 	= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
	logger 		= require(path.resolve('./config/lib/logger')),
	indexCtrl   = require(path.resolve('./controllers/User/indexCtrl'));


/**
* Configure Helmet headers configuration
* Use helmet to secure Express headers
*/
app.use(helmet());


/*
* Connect with the mongodb database and set mongoose debug Level
* @ https://www.npmjs.com/package/mongoose
*/
mongoose.Promise = require('bluebird');
mongoose.connect(configs.db.URL, {autoReconnect: true});

/* Node.js compression middleware
* The middleware will attempt to compress response bodies for all request that traverse through the middleware
* Should be placed before express.static
*/
app.use(compress({
    filter: function (req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
}));
/*
* Serving static files in Express using express static middleware
* these files will be access publicly
*/
app.use(express.static(`${__dirname}/public`));

/*
* uncomment the following when the favicon is available
* Initialize favicon middleware
*/
// app.use(favicon(`${__dirname}/public/images/favicon.ico`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
* we have setting up the morgan logging option
*/
app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()));




/* Register all your routes */

app.use('/', routes.router);
app.use('/admin', routes.admin);


/*
* Start the node server using node 'http' package
*/
http.listen(configs.server.PORT, () => {
	indexCtrl.checkAdminAccount();
    console.log(`Listening on server port:${configs.server.PORT}`);

});

/*
* Global Error handlers middlerware to log all the error
*/
if(process.env.NODE_ENV === 'production'){
	app.use((err, req, res, next) => {

		if(err){
			res.json({
				errors: {
					source: err,
					message: 'Some error occurred, try after sometime!!',
					success: false
				}	
			});
			logger.log('error', err);		
		}
		next();
	});	
} else if(process.env.NODE_ENV === 'test'){
	// do nothing
	app.use((err, req, res, next) => {
		if(err){
			res.send(err);
		}
		next();
	});
}  else {
	app.use((err, req, res, next) => {
		if(err){
			res.status(err.status || 500).json({
				errors: {
					source: err.errors || err,
					code: err.code,
					message: err.message || 'Some error occurred, try after sometime!!',
					success: false
				}	
			});
			logger.log('error', err);		
		}
		next();
	});	
}


// Todos
// Enable CSRF protection

/*
* we need app package for tests so we are exporting this for our tests
*/
module.exports = app;