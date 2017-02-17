'use strict';
const mongoose = require('mongoose'),
    path = require('path'),
    config = require(path.resolve(`./config/env/${process.env.NODE_ENV}`));


let splited = config.db.URL.split("/");
let db = splited[splited.length -1];

mongoose.set('debug', true);

mongoose.connect(config.db.URL);

mongoose.connection.on('connected', (err, result) => {
    console.log(`Successfully connected to DB: ${db}`);
});

mongoose.connection.on('error', (err) => {
    console.log(`Failed to connect to DB: ${db}, ${err}`);
});

mongoose.connection.on('disconnected', (err) => {
	console.log(`Default connection to DB: ${db} disconnected`)
});