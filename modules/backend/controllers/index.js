'use strict';

const  mongoose 		= require('mongoose'),
	path				= require('path'),
	crypto				= require('crypto'),
	v8 					= require('v8'),
	adminModel          = require(path.resolve('./modules/backend/models/admin_model'));


exports.checkAdminAccount = (req, res)=>{
	adminModel.findOne({
	    role: 'admin',
	}, (err, result) => {
	    if (!result) {
	        var admin = {
	            email: 'admin@peach.com',
	            password: '123456',
	            role: 'admin',
	            auth: crypto.randomBytes(10).toString('hex')
	        };
	        var user = new adminModel(admin);
	        user.save((err, result) => {
	        	console.log(err || result);
	        });
	    }
	});
};
