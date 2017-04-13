'use strict';
const path 		= require('path'),
	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
	Admin 	 	= require(path.resolve('./models/Admin')),
	_ 			= require('lodash'), 
	crypto 		= require('crypto'),
	jwt 		= require('jsonwebtoken');

/*
* This function will used to extract the data from jwt token
* and return user data
*/
exports.getUserByToken = (authorization, cb) => {
	try{
		let tokenArr = authorization.split(" ");
		jwt.verify(tokenArr[1], new Buffer(config.secret).toString('base64'), function(err, decoded){
			if( err ){
				cb(err);
			} else {
				cb(null, decoded._doc);	
			}
		});
		
	} catch(e){
		cb(e);
	}
};

/* create superAdmin account if superAdmin does not exit*/
exports.checkAdminAccount = (req, res, next) => {
	Admin.findOne({role: 'superAdmin'},(err, admin)=>{
		if ( _.isEmpty(admin) || _.isNull(admin) ) {
			let doc = {
				email: 'admin@cherrydoor.com',
				password: '123456',
				role: 'superAdmin',
				auth: crypto.randomBytes(10).toString('hex'),
				admin_type: 'website',
				admin_access : 'poweruser'
			};
			let user = new Admin(doc);
			user.save((error, account)=>{		
			});
		}
	});
};