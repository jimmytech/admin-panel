'use strict';

const jwt                 = require('jsonwebtoken');

exports.run = (req, key, callback) => {

	let token = req.headers.authorization.replace('Bearer ', "");

	jwt.verify(token, new Buffer(key).toString('base64'), function(err, decodedToekn){
		
		let id = decodedToekn._doc._id;
		
		callback(id);

	});	

};