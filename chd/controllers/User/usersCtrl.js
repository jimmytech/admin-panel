'use strict';
const jwt 	 	= require('jsonwebtoken'),
	path 	 	= require('path'),
	crypto 	 	= require('crypto'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	User 	 	= require(path.resolve('./models/User')),
	mail 	 	= require(path.resolve('./config/lib/mail')),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
  	paginate    = require(path.resolve('./config/lib/paginate')),
  	response 	= require(path.resolve('./config/lib/response'));

exports.login = (req, res) => {
	if(!req.body.email || !req.body.password) {
		res.json({
			errors: {
				message: 'Email and password are required', 
				name: 'Authentication failed',
				success: false,
			}	
		});
		return;
	}	
	User.findOne({ email: req.body.email }, {reset_password: 0, salt: 0, bank: 0, tenant_enquiries: 0, intrested_zip: 0},(err, user, next) => {
		if(err){
			next(err);                                              
		} else {
			let errors = {}, error = false;
			switch(_.isNull(user) || !_.isNull(user)){
				// 1. IF User Not Found in Database
				case _.isNull(user):
					errors = { name: 'Authentication failed', message: 'Authentication failed. User not found.', success: false};
					error = true;
					break;

				// 2. IF User Email is Not Verified
				case (!user.email_verified):
					errors = { name: 'Authentication failed', message: 'Your email is not verified, kindly verify your email.', success: false};
					error = true;
					break;

				// 3. IF User has deactivate his account
				case (user.deactivate):
					errors = { name: 'Authentication failed', message: 'Your account is deactivate.', success: false};
					error = true;
					break;

				// 4. IF Admin has Deactivate User Account
				case (!user.status && user.email_verified):
					errors = { name: 'Authentication failed', message: 'Your account is deactivated by admin, please contact admin.', success: false};
					error = true;
					break;

				default: 
					error = false;
			}
			
			if(error){
				res.json( response.errors( errors ) );
			} else {
				if(user.comparePassword(config.salt, req.body.password)){
					// Remove sensitive data before sending user object
					user.password = undefined;
					let token = jwt.sign(user, new Buffer(config.secret).toString('base64'), {expiresIn: '1 day'});
					res.json(
						response.success({ 
							user: user, 
							token: token, 
							success: true, 
							message: 'login success'
						})
					);
				} else {
					res.json(
						response.errors({ 
							name: 'Authentication failed', 
							message: 'Authentication failed. Wrong password.',
							success: false,
						})
					);
				}
			}
		}
	});
};

exports.verifyEmail = (req, res, next) => {
	User.findOneAndUpdate(
		{ "salt": req.params.salt, "email_verified": false },
		{ "email_verified": true, "salt": null, "status": true },
		{ new: true, runValidators: true, setDefaultsOnInsert: true, fields: {email: 1} },
		function(err, user){
    		if(err || !user){
    			// to-do should be redirect on expired or invalid link page
    			if(process.env.NODE_ENV === 'test'){
    				return res.sendStatus(400);
    			}
    			res.redirect('/#/invalid-email-link');
    		} else {
    			if(process.env.NODE_ENV === 'test'){
    				return res.sendStatus(200);
    			}
    			// to-do should be redirect on user dashboard with success message
				res.redirect('/#/login?emailVerified=true');
    		}
    	}
    );
};

exports.register = function(req, res, next) {
	if( _.includes(['tenant1','tenant2','tenant3'], req.body.role) ){
		req.body.role = 'tenant';
	}
	let user = new User({ firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, password: req.body.password, role: req.body.role });
	user.save(function(err, user) {
		if(err){
			err.errors.success = false;
			err.errors.message = err.message || 'User validation failed';
			err.errors.name = err.name || 'ValidationError';
			res.json(
				response.errors(err.errors)
			);
		} else {
			mail.send({
				subject: 'New User Registration',
				html: './public/mail/user/mail.html',
				from: config.mail.from, 
				to: req.body.email,
				emailData : {
		   		    email: req.body.email,
		   		    href: `${config.server.host}:${config.server.PORT}/verifyEmail/${user.salt}`
		   		    //let baseUrl = `${req.protocol}://${req.headers.host}`;
		   		}
			}, function(err, success){
				if(err){
					user.remove({email: req.body.email});
					res.json(
						response.errors({
							source: err,
							message: 'Failure sending email, please try again',
							success: false
						})
			        );
				} else {
					// Remove sensitive data before sending user object
					user.password = undefined;
					res.json(
						response.success({
							info: success,
							record: user,
							message: 'User registered successfully and verification link is send to registered email address', 
							success: true
						})	
					);
				}
			});
		}
	});
};

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = (req, res, next) => {
	if(!req.body || !req.body.email){
		res.json(
			response.errors({
				message: 'Email field is required', 
				success: false,
			})	
		);
		return;
	}
	async.waterfall([
		// find the user
		function(done){
			User.findOne({ email: req.body.email, role: { $ne: "admin" } }, 'email email_verified deactivate status',function(err, user){
				if(err){
					done(err, null);
				} else {
					let errors = null, error = false;
					switch(_.isNull(user) || !_.isNull(user)){
						// 1. IF User Not Found in Database
						case _.isNull(user):
							errors = { name: 'Authentication failed', message: 'No account with that email has been found', success: false};
							error = true;
							break;

						// 2. IF User Email is Not Verified
						case (!user.email_verified):
							errors = { name: 'Authentication failed', message: 'Your email is not verified, kindly verify your email.', success: false};
							error = true;
							break;

						// 3. IF User has deactivate his account
						case (user.deactivate):
							errors = { name: 'Authentication failed', message: 'Your account is deactivate.', success: false};
							error = true;
							break;

						// 4. IF Admin has Deactivate User Account
						case (!user.status && user.email_verified):
							errors = { name: 'Authentication failed', message: 'Your account is deactivated by admin, please contact admin.', success: false};
							error = true;
							break;

						default: 
							error = false;
					}
					done(errors, user);
				}
			});
		},
		// Generate random token
		function (user, done) {
			crypto.randomBytes(20, function (err, buffer) {
				let token = buffer.toString('hex');
	        	done(err, user, token);
	      	});
	    },
	    // Lookup user by email
	    function (user, token, done) {
			User.update(
				{_id: user._id},
				{ reset_password: { token: token, timestamp: Date.now() + 86400000, status: true} }, 
				{ runValidators: true, setDefaultsOnInsert: true },
				function(err, result){
					done(err, token, user, result);
				}
			);
	    },
		// If valid email, send reset email using service
		function(token, user, done){
			let baseUrl = `${req.protocol}://${req.headers.host}`;
			mail.send({
				subject: 'Reset your password',
				html: './public/mail/user/reset-password.html',
				from: config.mail.from, 
				to: user.email,
				emailData : {
		   		    url: `${baseUrl}/reset/${token}`
		   		}
			}, function(err, success){
				if(err){
					res.json(
						response.errors({
							source: err,
							message: 'Failure sending email',
							success: false
						})
			        );
				} else {
					res.json(
						response.success({
							success: true,
			        		message: 'An email has been sent to the provided email with further instructions.'
						})	
			        );
				}
			});
		}
	], function (err) {
		if(err){
			res.json( response.errors( err ) );
		}
	});
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = (req, res, next) => {
	User.count({ "reset_password.token": req.params.token, "reset_password.timestamp": { $gt: Date.now() }, "reset_password.status": true } , function(err, user){
    	if(user === 0){
    		if(process.env.NODE_ENV === 'test'){
    			return res.sendStatus(400);
    		}
    		return res.redirect('/#/invalid-password');
    	} else {
	    	if(process.env.NODE_ENV === 'test'){
				return res.sendStatus(200);
			}
			res.redirect(`/#/reset/${req.params.token}`);	
    	}
    });
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {

	async.waterfall([
		function(done){
			User.findOne(
				{ "reset_password.token": req.params.token, "reset_password.timestamp": { $gt: Date.now() }, "reset_password.status": true }, 
				{email: 1, password: 1, reset_password: 1, firstname:1},
				function(err, user){
					if(!err && user){
						user.password = req.body.password;
						user.reset_password = {
							status: false
						};
						user.save(function(err, saved){
							if(err){
								return next(err);
							} else {
								// Remove sensitive data before return authenticated user
	                    		user.password = undefined;
								res.json(
									response.success({
										success: true,
										message: 'Password has been changed successfully.'
									})	
								);
								done(err, user);
							}
						});
					} else {
						res.json(
							response.errors({
								source: err,
								success: false,
				        		message: 'Password reset token is invalid or has been expired.'	
							})
				        );
					}	
				}
			);	
		},
		function(user, done){
			mail.send({
				subject: 'Your password has been changed',
				html: './public/mail/user/reset-password-confirm.html',
				from: config.mail.from, 
				to: user.email,
				emailData : {
					firstname: user.firstname || 'User'
				}
			},done);
		}
	], function (err) {
		if (err) {
			return next(err);
		}
	});
};

/**
 * get user profile 
 */
exports.profileById = function (req, res, next) {
	User.findById(req.params.id,'-reset_password -salt -auth -i -password -last_edited_by',(error, profileUser) => {
        if(profileUser){
            res.json( 
				response.success({
					record: profileUser, 
					success: true, 
					message: 'success'
				})
			);		
        } else {
            res.json(
				response.errors({
                	message: 'No user found.',
                	success: false
				})	
            );
        }
    });
};

/**
 * generate token from email
 */
exports.generateToken = function (req, res, next) {

	if(_.isEmpty(req.body.email)){
		return res.json(
			response.errors({
				name: 'Authentication failed',
				message: 'Email is required.',
				success: false
			})	
		); 
	}

	User.findOne({ 'email': req.body.email}, '-reset_password -salt -auth -i -password -last_edited_by',(error, user) => {
        if(user){
        	// delete unnecessary data from user
			user.password = undefined;
			let token = jwt.sign(user, new Buffer(config.secret).toString('base64'), {expiresIn: '1 day'});
			res.json( 
				response.success({
					token: token, 
					success: true
				})	
			);
        } else {
            return res.json(
				response.errors({
                	name: 'Authentication failed',
                	message: 'User email did not match.',
                	success: false
				})	
			);
        }
    });
};

// This function will save save properties in users account
exports.saveProperty = function(req, res, next){
	let userid = req.params.userid;
	let propertyid = req.body.propertyid;
	if(!propertyid){
	 	return res.json(
			response.errors({
            	message: 'No property to save',
            	success: false
			})	
		);
	}

	async.waterfall([
		function (done) {
			User.count({ _id: userid, save_property: { $elemMatch: { property_id: mongoose.Types.ObjectId(propertyid) } } }, function (err, result) {
				done(err, result);
			});
		},
		function (result, done) {
			let operation =  (result > 0) ? 
				{ $pull: { save_property: { property_id: mongoose.Types.ObjectId(propertyid) } } } : 
				{ $push: { save_property: {property_id: mongoose.Types.ObjectId(propertyid), saved_at: new Date()} } };
		
			User.findOneAndUpdate({ _id: userid }, operation,
				{ new: true, runValidators: true, setDefaultsOnInsert: true },
				function (err, record) {
					done(err, record, result);
				}
			);
		}
	], function (err, record, result) {
		if(err){
			return res.json( response.errors( err ) );
		}

		res.json(
			response.success({
				record: record,
				message: (result > 0) ? 'Property has removed successfully from saved properties.' : 'Property saved successfully',
				success: true
			})	
		);
	});

};

/* This function will return all the saved properties of user */
exports.getSaveProperties = function(req, res, next) {
	let userid = req.params.userid;
	let page = req.query.page || 1;
	/* Sorting options */
    let sortBy = (req.query.sort) ? 
    	{ "save_property.saved_at": _.toNumber(req.query.sort) } : 
    	{ "save_property.saved_at": -1 };
    let porpertyFor = (req.query.propertyFor) ? 
    	{ "properties.isPublished":true, "properties.property_for": req.query.propertyFor } : 
    	{ "properties.isPublished":true};
	async.parallel({
		count: function (callback) {
			User.aggregate([
				{ $project: { _id: 1, save_property:1, properties:1 } },
				{ $match: { _id: mongoose.Types.ObjectId(userid), save_property: { $ne: [] } } },
				{ $unwind: "$save_property" },
				{ 
					$lookup: 
					{
						from: "properties",
						localField: "save_property.property_id",
						foreignField: "_id",
						as: "properties"
					}
				},
				{ $unwind: "$properties" },
				{ $match: { "properties.isPublished":true } },
				{
					$group: 
					{ 
						_id: "$properties.property_for", 
						count: { $sum : 1 }
					}
				}
			], function (err, result) {
				callback(err, result);
			});
		},
		properties: function (callback) {
			User.aggregate([
				{ $project: { _id: 1, save_property:1, properties:1 } },
				{ $match: { _id: mongoose.Types.ObjectId(userid), save_property: { $ne: [] } } },
				{ $unwind: "$save_property" },
				{ 
					$lookup: 
					{
						from: "properties",
						localField: "save_property.property_id",
						foreignField: "_id",
						as: "properties"
					}
				},
				{ $unwind: "$properties" },
				{ $match: porpertyFor },
				{
					$lookup: 
					{
						from: "users",
						localField: "properties.user_id",
						foreignField: "_id",
						as: "property_owner"
					}
				},
				{ $unwind: "$property_owner" },
				{ $project: { "properties": 1,"save_property":1,"property_owner._id": 1,"property_owner.firstname": 1,"property_owner.lastname": 1,"property_owner.email": 1,"property_owner.phone": 1,"property_owner.profile_image": 1 } },
				{ $addFields: { properties: { virtual_name: { $concat: [ "$properties.address.address1", ", ", "$properties.address.house_number", ", ", "$properties.address.postcode", ", ", "$properties.address.town", ", ", "$properties.address.county" ] } } } },
				{ $sort: sortBy },
		        { $skip: ( page-1 ) * config.docLimit },
		        { $limit: config.docLimit }
			], function (err, result) {
				callback(err, result);
			});
		}
	}, function (err, result) {
		let totalCount = 0; result.count.map(x => totalCount += x.count);
		
		if(err){
			return next(err);
		}
		res.json(
			response.success({
				records: result.properties,
				group: result.count,
				paging: paginate._paging(totalCount, result.properties, page),
				success: true
			})	
		);
	});
	
};

// Set Save searches for user
exports.set_save_search = function (req, res, next) {
	let userid = req.params.userid;
	async.waterfall([
		function (done) {
			User.count({ _id: userid, save_searches: { $elemMatch: { name: req.body.name } } },function (err, result) {
				done(err, result);
			});
		},
		function (count, done) {
			if(count === 0){
				User.update({_id: userid}, 
				{ $push: { save_searches: req.body } },
				{ runValidators: true, setDefaultsOnInsert: true },
				function (err, result) {
					done(err, result);
				});
			} else {
				res.json( 
					response.errors({
						message: 'You have already saved a search with same name',
						success: false
					})
				);
			}
		}
	], function (err, result) {
		if(err){
			return res.json( response.errors( err ) );
		}

		res.json(
			response.success({
				record: result,
				message: 'search saved successfully',
				success: true
			})	
		);
	});
};

// Get Save searches for user
exports.get_save_search = function (req, res, next) {
	let userid = req.params.userid;
	
	let pipeline = [
	{ $project: { save_searches: 1 } }, 
	{ $match: {"_id": mongoose.Types.ObjectId(userid) } }, 
	{ $unwind: "$save_searches" }];
	if(req.query.property_for !== undefined) {
		pipeline.push({$match: { "save_searches.channel": req.query.property_for } });	
	}
	async.parallel({
		saved_searches: function (callback) {
			User.aggregate(pipeline, function (err, result) {
				callback(err, result);
			});
		},
		counts: function (callback) {
			User.aggregate([
				{ $match: {"_id": mongoose.Types.ObjectId(userid) } },
				{ $unwind: "$save_searches" },
				{ 
					$group: 
					{ 
						_id: "$save_searches.channel", 
						count: { $sum : 1 }
					}
				}
			], function (err, result) {
				callback(err, result);
			});
		}
	},function (err, result) {
		if(err){
			return next(err);
		}
		res.json(
			response.success({
				record: {user: result.saved_searches, counts: result.counts},
				success: true
			})	
		);
	});
};