'use strict';
require('../models/user_model');
const  mongoose = require('mongoose'),
	crypto = require('crypto'),
	v8 = require('v8'),
	userModel = mongoose.model('userModel');
exports.adminAccount = (req, res)=>{
	userModel.findOne({
	    'role': 'admin'
	}, (err, result) => {
	    if (!result) {
	        var admin = {
	            email: 'admin@admin.com',
	            password: '123456',
	            role: 'admin',
	            auth: crypto.randomBytes(10).toString('hex')
	        };
	        var user = new userModel(admin);
	        user.save((err, result) => {
	        	console.log();
	        });
	    }
	});
};

// setTimeout(function () {
// 		console.log(v8.getHeapStatistics());
// 		// console.log(v8.getHeapSpaceStatistics());
// }, 3000);