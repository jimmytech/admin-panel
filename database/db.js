'use strict';
const mongoose = require('mongoose'),
    path = require('path'),
    config = require(path.resolve(`./config/env/${process.env.NODE_ENV}`));


/*get database name from URL*/
let splited = config.db.URL.split("/");
let db = splited[splited.length -1];

/*turn on debug mode*/
mongoose.set('debug', true);


/*connect mongoDB*/
mongoose.connect(config.db.URL);

/*if database connected successfully*/
mongoose.connection.on('connected', (err, result) => {
    console.log(`Successfully connected to DB: ${db}`);
});

/*if unable to connect to DB*/
mongoose.connection.on('error', (err) => {
    console.log(`Failed to connect to DB: ${db}, ${err}`);
});

/*if connection has been break due to any reason*/
mongoose.connection.on('disconnected', (err) => {
	console.log(`Default connection to DB: ${db} disconnected`)
});